import fetch from "node-fetch";
import "dotenv/config";

const GROQ_API_URL =
  "https://api.groq.com/openai/v1/chat/completions";

const MODEL_CANDIDATES = [
  process.env.GROQ_MODEL || "openai/gpt-oss-20b",
  "openai/gpt-oss-20b",
  "openai/gpt-oss-120b",
  "qwen/qwen3.8-27b",
].filter((m, idx, arr) => m && arr.indexOf(m) === idx);

let currentModelIndex = 0;

const MAX_RETRIES = 5;

function sleep(ms) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

function extractRetryDelayMs(response, errorText) {
  // 1. Check error message body for compound time (e.g. "try again in 22m57.648s" or "try again in 11.8125s")
  if (typeof errorText === "string") {
    const compoundMatch = errorText.match(
      /try again in (?:(\d+)h)?(?:(\d+)m)?([\d.]+)s/i
    );
    if (compoundMatch) {
      const hours = parseFloat(compoundMatch[1] || 0);
      const mins = parseFloat(compoundMatch[2] || 0);
      const secs = parseFloat(compoundMatch[3] || 0);
      const totalSecs = hours * 3600 + mins * 60 + secs;
      if (totalSecs > 0) {
        return Math.ceil(totalSecs * 1000) + 1500;
      }
    }
  }

  // 2. Check x-ratelimit-reset-tokens header (e.g. "11.8125s")
  const resetTokensHeader =
    response?.headers?.get(
      "x-ratelimit-reset-tokens"
    );

  if (resetTokensHeader) {
    const match =
      resetTokensHeader.match(
        /([\d.]+)s?/
      );

    if (match) {
      const parsed =
        parseFloat(match[1]);

      if (
        !isNaN(parsed) &&
        parsed > 0
      ) {
        return (
          Math.ceil(parsed * 1000) +
          1500
        );
      }
    }
  }

  // 3. Check retry-after header (seconds)
  const retryAfterHeader =
    response?.headers?.get(
      "retry-after"
    );

  if (retryAfterHeader) {
    const parsed =
      parseFloat(retryAfterHeader);

    if (
      !isNaN(parsed) &&
      parsed > 0
    ) {
      return (
        Math.ceil(parsed * 1000) +
        1500
      );
    }
  }

  return null;
}

function cleanJsonText(text = "") {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function isRetryableStatus(status) {
  return (
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
}

export async function groqJson({
  system = "",
  user,
  temperature = 0.1,
  maxTokens = 5000,
}) {
  const apiKey =
    process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is missing from .env"
    );
  }

  // IMPORTANT:
  // Groq requires the word "json" somewhere
  // in the messages when response_format=json_object
  const jsonSystemMessage = `
You are a backend component of DeepScout.

Return ONLY valid JSON.
Do not use markdown.
Do not wrap the JSON in code fences.
Do not add explanations outside the JSON.
`;

  const messages = [
    {
      role: "system",
      content:
        system.trim().length > 0
          ? `${system}\n\n${jsonSystemMessage}`
          : jsonSystemMessage,
    },
    {
      role: "user",
      content: user,
    },
  ];

  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt++
  ) {
    const activeModel =
      MODEL_CANDIDATES[currentModelIndex] ||
      MODEL_CANDIDATES[0];

    try {
      const adjustedMaxTokens = activeModel.includes("qwen")
        ? Math.min(maxTokens, 950)
        : maxTokens;

      const bodyPayload = {
        model: activeModel,
        messages,
        temperature,
        max_tokens: adjustedMaxTokens,
        response_format: {
          type: "json_object",
        },
      };

      if (activeModel.includes("gpt-oss")) {
        bodyPayload.reasoning_effort = "low";
      }

      const response =
        await fetch(
          GROQ_API_URL,
          {
            method: "POST",
            headers: {
              Authorization:
                `Bearer ${apiKey}`,
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(bodyPayload),
          }
        );

      // -----------------------------------
      // RATE LIMIT (TPM or TPD or OTPM)
      // -----------------------------------

      if (
        response.status === 429
      ) {
        const errorText =
          await response.text();

        const isDailyLimit =
          /tokens per day \(tpd\)|requests per day \(rpd\)/i.test(
            errorText
          );

        const isOutputLimit =
          /output tokens per minute \(otpm\)|expected output tokens exceed/i.test(
            errorText
          );

        const detectedDelayMs =
          extractRetryDelayMs(
            response,
            errorText
          );

        const isLongWait =
          detectedDelayMs &&
          detectedDelayMs > 60000;

        // If daily limit hit, OTPM exceeded, or wait time exceeds 1 minute, switch to fallback model
        if (
          (isDailyLimit || isOutputLimit || isLongWait) &&
          currentModelIndex + 1 < MODEL_CANDIDATES.length
        ) {
          const oldModel = activeModel;
          currentModelIndex++;
          const nextModel =
            MODEL_CANDIDATES[currentModelIndex];
          console.log(
            `[Groq] Model ${oldModel} limit reached (${isDailyLimit ? "TPD limit" : isOutputLimit ? "OTPM limit" : "long wait"}). Seamlessly switching to fallback model: ${nextModel}...`
          );
          // Retry immediately with the new model
          attempt--;
          continue;
        }

        const waitMs =
          detectedDelayMs ||
          Math.max(
            5000 * attempt,
            10000
          );

        console.log(
          `[Groq] Pacing: pausing ${(waitMs / 1000).toFixed(1)}s for token window to refresh (Attempt ${attempt}/${MAX_RETRIES})...`
        );

        if (
          attempt < MAX_RETRIES
        ) {
          await sleep(waitMs);
          continue;
        }

        throw new Error(
          `Groq rate limit exceeded: ${errorText}`
        );
      }

      // -----------------------------------
      // OTHER ERRORS
      // -----------------------------------

      if (!response.ok) {
        const errorText =
          await response.text();

        const error =
          new Error(
            `Groq HTTP Error ${response.status}: ${errorText}`
          );

        // 400 / 401 / 403 etc. should
        // NOT be retried.
        if (
          !isRetryableStatus(
            response.status
          )
        ) {
          throw error;
        }

        // Retry server-side errors.
        if (
          attempt < MAX_RETRIES
        ) {
          await sleep(
            1500 * attempt
          );

          continue;
        }

        throw error;
      }

      // -----------------------------------
      // PARSE RESPONSE
      // -----------------------------------

      const data =
        await response.json();

      const raw =
        data?.choices?.[0]
          ?.message?.content || "";

      if (!raw) {
        throw new Error(
          "Groq returned an empty response"
        );
      }

      const cleaned =
        cleanJsonText(raw);

      try {
        return JSON.parse(
          cleaned
        );
      } catch {
        console.error(
          "Invalid JSON returned by Groq:"
        );

        console.error(raw);

        throw new Error(
          "Groq returned invalid JSON"
        );
      }
    } catch (error) {
      console.error(
        `Groq attempt ${attempt}/${MAX_RETRIES} failed:`,
        error.message
      );

      // Do not retry 400, 401, 403, 404, or 413 errors
      const nonRetryableCodes = ["400", "401", "403", "404", "413"];
      if (
        nonRetryableCodes.some((code) =>
          error.message.includes(
            `Groq HTTP Error ${code}`
          )
        )
      ) {
        throw error;
      }

      if (
        attempt === MAX_RETRIES
      ) {
        throw error;
      }

      await sleep(
        1500 * attempt
      );
    }
  }

  throw new Error(
    "Groq request failed"
  );
}