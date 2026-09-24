import fetch from "node-fetch";
import * as cheerio from "cheerio";

const FETCH_TIMEOUT_MS = 12000;
const MAX_TEXT_LENGTH = 5000;

function isValidUrl(url) {
  try {
    const parsed =
      new URL(url);

    if (
      parsed.protocol !== "http:" &&
      parsed.protocol !== "https:"
    ) {
      return false;
    }

    const hostname =
      parsed.hostname.toLowerCase();

    const blockedHosts = [
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      "::1",
    ];

    if (
      blockedHosts.includes(hostname)
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

function cleanText(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\n+/g, " ")
    .trim();
}

function extractReadableText(html) {
  const $ =
    cheerio.load(html);

  $(
    "script, style, noscript, iframe, svg, nav, footer, header, form, aside"
  ).remove();

  let text = "";

  const articleText = cleanText(
    $("article").text()
  );

  const mainText = cleanText(
    $("main").text()
  );

  const bodyText = cleanText(
    $("body").text()
  );

  if (articleText.length >= 500) {
    text = articleText;
  } else if (mainText.length >= 500) {
    text = mainText;
  } else {
    text = bodyText;
  }

  return text.slice(
    0,
    MAX_TEXT_LENGTH
  );
}

async function fetchPage(url) {
  if (!isValidUrl(url)) {
    throw new Error(
      "Invalid or blocked URL"
    );
  }

  const controller =
    new AbortController();

  const timeout =
    setTimeout(
      () =>
        controller.abort(),
      FETCH_TIMEOUT_MS
    );

  try {
    const response =
      await fetch(url, {
        method: "GET",

        redirect: "follow",

        signal:
          controller.signal,

        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",

          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",

          "Accept-Language":
            "en-US,en;q=0.9",
        },
      });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }

    const contentType =
      response.headers.get(
        "content-type"
      ) || "";

    if (
      !contentType.includes(
        "text/html"
      ) &&
      !contentType.includes(
        "application/xhtml+xml"
      ) &&
      !contentType.includes(
        "text/plain"
      )
    ) {
      throw new Error(
        `Unsupported content type: ${contentType}`
      );
    }

    const html =
      await response.text();

    const text =
      extractReadableText(html);

    if (text.length < 200) {
      throw new Error(
        "Not enough readable content"
      );
    }

    return text;
  } finally {
    clearTimeout(timeout);
  }
}

async function mapWithConcurrency(
  items,
  worker,
  concurrency = 3
) {
  const results =
    new Array(items.length);

  let index = 0;

  async function runner() {
    while (true) {
      const current =
        index++;

      if (
        current >= items.length
      ) {
        return;
      }

      results[current] =
        await worker(
          items[current]
        );
    }
  }

  const workers =
    Array.from(
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

export async function extractWebpages(
  sources
) {
  if (
    !Array.isArray(sources)
  ) {
    return [];
  }

  const cache =
    new Map();
  const extractionFailures = [];

  const results = await mapWithConcurrency(
    sources,
    async (source) => {
      if (!source.url) {
        extractionFailures.push({
          url: "",
          title: source.title || "Untitled",
          error: "Source has no URL",
        });

        return {
          ...source,
          webpageContent:
            source.content || "",
          extractionStatus: source.content
            ? "fallback"
            : "failed",
          contentType: source.content
            ? "search_snippet"
            : "none",
          extractionError:
            "Source has no URL",
        };
      }

      if (
        cache.has(source.url)
      ) {
        const cached =
          cache.get(source.url);

        return {
          ...source,
          ...cached,
        };
      }

      try {
        const content =
          await fetchPage(
            source.url
          );

        const result = {
          webpageContent:
            content,
          extractionStatus:
            "success",
          contentType:
            "full_webpage",
          extractionError:
            null,
        };

        cache.set(
          source.url,
          result
        );

        return {
          ...source,
          ...result,
        };
      } catch (error) {
        const reason =
          source.url.toLowerCase().endsWith(".pdf") ||
          error.message.toLowerCase().includes("pdf")
            ? "PDF document"
            : error.message.includes("403")
              ? "paywall/protected"
              : "snippet fallback";

        console.log(
          `[Extractor] ${reason}; using verified search evidence for: "${(source.title || source.url).slice(0, 60)}..."`
        );

        extractionFailures.push({
          url: source.url,
          title: source.title || "Untitled",
          error: error.message,
          reason,
        });

        const hasSnippet =
          typeof source.content === "string" &&
          source.content.trim().length > 0;

        const result = {
          webpageContent:
            hasSnippet ? source.content.trim() : "",
          extractionStatus:
            hasSnippet ? "fallback" : "failed",
          contentType:
            hasSnippet ? "search_snippet" : "none",
          extractionError:
            error.message,
        };

        cache.set(
          source.url,
          result
        );

        return {
          ...source,
          ...result,
        };
      }
    },
    2
  );

  results.extractionFailures =
    extractionFailures;

  return results;
}