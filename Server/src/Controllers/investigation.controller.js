import { decomposeQuestion } from "../AI/Graph.js";

import {
  researchAll,
  normalizeUrl,
} from "../AI/Researcher.js";

import {
  evaluateSources,
} from "../AI/SemanticRelevanceEvaluator.js";

import {
  extractWebpages,
} from "../AI/WebpageExtractor.js";

import {
  extractClaims,
} from "../AI/ClaimExtractor.js";

import {
  analyzeEvidence,
} from "../AI/EvidenceAnalyzer.js";

const MAX_RELEVANT_SOURCES_PER_SUBQUESTION = 2;

export const startInvestigation = async (
  req,
  res
) => {
  const {
    question,
    sourceType = "web",
  } = req.body;

  if (
    !question ||
    typeof question !== "string" ||
    question.trim().length === 0
  ) {
    return res.status(400).json({
      error:
        "Question is required",
    });
  }

  const allowedSourceTypes = [
    "web",
    "news",
    "scholar",
  ];

  if (
    !allowedSourceTypes.includes(
      sourceType
    )
  ) {
    return res.status(400).json({
      error:
        "sourceType must be web, news, or scholar",
    });
  }

  try {
    console.log(
      "\n===================================="
    );

    console.log(
      "Starting DeepScout Investigation"
    );

    console.log(
      "====================================\n"
    );

    // ==========================================
    // 1. QUESTION DECOMPOSITION
    // ==========================================

    console.log(
      "1. Decomposing question..."
    );

    const decomposition =
      await decomposeQuestion(
        question.trim()
      );

    console.log(
      `Found ${decomposition.subQuestions.length} sub-questions`
    );

    // ==========================================
    // 2. SEARCH
    // ==========================================

    console.log(
      "\n2. Searching sources..."
    );

    const researched =
      await researchAll(
        decomposition.subQuestions,
        sourceType
      );

    console.log(
      "Research completed."
    );

    // ==========================================
    // 3. SEMANTIC RELEVANCE
    // ==========================================

    console.log(
      "\n3. Evaluating semantic relevance..."
    );

    const evaluated =
      await evaluateSources(
        researched
      );

    const relevantBySubQuestion =
      evaluated.map(
        (research) => ({
          subQuestion:
            research.subQuestion,

          sources:
            research.sources
              .sort(
                (a, b) =>
                  b.semanticScore -
                  a.semanticScore
              )
              .slice(
                0,
                MAX_RELEVANT_SOURCES_PER_SUBQUESTION
              ),
        })
      );

    const totalRelevantSources =
      relevantBySubQuestion.reduce(
        (total, item) =>
          total +
          item.sources.length,
        0
      );

    console.log(
      `Relevant sources selected: ${totalRelevantSources}`
    );

    // ==========================================
    // 4. FETCH ACTUAL WEBPAGES
    // ==========================================

    console.log(
      "\n4. Extracting webpage content..."
    );

    const allRelevantSources =
      relevantBySubQuestion.flatMap(
        (item) =>
          item.sources.map(
            (source) => ({
              ...source,

              subQuestion:
                item.subQuestion,
            })
          )
      );

    // Cross-subquestion URL deduplication before fetching
    const seenUrls = new Set();
    const uniqueRelevantSources = [];
    const sourceIdToCanonicalMap = new Map();

    for (const source of allRelevantSources) {
      const normUrl = normalizeUrl(source.url || "");
      if (normUrl && seenUrls.has(normUrl)) {
        const canonical = uniqueRelevantSources.find(
          (s) => normalizeUrl(s.url || "") === normUrl
        );
        if (canonical) {
          sourceIdToCanonicalMap.set(source.id, canonical.id);
        }
        continue;
      }
      if (normUrl) {
        seenUrls.add(normUrl);
      }
      uniqueRelevantSources.push(source);
      sourceIdToCanonicalMap.set(source.id, source.id);
    }

    const pages =
      await extractWebpages(
        uniqueRelevantSources
      );

    const successfulPages =
      pages.filter(
        (page) =>
          page.extractionStatus ===
          "success"
      ).length;

    const fallbackPages = pages.length - successfulPages;
    console.log(
      `Extracted evidence for ${pages.length}/${pages.length} unique sources (${successfulPages} full webpages, ${fallbackPages} verified search summaries)`
    );

    // ==========================================
    // 5. CLAIM EXTRACTION
    // ==========================================

    console.log(
      "\n5. Extracting claims..."
    );

    const claims =
      await extractClaims(
        pages
      );

    console.log(
      `Extracted ${claims.length} claims`
    );

    // ==========================================
    // 6. EVIDENCE ANALYSIS + FINAL SYNTHESIS
    // ==========================================

    console.log(
      "\n6. Analyzing evidence..."
    );

    const analysis =
      await analyzeEvidence({
        question:
          decomposition.question,

        claims,

        sources: pages,
      });

    console.log(
      "Evidence analysis completed."
    );

    // ==========================================
    // 7. ORGANIZE RESPONSE FOR FRONTEND
    // ==========================================

    const extractedPageMap = new Map(
      pages.map((source) => [source.id, source])
    );

    const getSourcePage = (sourceId) => {
      const canonicalId =
        sourceIdToCanonicalMap.get(sourceId) || sourceId;
      return (
        extractedPageMap.get(canonicalId) ||
        extractedPageMap.get(sourceId)
      );
    };

    const subQuestionOutput =
      relevantBySubQuestion.map(
        (item) => ({
          subQuestion:
            item.subQuestion,

          sources:
            item.sources.map(
              (source) => {
                const fullSource =
                  getSourcePage(
                    source.id
                  );

                return {
                  id: source.id,

                  title:
                    source.title,

                  url:
                    source.url,

                  source:
                    source.source,

                  publishedDate:
                    source.publishedDate,

                  relevance:
                    source.relevance,

                  semanticScore:
                    source.semanticScore,

                  semanticReason:
                    source.semanticReason,

                  extractionStatus:
                    fullSource
                      ?.extractionStatus ||
                    "unknown",
                };
              }
            ),

          claims:
            claims.filter((claim) => {
              const canonicalClaimSourceId =
                sourceIdToCanonicalMap.get(claim.sourceId) ||
                claim.sourceId;
              return (
                claim.subQuestion === item.subQuestion ||
                item.sources.some(
                  (s) =>
                    (sourceIdToCanonicalMap.get(s.id) || s.id) ===
                    canonicalClaimSourceId
                )
              );
            }),
        })
      );

    const searchFailures = researched.searchFailures || [];
    const extractionFailures = pages.extractionFailures || [];
    const claimExtractionFailures = claims.claimExtractionFailures || [];

    const candidateSourceCount = researched.reduce(
      (total, r) =>
        total + (r.searchedResults || r.sources?.length || 0),
      0
    );

    const successfulExtractionCount = pages.filter(
      (page) => page.extractionStatus === "success"
    ).length;

    const failedExtractionCount = pages.filter(
      (page) => page.extractionStatus !== "success"
    ).length;

    const partialInvestigation =
      searchFailures.length > 0 ||
      extractionFailures.length > 0 ||
      claimExtractionFailures.length > 0;

    const claimsUsedInFindings = [
      ...new Set(
        (analysis.keyFindings || []).flatMap((kf) => kf.claimIds || [])
      ),
    ].length;

    const claimsUsedInConclusion =
      analysis.conclusion?.claimIds?.length || 0;

    const sourcesUsedInConclusion =
      analysis.conclusion?.sourceIds?.length || 0;

    const metadata = {
      subQuestionCount:
        decomposition.subQuestions.length,
      candidateSourceCount,
      relevantSourceCount:
        pages.length,
      successfulExtractionCount,
      failedExtractionCount,
      claimCount:
        claims.length,
      claimsUsedInFindings,
      claimsUsedInConclusion,
      sourcesUsedInConclusion,
      sourceType,
      partialInvestigation,
      searchFailures,
      extractionFailures,
      claimExtractionFailures,
    };

    const responsePayload = {
      question:
        decomposition.question,

      subQuestions:
        subQuestionOutput,

      keyFindings:
        analysis.keyFindings,

      conflictingEvidence:
        analysis.conflictingEvidence,

      comparabilityNotes:
        analysis.comparabilityNotes || [],

      conditions:
        analysis.conditions,

      conclusion:
        analysis.conclusion,

      metadata,
    };

    console.log(
      "\n===================================="
    );

    console.log(
      "DeepScout Investigation Completed"
    );

    console.log(
      "====================================\n"
    );

    const conclusionText =
      typeof analysis.conclusion === "object" &&
      analysis.conclusion !== null
        ? analysis.conclusion.text
        : analysis.conclusion;

    console.log("📋 FINAL CONCLUSION:\n");
    console.log(conclusionText || "No conclusion generated.");

    if (
      typeof analysis.conclusion === "object" &&
      analysis.conclusion !== null &&
      (claimsUsedInConclusion > 0 || sourcesUsedInConclusion > 0)
    ) {
      console.log(
        `\n📎 Conclusion Traceability: ${claimsUsedInConclusion} claims cited across ${sourcesUsedInConclusion} sources (Key findings utilize ${claimsUsedInFindings} unique claims)`
      );
    }

    if (metadata.partialInvestigation) {
      console.log("\n⚠️  PARTIAL INVESTIGATION WARNING:");
      if (searchFailures.length > 0) {
        console.log(
          `  - Search failures (${searchFailures.length}):`,
          searchFailures.map((f) => f.subQuestion || f.query).join("; ")
        );
      }
      if (extractionFailures.length > 0) {
        console.log(
          `  - Extraction failures (${extractionFailures.length}):`,
          extractionFailures.map((f) => f.url || f.title).join("; ")
        );
      }
      if (claimExtractionFailures.length > 0) {
        console.log(
          `  - Claim extraction failures (${claimExtractionFailures.length}):`,
          claimExtractionFailures
            .map((f) => `Batch ${f.batchIndex}: ${f.error}`)
            .join("; ")
        );
      }
    }

    if (
      Array.isArray(analysis.keyFindings) &&
      analysis.keyFindings.length > 0
    ) {
      console.log("\n🔑 KEY FINDINGS:\n");
      analysis.keyFindings.forEach((finding, idx) => {
        console.log(`  ${idx + 1}. ${finding.text}`);
      });
    }

    if (
      Array.isArray(analysis.conditions) &&
      analysis.conditions.length > 0
    ) {
      console.log("\n⚖️  CONDITIONS & NUANCES:\n");
      analysis.conditions.forEach((cond, idx) => {
        console.log(`  ${idx + 1}. ${cond.text}`);
      });
    }

    if (
      Array.isArray(analysis.conflictingEvidence) &&
      analysis.conflictingEvidence.length > 0
    ) {
      console.log("\n⚠️  CONFLICTING EVIDENCE (Empirical Contradictions):\n");
      analysis.conflictingEvidence.forEach((conf, idx) => {
        const typeTag = conf.type ? `[${conf.type}] ` : "";
        console.log(`  ${idx + 1}. ${typeTag}${conf.description || conf.text}`);
        if (conf.whyTheyDiffer) {
          console.log(`     Contradiction details: ${conf.whyTheyDiffer}`);
        }
      });
    }

    if (
      Array.isArray(analysis.comparabilityNotes) &&
      analysis.comparabilityNotes.length > 0
    ) {
      console.log("\n🔍 COMPARABILITY NOTES (Non-Contradictory Differences):\n");
      analysis.comparabilityNotes.forEach((note, idx) => {
        const typeTag = note.type ? `[${note.type}] ` : "";
        console.log(`  ${idx + 1}. ${typeTag}${note.description || note.text}`);
        if (note.whyTheyDiffer) {
          console.log(`     Why they differ: ${note.whyTheyDiffer}`);
        }
      });
    }

    console.log(
      "\n====================================\n"
    );

    return res.json(
      responsePayload
    );
  } catch (error) {
    console.error(
      "\nInvestigation failed:",
      error
    );

    const message =
      error?.message || "";

    if (
      message.includes(
        "rate limit"
      ) ||
      message.includes(
        "429"
      )
    ) {
      return res.status(429).json({
        error:
          "Groq rate limit reached. Please try again shortly.",
      });
    }

    return res.status(500).json({
      error:
        "Failed to investigate question",

      details:
        process.env.NODE_ENV ===
        "development"
          ? message
          : undefined,
    });
  }
};