<div align="center">

# 💻 DeepScout Client

**Frontend Interface for the DeepScout Evidence-Driven Research Agent**

Built with **React 19**, **Vite 8**, **Tailwind CSS v4**, and **React Router v7**.

[![React](https://img.shields.io/badge/React-19.2.8-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.3.3-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-7.18.4-ca4245?logo=reactrouter&logoColor=white)](https://reactrouter.com/)

</div>

---

## 📌 Overview

The **DeepScout Client** is an intelligence terminal designed for researchers, engineers, and analysts who need to investigate complex empirical questions. Rather than presenting a generic chat bubble with unverified text, the client provides an interactive, structured investigation workspace with:

- **Live Research Telemetry**: Tracks the investigation in real time as the backend progresses through question decomposition, web retrieval, and evidence analysis.
- **Evidence-First Dossier Layout**: Dedicated, modular sections for Key Findings, True Conflicts, Methodological Nuances (Comparability Notes), and Conditions.
- **Interactive Investigation Trail**: Visual audit trail mapping the full research provenance from the original prompt down to specific claims and citations.
- **Slide-Over Source Inspector**: In-depth inspection drawer showing source domain favicons, published dates, relevance scores, and extraction statuses.
- **Modern Dark Terminal Aesthetic**: Deep black backgrounds, glassmorphism, ambient WebGL light ray shaders (`SideRays.jsx`), and typewriter typography.

---

## 📂 Architecture & Directory Structure

```text
client/
├── public/                             # Static public assets (favicons, SVG icons)
├── src/
│   ├── api/                            # HTTP API client layer
│   │   ├── auth.js                     # Authentication API endpoints (register, login, logout, me)
│   │   ├── client.js                   # Fetch wrapper with HTTP-only cookie credentials & error handling
│   │   └── investigations.js           # Investigation CRUD endpoints
│   │
│   ├── components/
│   │   ├── auth/                       # Authentication UI
│   │   │   ├── LoginForm.jsx           # Sign-in form with validation and loading states
│   │   │   └── RegisterForm.jsx        # Registration form with validation
│   │   │
│   │   ├── investigation/              # Core 9-stage research interface
│   │   │   ├── ComparabilitySection.jsx  # Methodological, demographic, & metric divergences
│   │   │   ├── ConclusionSection.jsx     # Synthesized evidence-backed conclusion
│   │   │   ├── ConditionsSection.jsx     # Boundary conditions & modifying factors
│   │   │   ├── ConflictsSection.jsx      # True empirical contradictions
│   │   │   ├── FindingsSection.jsx       # Key findings with interactive citation tags
│   │   │   ├── InvestigationTrail.jsx    # Complete provenance audit trail
│   │   │   ├── ProgressTracker.jsx       # Active investigation telemetry indicator
│   │   │   ├── QuestionInput.jsx         # Query input and corpus selector (web/news/scholar)
│   │   │   ├── ResearchLimitations.jsx   # Scraping failures, search limits, & partial flags
│   │   │   ├── ResultView.jsx            # Composite container for research dossiers
│   │   │   ├── SourceDetailDrawer.jsx    # Slide-over source inspector drawer
│   │   │   ├── SourceFavicon.jsx         # Favicon icon resolver with fallback
│   │   │   ├── SourcesSection.jsx        # Evaluated bibliographic source directory
│   │   │   └── SummarySection.jsx        # Executive summary view
│   │   │
│   │   ├── layout/                     # Application shell and navigation
│   │   │   ├── AppShell.jsx            # Authenticated workspace layout frame
│   │   │   ├── MobileDrawer.jsx        # Mobile responsive drawer navigation
│   │   │   ├── Sidebar.jsx             # Collapsible sidebar with investigation history
│   │   │   └── TopBar.jsx              # Navigation bar with user status & quick actions
│   │   │
│   │   └── ui/                         # Reusable UI primitives & visual effects
│   │       ├── Badge.jsx               # Semantic status and score badges
│   │       ├── DeepScoutLogo.jsx       # Brand mark and vector logo
│   │       ├── ErrorAlert.jsx          # Error banners and failure notifications
│   │       ├── GradientWaves.jsx       # WebGL animated mesh background
│   │       ├── LightRays.jsx           # Animated lighting shader component
│   │       ├── SideRays.jsx            # Ambient lateral ray illumination effect
│   │       ├── Skeleton.jsx            # Shimmer loading placeholders
│   │       └── TypewriterBrand.jsx     # Dynamic typewriter branding component
│   │
│   ├── context/                        # Global React state providers
│   │   ├── AuthContext.jsx             # User authentication session and auth lifecycle
│   │   └── InvestigationContext.jsx    # Active investigation, history polling, and progress state
│   │
│   ├── pages/                          # Primary view routes
│   │   ├── AppPage.jsx                 # Authenticated investigation workspace
│   │   ├── LandingPage.jsx             # Public showcase and product introduction
│   │   ├── LoginPage.jsx               # User authentication sign-in page
│   │   └── RegisterPage.jsx            # New account registration page
│   │
│   ├── routes/                         # Routing infrastructure
│   │   └── ProtectedRoute.jsx          # Route guard redirecting unauthenticated visitors
│   │
│   ├── utils/                          # Helper functions
│   │   ├── date.js                     # Date formatting helpers
│   │   └── sourceIcons.js              # Favicon and domain resolution mapping
│   │
│   ├── App.jsx                         # Root application routing configuration
│   ├── index.css                       # Tailwind v4 theme, font definitions, and glassmorphism
│   └── main.jsx                        # React 19 DOM mount entry point
│
├── package.json                        # Dependencies, scripts, and build configuration
└── vite.config.js                      # Vite config with backend API reverse proxy
```

---

## 🛠️ Tech Stack & Key Libraries

- **React 19 (`^19.2.8`)**: Modern component architecture leveraging concurrent rendering.
- **Vite 8 (`^8.3.0`)**: Ultra-fast bundler with Hot Module Replacement (HMR).
- **Tailwind CSS v4 (`^4.3.3`)**: Configured via `@tailwindcss/vite` for streamlined CSS-first styling.
- **React Router DOM v7 (`^7.18.4`)**: Client-side routing with nested layouts and protected route guards.
- **Lucide React (`^1.47.0`)**: Clean, consistent icon set.
- **OGL (`^1.0.11`)**: Minimal WebGL library powering ambient light ray and background wave canvas shaders.
- **Oxlint (`^1.81.0`)**: High-performance JavaScript/JSX linter.

---

## 🚦 Application Routing

| Route | Page Component | Access | Description |
|---|---|---|---|
| `/` | [`LandingPage.jsx`](file:///e:/WebDevelopMent%20Project/DeepScout/Client/src/pages/LandingPage.jsx) | Public | Showcase highlighting the 9-stage pipeline, design, and features. |
| `/login` | [`LoginPage.jsx`](file:///e:/WebDevelopMent%20Project/DeepScout/Client/src/pages/LoginPage.jsx) | Public (Guest) | Account sign-in form. Redirects to `/app` upon successful authentication. |
| `/register` | [`RegisterPage.jsx`](file:///e:/WebDevelopMent%20Project/DeepScout/Client/src/pages/RegisterPage.jsx) | Public (Guest) | Account registration form. Redirects to `/app` upon registration. |
| `/app` | [`AppPage.jsx`](file:///e:/WebDevelopMent%20Project/DeepScout/Client/src/pages/AppPage.jsx) | Protected | Interactive research workspace with investigation history, search input, and dossier viewer. |

---

## 🔌 API Integration & Proxy Configuration

All client HTTP requests flow through [`src/api/client.js`](file:///e:/WebDevelopMent%20Project/DeepScout/Client/src/api/client.js) with `credentials: "include"` enabled, allowing the browser to automatically exchange secure HTTP-only JWT cookies with the backend.

In development, Vite proxies API requests to the backend server in [`vite.config.js`](file:///e:/WebDevelopMent%20Project/DeepScout/Client/vite.config.js):

```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false,
    },
    '/health': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The application will be accessible at **`http://localhost:5173`**. Ensure the backend server is running concurrently on port `3000`.

### 3. Build for Production
```bash
npm run build
```
Builds optimized production assets to the `dist/` directory.

### 4. Run Linter
```bash
npm run lint
```
Runs Oxlint across all source files for syntax and type-safety verification.

---

For full system architecture, backend implementation, and end-to-end setup instructions, refer to the [Root README](../README.md).
