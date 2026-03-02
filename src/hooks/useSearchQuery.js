import { useQuery } from "@tanstack/react-query";
import { searchWebCSE } from "../services/googleCseService";

export default function useSearchQuery(query, activeTab, page, prefs, profileId) {
    const isEnabled = !!query.trim() && navigator.onLine;

    return useQuery({
        queryKey: ["search", activeTab, query, page, prefs.region, prefs.safe, prefs.perPage, profileId],
        queryFn: async () => {
            const start = performance.now();
            let data;
            let results = [];
            let hasNext = false;
            let totalResults = null;

            if (activeTab === "image") {
                data = await searchWebCSE(query, page, { ...prefs, searchType: "image" });
                const items = data?.items || [];
                results = items
                    .map((img) => ({
                        title: img?.title || "Image",
                        link: img?.link || "#",
                        displayLink: img?.displayLink,
                        image: {
                            contextLink: img?.image?.contextLink,
                        },
                    }))
                    .filter((x) => x.link && x.link !== "#");
                hasNext = !!data?.queries?.nextPage?.length;
                totalResults = data?.searchInformation?.formattedTotalResults || null;
            } else if (activeTab === "news") {
                // Use Google CSE for news as requested
                data = await searchWebCSE(query, page, prefs);
                const items = data?.items || [];
                results = items
                    .map((item) => ({
                        title: item?.title || "No title",
                        link: item?.link || "#",
                        snippet: item?.snippet || "No snippet available",
                        source: item?.displayLink || "News",
                        publishedAt: item?.pagemap?.metatags?.[0]?.["article:published_time"] || null,
                    }))
                    .filter((x) => x.link && x.link !== "#");
                hasNext = !!data?.queries?.nextPage?.length;
                totalResults = data?.searchInformation?.formattedTotalResults || null;
            } else {
                // Default to WEB
                data = await searchWebCSE(query, page, prefs);
                const items = data?.items || [];
                results = items
                    .map((item) => ({
                        title: item?.title || "No title",
                        link: item?.link || "#",
                        snippet: item?.snippet || "No snippet available",
                        displayLink: item?.displayLink,
                    }))
                    .filter((x) => x.link && x.link !== "#");
                hasNext = !!data?.queries?.nextPage?.length;
                totalResults = data?.searchInformation?.formattedTotalResults || null;
            }

            const end = performance.now();
            const timeTaken = ((end - start) / 1000).toFixed(2);

            return {
                results,
                hasNext,
                meta: {
                    totalResults,
                    timeTaken,
                },
            };
        },
        enabled: isEnabled,
        staleTime: 1000 * 60 * 30, // 30 minutes
        gcTime: 1000 * 60 * 60, // 1 hour
        retry: 1,
    });
}
