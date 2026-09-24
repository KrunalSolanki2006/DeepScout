import crypto from "node:crypto";
import { groqJson } from "./GroqClient.js";

const MAX_BATCH_CHARS = 4500;
const MAX_CLAIMS_PER_SOURCE = 6;

function buildBatches(sources) {
  const batches = [];

  let current = [];
  let currentLength = 0;

  for (const source of sources) {
    const sourceLength =
      (source.webpageContent || "").length;

    if (
      current.length > 0 &&
      currentLength + sourceLength >
        MAX_BATCH_CHARS
    ) {
      batches.push(current);

      current = [];
      currentLength = 0;
    }

    current.push(source);
    currentLength += sourceLength;
  }

  if (current.length > 0) {
    batches.push(current);
  }

  return batches;
}

function normalizeClaims(
  claims,
  sources
) {
  const sourceMap =
    new Map(
      sources.map(
        (source) => [
          source.id,
          source,
        ]
      )
    );

  const validTypes = new Set([
    "factual",
    "quantitative",
    "comparative",
    "causal",
    "conditional",
    "limitation",
    "methodological",
  ]);

  const validStrengths = new Set([
    "strong",
    "moderate",
    "limited",
  ]);

  const cleanScopeField = (val) => {
    if (typeof val !== "string") return null;
    const trimmed = val.trim();
    if (
      !trimmed ||
      trimmed.toLowerCase() === "null" ||
      trimmed.toLowerCase() === "unspecified" ||
      trimmed.toLowerCase() === "not specified" ||
      trimmed.toLowerCase() === "n/a" ||
      trimmed.toLowerCase() === "none"
    ) {
      return null;
    }
    return trimmed;
  };

  return claims
    .filter(
      (claim) =>
        sourceMap.has(
          claim.sourceId
        ) &&
        typeof claim.claimText ===
          "string" &&
        claim.claimText.trim()
          .length > 0
    )
    .map((claim) => {
      const source =
        sourceMap.get(
          claim.sourceId
        );

      const typeCandidate = (
        claim.claimType || ""
      ).toLowerCase();
      const claimType =
        validTypes.has(
          typeCandidate
        )
          ? typeCandidate
          : "factual";

      const strengthCandidate = (
        claim.evidenceStrength || ""
      ).toLowerCase();
      const evidenceStrength =
        validStrengths.has(
          strengthCandidate
        )
          ? strengthCandidate
          : source.contentType ===
            "search_snippet"
            ? "limited"
            : "moderate";

      const rawScope =
        typeof claim.scope === "object" && claim.scope !== null
          ? claim.scope
          : {};

      const scope = {
        population: cleanScopeField(rawScope.population),
        sample: cleanScopeField(rawScope.sample),
        organization: cleanScopeField(rawScope.organization),
        industry: cleanScopeField(rawScope.industry),
        taskType: cleanScopeField(rawScope.taskType),
        analyticalLevel: cleanScopeField(rawScope.analyticalLevel),
        geography: cleanScopeField(rawScope.geography),
        timeframe: cleanScopeField(rawScope.timeframe),
        workArrangement: cleanScopeField(
          rawScope.workArrangement || rawScope.intervention
        ),
        comparison: cleanScopeField(rawScope.comparison),
        outcome: cleanScopeField(rawScope.outcome),
        measurementType: cleanScopeField(rawScope.measurementType),
        studyDesign: cleanScopeField(rawScope.studyDesign),
      };

      return {
        claimId:
          `claim_${crypto.randomUUID()}`,

        sourceId:
          claim.sourceId,

        subQuestion:
          source.subQuestion,

        claimText:
          claim.claimText.trim(),

        claimType,

        condition:
          typeof claim.condition ===
          "string"
            ? claim.condition.trim()
            : null,

        evidenceStrength,

        scope,
      };
    });
}

