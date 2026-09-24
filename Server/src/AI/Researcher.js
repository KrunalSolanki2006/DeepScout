import crypto from "node:crypto";
import "dotenv/config";
import fetch from "node-fetch";
import { getJson } from "serpapi";

const SEARCH_RESULTS = 10;
const FINAL_RESULTS = 3;
const SERPAPI_TIMEOUT_MS = 15000;

async function searchTavily(query, maxResults = 5) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        max_results: maxResults,
        search_depth: "basic",
      }),
    });

    if (!response.ok) return [];

    const data = await response.json();
    return (data.results || []).map((r) => ({
      title: r.title || "Untitled",
      link: r.url,
      snippet: r.content || "",
      published_at: r.published_date || null,
      source: r.url ? new URL(r.url).hostname : null,
    }));
  } catch (err) {
    console.warn(`[Search] Tavily fallback error for "${query}":`, err.message);
    return [];
  }
}

const STOP_WORDS = new Set([
  "what",
  "are",
  "is",
  "the",
  "a",
  "an",
  "of",
  "to",
  "do",
  "does",
  "how",
  "why",
  "can",
  "and",
  "or",
  "for",
  "in",
  "on",
  "with",
  "from",
  "than",
  "have",
  "has",
  "any",
  "there",
  "their",
  "they",
  "it",
  "be",
  "as",
  "by",
]);

const ENGINE_CONFIG = {
  web: "google",
  scholar: "google_scholar",
  news: "google_news",
};

function normalizeText(text = "") {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function extractKeywords(query) {
  return normalizeText(query).filter(
    (word) =>
      word.length > 2 &&
      !STOP_WORDS.has(word)
  );
}

function basicFilter(result) {
  const url =
    result.link ||
    result.resources?.[0]?.link ||
    "";

  const title = result.title || "";

  const snippet =
    result.snippet ||
    result.publication_info?.summary ||
    "";

  if (!url || !title || !snippet) {
    return false;
  }

  if (snippet.trim().length < 40) {
    return false;
  }

  const blockedDomains = [
    "youtube.com",
    "facebook.com",
    "instagram.com",
    "tiktok.com",
    "pinterest.com",
  ];

  const lowerUrl = url.toLowerCase();

  if (
    blockedDomains.some((domain) =>
      lowerUrl.includes(domain)
    )
  ) {
    return false;
  }

  return true;
}

function calculateKeywordRelevance(
  query,
  result
) {
  const keywords = extractKeywords(query);

  if (keywords.length === 0) {
    return 0;
  }

  const titleWords = normalizeText(
    result.title || ""
  );

  const snippetWords = normalizeText(
    result.snippet ||
      result.publication_info?.summary ||
      ""
  );

  let score = 0;

  for (const keyword of keywords) {
    if (titleWords.includes(keyword)) {
      score += 2;
    }

    if (snippetWords.includes(keyword)) {
      score += 1;
    }
  }

  const maxScore = keywords.length * 3;

  return score / maxScore;
}

export function normalizeUrl(rawUrl = "") {
  try {
    const parsed = new URL(rawUrl);
    const trackingParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "ref",
      "fbclid",
      "gclid",
      "srsltid",
      "_ga",
    ];
    trackingParams.forEach((param) =>
      parsed.searchParams.delete(param)
    );
    parsed.protocol =
      parsed.protocol.toLowerCase();
    parsed.hostname =
      parsed.hostname.toLowerCase();
    if (
      parsed.pathname.endsWith("/") &&
      parsed.pathname.length > 1
    ) {
      parsed.pathname =
        parsed.pathname.slice(0, -1);
    }
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return (rawUrl || "")
      .trim()
      .toLowerCase()
      .replace(/\/+$/, "");
  }
}

function normalizeResult(
  result,
  sourceType,
  relevance
) {
  const title = (
    result.title || "Untitled"
  ).trim();

  const rawUrl =
    result.link ||
    result.resources?.[0]?.link ||
    "";

  const url = normalizeUrl(rawUrl);

  const content = (
    result.snippet ||
    result.publication_info?.summary ||
    ""
  ).trim();

  let domain = null;
  try {
    domain = new URL(url).hostname.replace(
      /^www\./,
      ""
    );
  } catch {
    domain = null;
  }

  return {
    id: `source_${crypto.randomUUID()}`,

    title,

    url,

    domain,

    content,

    contentType: "search_snippet",

    relevance,

    position:
      result.position ?? null,

    publishedDate:
      result.published_at ||
      result.date ||
      null,

    source:
      typeof result.source === "string"
        ? result.source
        : result.source?.name ||
          domain ||
          "Web Source",

    sourceType,
  };
}

