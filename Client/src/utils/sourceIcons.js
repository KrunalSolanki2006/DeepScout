/**
 * sourceIcons.js
 * Robust domain extraction, publisher recognition, and favicon/monogram derivation.
 * Conforms to Section 18, 19, and 34 of DeepScout specifications.
 */

// Curated map of authoritative domains to standard publisher names and monogram hints
const KNOWN_PUBLISHERS = {
  // Academic & Research Institutions
  "stanford.edu": { name: "Stanford University", monogram: "ST" },
  "siepr.stanford.edu": { name: "Stanford SIEPR", monogram: "ST" },
  "harvard.edu": { name: "Harvard University", monogram: "HU" },
  "mit.edu": { name: "MIT", monogram: "MI" },
  "ox.ac.uk": { name: "University of Oxford", monogram: "OX" },
  "cam.ac.uk": { name: "University of Cambridge", monogram: "CU" },
  "berkeley.edu": { name: "UC Berkeley", monogram: "UC" },
  "columbia.edu": { name: "Columbia University", monogram: "CU" },
  "yale.edu": { name: "Yale University", monogram: "YU" },
  "princeton.edu": { name: "Princeton University", monogram: "PU" },

  // Scientific, Medical & Pre-print Repositories
  "nature.com": { name: "Nature Publishing", monogram: "NA" },
  "sciencedirect.com": { name: "ScienceDirect", monogram: "SD" },
  "ncbi.nlm.nih.gov": { name: "NIH / PubMed", monogram: "NH" },
  "nih.gov": { name: "National Institutes of Health", monogram: "NH" },
  "who.int": { name: "World Health Organization", monogram: "WO" },
  "cdc.gov": { name: "Centers for Disease Control", monogram: "CD" },
  "thelancet.com": { name: "The Lancet", monogram: "LA" },
  "nejm.org": { name: "New England Journal of Medicine", monogram: "NJ" },
  "pnas.org": { name: "PNAS", monogram: "PN" },
  "arxiv.org": { name: "arXiv Preprints", monogram: "AX" },
  "biorxiv.org": { name: "bioRxiv", monogram: "BX" },
  "nber.org": { name: "NBER Economics", monogram: "NB" },
  "brookings.edu": { name: "Brookings Institution", monogram: "BK" },
  "pewresearch.org": { name: "Pew Research Center", monogram: "PR" },

  // Trusted News & Empirical Journalism
  "nytimes.com": { name: "The New York Times", monogram: "NY" },
  "washingtonpost.com": { name: "The Washington Post", monogram: "WP" },
  "wsj.com": { name: "The Wall Street Journal", monogram: "WS" },
  "theguardian.com": { name: "The Guardian", monogram: "GD" },
  "reuters.com": { name: "Reuters", monogram: "RT" },
  "apnews.com": { name: "Associated Press", monogram: "AP" },
  "bbc.com": { name: "BBC News", monogram: "BB" },
  "bbc.co.uk": { name: "BBC News", monogram: "BB" },
  "economist.com": { name: "The Economist", monogram: "EC" },
  "ft.com": { name: "Financial Times", monogram: "FT" },
  "bloomberg.com": { name: "Bloomberg", monogram: "BL" },
  "theatlantic.com": { name: "The Atlantic", monogram: "AT" },

  // Knowledge & Video Sources
  "wikipedia.org": { name: "Wikipedia", monogram: "WI" },
  "en.wikipedia.org": { name: "Wikipedia", monogram: "WI" },
  "youtube.com": { name: "YouTube", monogram: "YT" },
  "scholar.google.com": { name: "Google Scholar", monogram: "GS" },
  "github.com": { name: "GitHub", monogram: "GH" },
  "gov": { name: "Official Government Source", monogram: "GV" },
};

/**
 * Extracts clean domain and hostname from any URL string safely.
 */
export function extractDomainInfo(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") {
    return {
      hostname: "Unknown Source",
      rootDomain: "source",
      publisher: "Unknown Publisher",
      monogram: "SC",
    };
  }

  try {
    let urlString = rawUrl.trim();
    if (!/^https?:\/\//i.test(urlString)) {
      urlString = `https://${urlString}`;
    }

    const parsed = new URL(urlString);
    let hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");

    // Split hostname into parts for root domain identification
    const parts = hostname.split(".");
    let rootDomain = hostname;
    if (parts.length > 2) {
      // Check for two-part TLDs like co.uk, gov.uk, edu.au
      const secondToLast = parts[parts.length - 2];
      if (["co", "gov", "ac", "edu", "org", "com"].includes(secondToLast) && parts.length >= 3) {
        rootDomain = parts.slice(-3).join(".");
      } else {
        rootDomain = parts.slice(-2).join(".");
      }
    }

    // Lookup known publisher
    const known = KNOWN_PUBLISHERS[hostname] || KNOWN_PUBLISHERS[rootDomain];
    let publisher = known?.name;
    let monogram = known?.monogram;

    if (!publisher) {
      // Format human-readable title from root domain (e.g. techcrunch.com -> TechCrunch)
      const primaryPart = parts.length > 1 ? parts[parts.length - 2] : parts[0];
      publisher = primaryPart
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    if (!monogram) {
      const cleanName = publisher.replace(/[^a-zA-Z0-9]/g, "");
      monogram = cleanName.slice(0, 2).toUpperCase() || "SC";
    }

    return {
      hostname,
      rootDomain,
      publisher,
      monogram,
    };
  } catch {
    return {
      hostname: rawUrl.slice(0, 30),
      rootDomain: rawUrl.slice(0, 20),
      publisher: rawUrl.slice(0, 30),
      monogram: "SC",
    };
  }
}

/**
 * Generates reliable Google Favicon V2 proxy URL.
 */
export function getFaviconUrl(domain, size = 64) {
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`;
}

/**
 * Generates a stable neutral background hue for domain monograms based on string hash.
 */
export function getMonogramStyle(text = "") {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  const palettes = [
    { bg: "bg-neutral-900", text: "text-neutral-200", border: "border-neutral-700" },
    { bg: "bg-neutral-900", text: "text-cyan-400", border: "border-cyan-500/30" },
    { bg: "bg-neutral-900", text: "text-sky-400", border: "border-sky-500/30" },
    { bg: "bg-neutral-900", text: "text-blue-400", border: "border-blue-500/30" },
    { bg: "bg-neutral-900", text: "text-indigo-300", border: "border-indigo-500/30" },
  ];
  const idx = Math.abs(hash) % palettes.length;
  return palettes[idx];
}

/**
 * Ensures an external source URL is fully qualified with https://
 * and prevents relative path navigation within the app.
 */
export function formatExternalUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") return "#";
  const trimmed = rawUrl.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
