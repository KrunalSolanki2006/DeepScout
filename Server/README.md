<div align="center">

# ⚙️ DeepScout Server

**Backend API & AI Research Investigation Engine**

Built with **Node.js**, **Express v5**, **MongoDB / Mongoose**, **Groq API**, **SerpAPI**, and **Cheerio**.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.2.1-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9.10.1-47a248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Groq](https://img.shields.io/badge/Groq-Cloud_API-f55036?logo=groq&logoColor=white)](https://groq.com/)
[![SerpAPI](https://img.shields.io/badge/SerpAPI-Google_Search-4285f4?logo=google&logoColor=white)](https://serpapi.com/)

</div>

---

## 📌 Overview

The **DeepScout Server** is the core intelligence backend that coordinates the multi-stage research investigation pipeline. Rather than querying an LLM in a single ungrounded pass, the server coordinates an evidence-first research workflow:

1. **Decomposes** the user's inquiry into 3–5 search queries across separate outcome dimensions.
2. **Executes live multi-engine search** across Google Search, Google News, or Google Scholar via SerpAPI (with automatic fallback to Tavily Search).
3. **Scores source relevance** (0–100) using LLM evaluation to eliminate SEO fluff before downloading full pages.
4. **Scrapes full webpage DOMs** using Cheerio, stripping scripts and boilerplate, with graceful degradation to verified search snippets if blocked.
5. **Extracts discrete factual claims** tagged with 12-dimensional contextual scopes (analytical levels, timeframes, measurement methods, and populations).
6. **Analyzes evidence and classifies divergence**, distinguishing true empirical contradictions from non-contradictory differences in context.
7. **Synthesizes a citation-grounded answer** linking every finding and conclusion to specific claim and source UUIDs.
8. **Persists investigation dossiers** in MongoDB with full user session authentication via HTTP-only JWT cookies.

---

## 📂 Architecture & Directory Structure

```text
server/
├── src/
│   ├── AI/                             # Core Research & Evidence Pipeline Modules
│   │   ├── ClaimExtractor.js             # Stage 6: Batched claim extraction & 12D scope normalization
│   │   ├── EvidenceAnalyzer.js           # Stages 7 & 8: Evidence analysis, divergence classifier, & conclusion synthesis
│   │   ├── Graph.js                      # Stage 2: Question decomposition & longitudinal query branching
│   │   ├── GroqClient.js                 # Low-latency Groq LLM client with retry backoff & JSON repair
│   │   ├── Researcher.js                 # Stage 3: SerpAPI & Tavily search orchestration with URL normalization
│   │   ├── SemanticRelevanceEvaluator.js # Stage 4: Relevance evaluation & 0–100 scoring
│   │   └── WebpageExtractor.js           # Stage 5: Cheerio full-page body extraction & snippet fallback
│   │
│   ├── Controllers/                    # Request controllers
│   │   ├── auth.controller.js          # User registration, bcrypt authentication, & JWT cookie management
│   │   └── investigation.controller.js # End-to-end 9-stage investigation pipeline orchestrator
│   │
│   ├── Middleware/                     # Express middleware
│   │   └── auth.middleware.js          # JWT token verification for protected endpoints
│   │
│   ├── Model/                          # Mongoose ODM schemas
│   │   ├── investigationModel.js       # Complete research dossier & metadata persistence model
│   │   └── userModel.js                # User profile & encrypted password schema
│   │
│   ├── Routes/                         # API router definitions
│   │   ├── auth.routes.js              # /api/auth endpoints (register, login, logout, me)
│   │   └── investigation.routes.js     # /api/investigations and /api/investigate endpoints
│   │
│   ├── app.js                          # Express setup, Helmet security headers, CORS, & rate limiter
│   ├── db.js                           # Dual-mode MongoDB connection (Atlas URI with local fallback)
│   └── server.js                       # HTTP server bootstrap listening on PORT 3000
│
├── .env.example                        # Configuration template for environment variables
├── package.json                        # Dependencies, ESM scripts, and project metadata
└── README.md                           # Backend documentation
```

---

## 🔬 Core Pipeline Modules (`src/AI/`)

### 1. `Graph.js` — Question Decomposition
- **Function**: `decomposeQuestion(question)`
- **Behavior**: Prompts Groq JSON API to break down broad questions into 3–5 targeted sub-questions.
- **Constraints**: Enforces separation of outcome dimensions (e.g. routine productivity vs. collaborative innovation, well-being, organizational cost). For questions targeting long-term or lasting effects, it explicitly generates longitudinal sub-questions to compare short-term vs. sustained impacts.

### 2. `Researcher.js` — Web Research & Search Fallback
- **Functions**: `researchAll(subQuestions, sourceType)`, `researchQuestion(query, sourceType)`, `normalizeUrl(url)`
- **Search Providers**:
  - **Primary**: **SerpAPI** (targets Google Search, Google News, or Google Scholar depending on `sourceType`, with a 15s timeout).
  - **Fallback**: **Tavily Search API** (automatically called if SerpAPI returns empty results or fails).
- **Sanitization**: Strips common search stop words and normalizes URLs (removing tracking parameters, hash fragments, and trailing slashes).

### 3. `SemanticRelevanceEvaluator.js` — Relevance Grading
- **Function**: `evaluateSources(researched)`
- **Behavior**: Evaluates search result snippets against their parent sub-question, assigning a **0–100 semantic relevance score** and an explicit explanation (`semanticReason`).
- **Filtering**: The controller retains the top sources per sub-question (`MAX_RELEVANT_SOURCES_PER_SUBQUESTION = 2`) and deduplicates shared URLs across different sub-questions.

### 4. `WebpageExtractor.js` — Webpage Extraction
- **Function**: `extractWebpages(sources)`
- **Behavior**: Fetches full HTML pages and uses **Cheerio** to strip out navigation bars, headers, footers, sidebars, ad blocks, scripts, and styles.
- **Graceful Degradation**: If an external domain blocks scraping (403 forbidden, Cloudflare captcha, or timeout), it marks the source as `extractionStatus: "fallback"` and uses the verified search snippet, ensuring the pipeline continues without data loss.

### 5. `ClaimExtractor.js` — Scoped Claim Extraction
- **Function**: `extractClaims(sources)`
- **Batching**: Groups source texts into batches under 4,500 characters to prevent LLM context saturation.
- **Metadata Tagging**: Each extracted claim is assigned a UUID (`claim_...`), claim type (`factual`, `quantitative`, `causal`, `conditional`, `limitation`), evidence strength (`strong`, `moderate`, `limited`), and a **12-dimensional scope object**:
  - `analyticalLevel` (individual, team, firm, industry)
  - `measurementType` (objective output, self-reported survey, manager perception)
  - `taskType` (routine task, creative collaboration)
  - `timeframe` (short-term trial, longitudinal sustained)
  - `population`, `sample`, `organization`, `industry`, `geography`, `workArrangement`, `comparison`, `outcome`, `studyDesign`

### 6. `EvidenceAnalyzer.js` — Evidence Synthesis & Divergence Classifier
- **Functions**: `analyzeEvidence({ question, claims, sources })`, `classifyDivergence(item, claimObjMap)`
- **Scope Preservation**: Prevents invalid leaps (e.g. macro BLS statistics cannot be generalized to individual worker output; survey perceptions cannot be cited as measured quantitative units).
- **The Conflict Distinction Engine**:
  - **True Conflict (`true_conflict`)**: Raised ONLY when comparable studies evaluate substantially the same population, task, arrangement, and measurement, yet report opposing empirical conclusions.
  - **Comparability Notes (`comparabilityNotes`)**: Contextual differences explaining why findings diverge without being contradictory (`different_outcome`, `different_task_type`, `different_population`, `different_measurement`, `different_time_period`, `insufficient_comparability`).
- **Sentence Ordering**: For temporal questions, `formatConclusionSentenceOrder` restructures the conclusion to lead explicitly with scope qualifications (e.g. *"Regarding long-term effects..."*).

### 7. `GroqClient.js` — Low-Latency LLM Client
- **Function**: `groqJson({ user, system, model, temperature, maxTokens })`
- **Behavior**: Interfaces with Groq chat completions in JSON mode. Defaults to `process.env.GROQ_MODEL || "openai/gpt-oss-20b"` with fallback retry models (`openai/gpt-oss-120b`, `qwen/qwen3.8-27b`).
- **Resilience**: Parses rate-limit reset headers (`x-ratelimit-reset-tokens`) and error message cooldowns to execute intelligent backoff. Includes automated JSON repair routines for truncated or unescaped model outputs.

---

## 🗄️ Database & Dual Connection Strategy (`src/db.js`)

DeepScout uses **Mongoose v9** with automated connection fallback:
1. First attempts to connect to the cloud URI specified in `process.env.MONGODB_URI`.
2. If `MONGODB_URI` contains a placeholder (`PASSWORD`), fails, or times out, it automatically connects to a local MongoDB instance running at:
   ```text
   mongodb://127.0.0.1:27017/deepscout
   ```
This ensures developers can run investigations locally without requiring immediate cloud configuration.

---

## 🔑 Environment Variables Reference

Create a `.env` file in the `server/` root using `.env.example`:

```env
# Server Network Settings
PORT=3000
NODE_ENV=development

# Database Connection (MongoDB Atlas or local fallback)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/DeepScout?retryWrites=true&w=majority

# Authentication Secret
JWT_SECRET=your_long_random_jwt_secret_key_here

# Frontend Application Origin for CORS
CLIENT_URL=http://localhost:5173

# AI & Search API Keys
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-20b
SERPAPI_API_KEY=your_serpapi_key_here 
```

---

## 📡 API Reference & Endpoints

### 1. Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "service": "DeepScout API",
  "timestamp": "2026-09-26T12:00:00.000Z"
}
```

### 2. Authentication Endpoints (`/api/auth`)
*Rate limited to 60 requests per 15-minute window.*

- **`POST /api/auth/register`** — Register a new account.
  - Body: `{ "email": "user@example.com", "password": "securepassword", "name": "Dr. Researcher" }`
- **`POST /api/auth/login`** — Authenticate credentials.
  - Body: `{ "email": "user@example.com", "password": "securepassword" }`
  - Sets an HTTP-only JWT session cookie (`deepscout_token`).
- **`POST /api/auth/logout`** — Clears the JWT session cookie.
- **`GET /api/auth/me`** — Returns current user profile *(Requires Auth)*.

### 3. Investigation Endpoints (`/api`)
*Protected by `requireAuth` middleware.*

- **`POST /api/investigations`** *(or alias `POST /api/investigate`)* — Run full 9-stage research investigation.
  - Body:
    ```json
    {
      "question": "Does remote work improve productivity?",
      "sourceType": "web" // Options: "web" | "news" | "scholar"
    }
    ```
- **`GET /api/investigations`** — Retrieve a list of past investigations for the authenticated user.
- **`GET /api/investigations/:id`** — Retrieve complete research dossier by investigation ID.
- **`DELETE /api/investigations/:id`** — Delete an investigation record.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your GROQ_API_KEY, SERPAPI_API_KEY, and JWT_SECRET
```

### 3. Start Development Server
```bash
npm run dev
```
Launches Nodemon watching `src/` on **`http://localhost:3000`**.

### 4. Run Production Server
```bash
npm start
```

---

For complete system documentation and frontend architecture, see the [Root README](../README.md).