async function extractBatch(
  sources
) {
  const sourceText =
    sources
      .map(
        (source, index) => `
SOURCE ${index + 1}

Source ID:
${source.id}

Sub-question:
${source.subQuestion}

Title:
${source.title}

Content Type:
${source.contentType || "full_webpage"}

URL:
${source.url}

Content:
${source.webpageContent}
`
      )
      .join(
        "\n============================\n"
      );

  const prompt = `
You are DeepScout's evidence extraction component.

Your task is to extract factual, evidence-grounded claims from the provided source content while rigorously preserving the original evidence scope and analytical level.

EVIDENCE SCOPE & FAITHFULNESS RULES:

1. NEVER GENERALIZE BEYOND THE SOURCE:
   - If the source says "Among employees at Company X", state "Among employees at Company X" — do NOT state "Employees".
   - If the source says "During the first six months", state "During the first six months" — do NOT state "Long-term".
   - If the source says "Creative teams", state "Creative teams" — do NOT state "All workers".
   - If the source says "25% more patents per employee", state "25% more patents per employee under the studied arrangement" — do NOT state "produces 25% more innovation".

2. PRESERVE ANALYTICAL LEVELS (CRITICAL):
   - Industry-level productivity is NOT individual employee productivity.
     Example: "A 1 percentage-point increase in remote work adoption was associated with a 0.08-0.09 percentage-point increase in industry total factor productivity" MUST NOT be written as "Employees are 0.08% more productive".
   - Preserve whether the finding is at the: individual, team, organization, or industry level.

3. PRESERVE MEASUREMENT TYPES (CRITICAL):
   - Distinguish self-reported productivity (surveys) from objectively measured output (keystrokes, calls, code commits, patent filings) and manager evaluations.
   - Do NOT describe self-perceptions as objective proof of output.

4. PRESERVE UNCERTAINTY & CORRELATION:
   - Do not strengthen "may improve" into "improves".
   - Do not strengthen "is associated with" into "causes".
   - Do not strengthen "reported" or "study found" into "proves" or universal truth.

5. NUMERICAL CLAIM PROTECTION:
   - Strictly preserve exact numbers, percentages, units of measurement, denominators, comparison groups, and context.
   - Do not round or alter numerical values.

6. SCOPE EXTRACTION:
   - For every claim, extract a granular "scope" object specifying:
     * population: specific target group (e.g. "patent examiners", "call-center workers") or null
     * sample: sample size (e.g. "1,612 employees", "61 industries") or null
     * organization: specific company/institution (e.g. "Trip.com", "Bureau of Labor Statistics") or null
     * industry: e.g. "information technology", "travel" or null
     * taskType: specific task (e.g. "routine call handling", "creative collaborative design", "software engineering") or null
     * analyticalLevel: "individual", "team", "organization", or "industry"
     * geography: e.g. "China", "United States" or null
     * timeframe: e.g. "6-month RCT (2021-2022)", "October 2024", "early pandemic 2020" or null
     * workArrangement: e.g. "hybrid 2 days WFH", "100% full-time remote", "in-office" or null
     * comparison: comparison group (e.g. "in-office control group", "pre-remote baseline") or null
     * outcome: measured metric (e.g. "total factor productivity growth", "calls per minute", "quit rate") or null
     * measurementType: "objective_metric", "self_reported_survey", "manager_rating", or "economic_aggregate"
     * studyDesign: e.g. "randomized controlled trial", "cross-sectional survey", "difference-in-differences" or null
   - DO NOT invent scope values. If the source does not mention a field, set it to null. Never hallucinate missing metadata.

7. GENERAL EXTRACTION CONSTRAINTS:
   - Extract ONLY information explicitly stated in the source text. No outside knowledge.
   - Do not combine information from different sources into one claim.
   - Maximum ${MAX_CLAIMS_PER_SOURCE} claims per source.
   - Distinguish whether content is from a "search_snippet" (limited evidence) or "full_webpage".

Valid claimType values:
- factual: verified factual statements or findings
- quantitative: specific statistics, percentages, or measurements
- comparative: comparisons between two or more options (e.g., remote vs. office vs. hybrid)
- causal: established causal links (e.g., A leads to B)
- conditional: findings that only hold under specific circumstances
- limitation: study limitations, self-reported survey warnings, or data gaps
- methodological: description of how data was gathered (sample size, trial design)

Valid evidenceStrength values:
- strong: replicated, peer-reviewed, or large-sample empirical measurement
- moderate: credible observational study, standard survey, or report
- limited: brief snippet, unverified claim, or small sample

Return ONLY this JSON format:

{
  "claims": [
    {
      "sourceId": "...",
      "claimText": "...",
      "claimType": "factual",
      "condition": null,
      "evidenceStrength": "moderate",
      "scope": {
        "population": null,
        "sample": null,
        "organization": null,
        "industry": null,
        "taskType": null,
        "analyticalLevel": "individual",
        "geography": null,
        "timeframe": null,
        "workArrangement": null,
        "comparison": null,
        "outcome": null,
        "measurementType": null,
        "studyDesign": null
      }
    }
  ]
}

Sources:

${sourceText}
`;

  const result =
    await groqJson({
      user: prompt,
      temperature: 0.1,
      maxTokens: 3000,
    });

  if (
    !Array.isArray(result.claims)
  ) {
    throw new Error(
      "Claim extraction returned invalid claims array"
    );
  }

  return normalizeClaims(
    result.claims,
    sources
  );
}

export async function extractClaims(
  sources
) {
  if (
    !Array.isArray(sources) ||
    sources.length === 0
  ) {
    const empty = [];
    empty.claimExtractionFailures = [];
    return empty;
  }

  const batches =
    buildBatches(sources);

  const allClaims = [];
  const claimExtractionFailures = [];

  const delay = (ms) =>
    new Promise((resolve) =>
      setTimeout(resolve, ms)
    );

  for (
    let i = 0;
    i < batches.length;
    i++
  ) {
    if (i > 0) {
      await delay(1200);
    }

    try {
      const claims =
        await extractBatch(
          batches[i]
        );

      allClaims.push(
        ...claims
      );
    } catch (err) {
      console.warn(
        `[ClaimExtractor] Batch ${i + 1}/${batches.length} extraction failed: ${err.message}`
      );
      claimExtractionFailures.push({
        batchIndex: i + 1,
        sourceCount:
          batches[i].length,
        error: err.message,
      });
    }
  }

  allClaims.claimExtractionFailures =
    claimExtractionFailures;

  return allClaims;
}