import "dotenv/config";
import { groqJson } from "./GroqClient.js";

export async function evaluateSources(
  researchResults
) {
  if (
    !Array.isArray(researchResults) ||
    researchResults.length === 0
  ) {
    return [];
  }

  const candidateSources = [];

  for (const research of researchResults) {
    for (const source of research.sources || []) {
      candidateSources.push({
        subQuestion:
          research.subQuestion,

        sourceId: source.id,

        title: source.title,

        snippet: (source.content || "").slice(0, 450),

        url: source.url,
      });
    }
  }

  if (candidateSources.length === 0) {
    return researchResults.map(
      (research) => ({
        subQuestion:
          research.subQuestion,
        sources: [],
      })
    );
  }

  const sourceText =
    candidateSources
      .map(
        (source, index) => `
SOURCE ${index + 1}

Sub-question:
${source.subQuestion}

Source ID:
${source.sourceId}

Title:
${source.title}

Snippet:
${source.snippet}

URL:
${source.url}
`
      )
      .join("\n----------------------\n");

  const prompt = `
You are the semantic relevance evaluator for DeepScout.

DeepScout first performs cheap keyword filtering.
Your job is to perform the second-stage meaning-level
relevance evaluation.

A source is relevant only when its content actually
provides useful evidence for answering the associated
sub-question.

Rules:

- Judge meaning, not keyword overlap.
- Do not answer the sub-question.
- Do not judge source credibility.
- Do not invent information.
- A source can be relevant even if it does not fully answer
  the sub-question.
- A source should be marked irrelevant if the snippet only
  happens to share keywords.
- Score between 0 and 1.
- Return exactly one evaluation for each source.

Candidate sources:

${sourceText}

Return ONLY:

{
  "evaluations": [
    {
      "sourceId": "...",
      "relevant": true,
      "score": 0.0,
      "reason": "short explanation"
    }
  ]
}
`;

  const result = await groqJson({
    user: prompt,
    temperature: 0.1,
    maxTokens: 3500,
  });

  if (
    !Array.isArray(result.evaluations)
  ) {
    throw new Error(
      "Semantic relevance returned invalid evaluations"
    );
  }

  const evaluationMap =
    new Map(
      result.evaluations.map(
        (evaluation) => [
          evaluation.sourceId,
          evaluation,
        ]
      )
    );

  return researchResults.map(
    (research) => {
      const scoredSources =
        (research.sources || [])
          .map((source) => {
            const evaluation =
              evaluationMap.get(
                source.id
              );

            if (!evaluation) {
              return {
                ...source,
                semanticRelevant: true,
                semanticScore: 0.5,
                semanticReason:
                  "Default candidate",
              };
            }

            const score = Number(
              evaluation.score
            );

            const validScore =
              Number.isFinite(score)
                ? Math.max(
                    0,
                    Math.min(1, score)
                  )
                : 0;

            return {
              ...source,

              semanticRelevant:
                evaluation.relevant ===
                  true ||
                validScore >= 0.5,

              semanticScore:
                validScore,

              semanticReason:
                typeof evaluation.reason ===
                "string"
                  ? evaluation.reason
                  : "",
            };
          });

      let relevant =
        scoredSources.filter(
          (source) =>
            source.semanticRelevant ===
            true
        );

      // Safety fallback: if no candidate sources passed the strict filter,
      // take the highest-scoring candidate so the sub-question is not starved of evidence
      if (
        relevant.length === 0 &&
        scoredSources.length > 0
      ) {
        scoredSources.sort(
          (a, b) =>
            b.semanticScore -
            a.semanticScore
        );

        relevant = [
          scoredSources[0],
        ];
      }

      relevant.sort(
        (a, b) =>
          b.semanticScore -
          a.semanticScore
      );

      return {
        subQuestion:
          research.subQuestion,

        sources: relevant,
      };
    }
  );
}