export async function researchQuestion(
  subQuestion,
  sourceType = "web"
) {
  const serpApiKey =
    process.env.SERPAPI_API_KEY;
  const tavilyApiKey =
    process.env.TAVILY_API_KEY;

  if (!serpApiKey && !tavilyApiKey) {
    throw new Error(
      "Both SERPAPI_API_KEY and TAVILY_API_KEY are missing from .env"
    );
  }

  const engine =
    ENGINE_CONFIG[sourceType] || "google";

  let results = [];
  let usedEngine = "search";
  let lastError = null;

  // 1. Primary: Use Tavily if available (fast ~1s, built for research sub-questions)
  if (tavilyApiKey) {
    try {
      results = await searchTavily(
        subQuestion,
        SEARCH_RESULTS
      );
      if (results.length > 0) {
        usedEngine = "tavily";
      }
    } catch (err) {
      lastError = err.message;
    }
  }

  // 2. Secondary/Fallback: Use SerpApi if Tavily returned no results or is unavailable
  if (results.length === 0 && serpApiKey) {
    try {
      const fetchSerpApi = getJson({
        engine,
        api_key: serpApiKey,
        q: subQuestion,
        num: SEARCH_RESULTS,
      });

      const timeoutPromise = new Promise(
        (_, reject) =>
          setTimeout(
            () =>
              reject(
                new Error(
                  "SerpApi timeout after 15s"
                )
              ),
            SERPAPI_TIMEOUT_MS
          )
      );

      const response = await Promise.race([
        fetchSerpApi,
        timeoutPromise,
      ]);

      if (sourceType === "news") {
        results =
          response.news_results || [];
      } else {
        results =
          response.organic_results || [];
      }

      if (results.length > 0) {
        usedEngine = engine;
      }
    } catch (err) {
      lastError = err.message;
    }
  }

  const filteredResults =
    results.filter(basicFilter);

  // Source Deduplication by normalized URL
  const seenUrls = new Set();
  const deduplicated = [];
  for (const item of filteredResults) {
    const rawUrl =
      item.link ||
      item.resources?.[0]?.link ||
      "";
    const cleanUrl =
      normalizeUrl(rawUrl);
    if (
      !cleanUrl ||
      seenUrls.has(cleanUrl)
    ) {
      continue;
    }
    seenUrls.add(cleanUrl);
    deduplicated.push(item);
  }

  const scoredResults =
    deduplicated.map((result) => ({
      result,
      relevance:
        calculateKeywordRelevance(
          subQuestion,
          result
        ),
    }));

  scoredResults.sort(
    (a, b) =>
      b.relevance - a.relevance
  );

  const finalResults =
    scoredResults
      .slice(0, FINAL_RESULTS)
      .map(
        ({ result, relevance }) =>
          normalizeResult(
            result,
            sourceType,
            relevance
          )
      );

  const searchFailure =
    finalResults.length === 0 &&
    lastError
      ? {
          subQuestion,
          error: lastError,
        }
      : null;

  return {
    subQuestion,

    sourceType,

    engine: usedEngine,

    searchedResults:
      results.length,

    filteredResults:
      filteredResults.length,

    sources: finalResults,

    searchFailure,
  };
}

async function runWithConcurrency(
  items,
  worker,
  concurrency = 2
) {
  const results = new Array(items.length);

  let nextIndex = 0;

  async function runner() {
    while (true) {
      const index = nextIndex++;

      if (index >= items.length) {
        return;
      }

      results[index] =
        await worker(items[index]);
    }
  }

  const workers = Array.from(
    {
      length: Math.min(
        concurrency,
        items.length
      ),
    },
    () => runner()
  );

  await Promise.all(workers);

  return results;
}

export async function researchAll(
  subQuestions,
  sourceType = "web"
) {
  if (!Array.isArray(subQuestions)) {
    throw new Error(
      "subQuestions must be an array"
    );
  }

  const outcomes =
    await runWithConcurrency(
      subQuestions,
      (question) =>
        researchQuestion(
          question,
          sourceType
        ),
      2
    );

  const searchFailures = [];
  const researchResults = outcomes.map(
    (item) => {
      if (item.searchFailure) {
        searchFailures.push(
          item.searchFailure
        );
      }
      return {
        subQuestion: item.subQuestion,
        sourceType: item.sourceType,
        engine: item.engine,
        searchedResults:
          item.searchedResults,
        filteredResults:
          item.filteredResults,
        sources: item.sources,
      };
    }
  );

  researchResults.searchFailures =
    searchFailures;

  return researchResults;
}