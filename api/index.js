const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const CACHE_COLLECTION = "search_cache";
const MOCK_COLLECTION = "mock_results";
const DEFAULT_EXPIRY_HOURS = 24;
const API_TIMEOUT = 5000; // 5 seconds

// --- Helper Functions ---

async function getMockResultsFromDB(query, searchType) {
    try {
        const { data, error } = await supabase
            .from(MOCK_COLLECTION)
            .select("title, link, snippet, display_link")
            .ilike("query_match", `%${query.toLowerCase().trim()}%`)
            .eq("search_type", searchType)
            .limit(5);

        if (error) {
            console.error("Mock query error:", error.message);
            return [];
        }
        
        return data.map(m => ({
            title: m.title,
            link: m.link,
            snippet: m.snippet,
            displayLink: m.display_link,
            isMock: true // Internal flag
        }));
    } catch (err) {
        return [];
    }
}

async function getCachedResult(query, searchType, pageNum) {
    try {
        const { data, error } = await supabase
            .from(CACHE_COLLECTION)
            .select("results, expires_at")
            .eq("query", query.toLowerCase().trim())
            .eq("search_type", searchType)
            .eq("page", pageNum)
            .maybeSingle();

        if (error) return null;
        if (data && new Date(data.expires_at) > new Date()) return data.results;
        return null;
    } catch (err) {
        return null;
    }
}

async function saveToCache(query, searchType, pageNum, options, results) {
    try {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + DEFAULT_EXPIRY_HOURS);

        const payload = {
            query: query.toLowerCase().trim(),
            search_type: searchType,
            page: pageNum,
            options: options,
            results: results,
            expires_at: expiresAt.toISOString(),
        };

        await supabase.from(CACHE_COLLECTION).upsert([payload], { onConflict: "query,search_type,page" });
    } catch (err) {
        console.error("Cache save error:", err.message);
    }
}

// --- Search Handlers ---

async function fetchWebSearch(query, page, options) {
    const perPage = options.perPage || 10;
    const start = (page - 1) * perPage + 1;
    const res = await axios.get("https://www.googleapis.com/customsearch/v1", {
        params: {
            key: process.env.GOOGLE_CSE_KEY,
            cx: process.env.GOOGLE_CSE_CX,
            q: query,
            start,
            num: Math.min(perPage, 10),
            safe: (options.safe === 'true' || options.safe === true) ? "active" : "off",
            gl: options.region || "in",
        },
        headers: {
            // Try setting a Referer that matches your Google Console restriction
            "Referer": "http://localhost:5173", 
        },
        timeout: API_TIMEOUT
    });
    return res.data;
}

async function fetchNewsSearch(query, page, options) {
    const perPage = options.perPage || 10;
    const res = await axios.get("https://gnews.io/api/v4/search", {
        params: {
            q: query,
            token: process.env.GNEWS_API_KEY,
            lang: "en",
            country: options.region || "in",
            max: perPage,
            page,
        },
        timeout: API_TIMEOUT
    });
    return res.data;
}

async function fetchImageSearch(query, page, options) {
    const perPage = options.perPage || 10;
    const start = (page - 1) * perPage + 1;
    const res = await axios.get("https://www.googleapis.com/customsearch/v1", {
        params: {
            key: process.env.GOOGLE_CSE_KEY,
            cx: process.env.GOOGLE_CSE_CX,
            q: query,
            start,
            num: Math.min(perPage, 10),
            safe: (options.safe === 'true' || options.safe === true) ? "active" : "off",
            gl: options.region || "in",
            searchType: "image"
        },
        headers: {
            "Referer": "http://localhost:5173", 
        },
        timeout: API_TIMEOUT
    });
    return res.data;
}

// --- API Endpoints ---

app.get('/api/search', async (req, res) => {
    const { q, type = 'web', page = 1, ...options } = req.query;
    const pageNum = parseInt(page);

    if (!q) return res.status(400).json({ error: "Query parameter 'q' is required" });

    try {
        // 1. Try Cache
        const cached = await getCachedResult(q, type, pageNum);
        if (cached) {
            console.log(`[Cache Hit] ${type}: ${q}`);
            return res.json({ ...cached, _source: 'cache' });
        }

        // 2. Fetch from API + DB Mock Data simultaneously
        console.log(`[Hybrid Search] ${type}: ${q}`);
        let apiResults;
        let mockItems = [];

        try {
            // Concurrent fetching for speed
            const [apiRes, dbMocks] = await Promise.all([
                (async () => {
                    if (type === 'web') return await fetchWebSearch(q, pageNum, options);
                    if (type === 'news') return await fetchNewsSearch(q, pageNum, options);
                    if (type === 'image') return await fetchImageSearch(q, pageNum, options);
                    throw new Error("Invalid search type");
                })(),
                getMockResultsFromDB(q, type)
            ]);
            
            apiResults = apiRes;
            mockItems = dbMocks;
            console.log(`[Hybrid Status] Found ${mockItems.length} DB mocks and ${apiResults.items?.length || 0} API results`);
        } catch (apiError) {
            const details = apiError.response?.data?.error?.message || apiError.message;
            if ((details.includes("referer") || details.includes("timeout")) && type === 'web') {
                console.warn("[Backend Tip] API blocked/timed out. Falling back to local samples.");
                apiResults = getSampleWebData(q);
                mockItems = await getMockResultsFromDB(q, type); // Still try to get mocks
            } else {
                throw apiError;
            }
        }

        // 3. Merge results (Mocks first for the user to see them)
        const finalResults = {
            ...apiResults,
            items: [...mockItems, ...(apiResults.items || [])],
            _source: 'api'
        };

        // 4. Save to Cache
        await saveToCache(q, type, pageNum, options, finalResults);

        res.json(finalResults);
    } catch (error) {
        console.error("Search Error:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: "Backend Search Error",
            details: error.response?.data?.error?.message || error.message
        });
    }
});

function getSampleWebData(query) {
    return {
        searchInformation: { formattedTotalResults: "1,200", timeTaken: "0.45" },
        items: [
            {
                title: `Sample Result for "${query}": Understanding Dedicated Backends`,
                link: "https://example.com/backend-guide",
                snippet: "This is a professional sample result from your dedicated backend server. It ensures you see data even if your API keys are still being configured.",
                displayLink: "example.com"
            },
            {
                title: "How to Authorize your Server in Google Cloud",
                link: "https://cloud.google.com/docs/authentication/api-keys#adding-http-restrictions",
                snippet: "Go to Google Cloud Console > APIs & Services > Credentials. Edit your API key and add your server's IP address or domain under 'Application restrictions'.",
                displayLink: "cloud.google.com"
            },
            {
                title: "Advanced Caching Patterns with Supabase",
                link: "https://supabase.com/docs/guides/database",
                snippet: "Learn how to use Supabase as a high-performance backend cache for your search application to reduce latency and API costs.",
                displayLink: "supabase.com"
            }
        ]
    };
}

module.exports = app;
