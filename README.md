# ODDE Search

ODDE Search is a modern meta search engine that aggregates results from multiple APIs to deliver fast and structured search results.
The system combines web search, news, and image results into a single interface while maintaining a lightweight and scalable backend architecture.

This project demonstrates how a search platform can be built using modern web technologies and deployed using cloud infrastructure.

---

## Live Deployment

Frontend
https://odde-search.vercel.app

Backend API
https://odde-search-backend.onrender.com

---

## Overview

ODDE Search retrieves information from multiple external data providers and merges the responses into a unified search experience. Instead of relying on a single search provider, the backend aggregates results from several APIs and formats them for the frontend.

The project is designed with a modular architecture that separates the frontend interface from the backend aggregation service.

---

## Key Features

* Unified search across multiple data sources
* Web search integration
* Real-time news results
* Image search support
* Cloud hosted backend API
* Secure environment variable management for API keys
* Modular and scalable architecture
* Responsive frontend interface

---

## System Architecture

```
User
 │
 ▼
Frontend (Vercel)
 │
 ▼
Node.js Backend (Render)
 │
 ├── Google Custom Search API
 ├── GNews API
 ├── RapidAPI
 └── Supabase (optional)
```

The frontend handles user interaction and display, while the backend communicates with external APIs and aggregates the results.

---

## Technology Stack

### Frontend

* HTML
* CSS
* JavaScript
* Vite

### Backend

* Node.js
* Express.js
* Axios
* dotenv

### External APIs

* Google Custom Search API
* GNews API
* RapidAPI
* Supabase

---

## Project Structure

```
odde-search
│
├── client
│   ├── index.html
│   ├── src
│   └── vite.config.js
│
├── server
│   ├── index.js
│   ├── package.json
│   └── routes
│
├── README.md
└── .gitignore
```

---

## Environment Configuration

Create a `.env` file inside the `server` directory.

```
PORT=5000

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

GOOGLE_CSE_KEY=your_google_api_key
GOOGLE_CSE_CX=your_search_engine_id

GNEWS_API_KEY=your_gnews_api_key

RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_HOST=your_rapidapi_host

IMAGE_API_HOST=your_image_api_host
```

Important:

* Do not commit `.env` files to GitHub.
* Configure the same variables in your deployment environment.

---

## Local Development

Clone the repository

```
git clone https://github.com/thenameisadityyaa/odde-search.git
cd odde-search
```

Install backend dependencies

```
cd server
npm install
```

Install frontend dependencies

```
cd ../client
npm install
```

Start backend server

```
cd server
node index.js
```

Backend will run on

```
http://localhost:5000
```

Start frontend

```
cd client
npm run dev
```

Frontend will run on

```
http://localhost:5173
```

---

## Deployment

### Backend (Render)

Configuration used for deployment:

```
Runtime: Node
Root Directory: server
Build Command: npm install
Start Command: node index.js
```

Environment variables must be configured in the Render dashboard.

---

### Frontend (Vercel)

Add the backend URL as an environment variable in Vercel:

```
VITE_BACKEND_URL=https://odde-search-backend.onrender.com
```

Redeploy the project after adding the variable.

---

## Performance Notes

The backend is deployed on the Render free tier. Free instances may go to sleep after periods of inactivity. The first request after inactivity may take several seconds while the service wakes up.

---

## Future Improvements

* AI-based search ranking
* Search suggestions
* Query caching
* Trending searches
* Browser extension
* Advanced filtering options

---

## License

This project is licensed under the MIT License.

---

## Team

This project was developed collaboratively by the following team members:

**Aditya Sharma**
Computer Science Engineering
GIET University
GitHub: https://github.com/thenameisadityyaa

**Subham Mallick**
Contributor
GitHub: https://github.com/subhammllick

**Abhipsa Patnaik**
Contributor

The team worked on the design, development, and deployment of the ODDE Search platform, including frontend development, backend API integration, and system deployment.

---

<div align="center">

<img src="https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUyZmJqcDU4dW5kcmY3cWg1aGpodmZoZnR4cDAxYnE1OXZuMDM1Ym1lciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/uOAyXaREzn6Noz5yrZ/giphy.gif" width="100%" />

<br>

</div>

