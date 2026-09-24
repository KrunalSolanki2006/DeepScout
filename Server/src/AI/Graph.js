import "dotenv/config";
import { groqJson } from "./GroqClient.js";

const MAX_SUBQUESTIONS = 5;

export async function decomposeQuestion(question) {
  if (
    !question ||
    typeof question !== "string"
  ) {
    throw new Error("Invalid investigation question");
  }

  const prompt = `
You are the investigation planning component of DeepScout.

DeepScout does NOT want to answer the user's question immediately.

Instead, decompose the question into smaller researchable
sub-questions that together provide structured evidence to answer
the original question.

Rules:

1. Create between 3 and ${MAX_SUBQUESTIONS} distinct sub-questions.
2. Every sub-question must be independently searchable on Google/academic databases.
3. Separate distinct outcome dimensions (e.g., individual task focus vs. collaborative innovation, well-being/burnout, organizational costs).
4. If the question addresses long-term, sustained, or lasting effects, explicitly include sub-questions examining longitudinal/sustained evidence vs. short-term or temporary effects.
5. Include important conditions, trade-offs, comparisons (e.g., hybrid vs. fully remote/in-office), or opposing evidence.
6. Keep sub-questions concise and targeted for search queries.
7. Do not answer the question.
8. Do not invent assumptions.
9. Avoid duplicate sub-questions.

User question:

"${question}"

Return ONLY this JSON:

{
  "question": "${question}",
  "subQuestions": [
    "sub-question 1",
    "sub-question 2"
  ]
}
`;

  const result = await groqJson({
    user: prompt,
    temperature: 0.1,
    maxTokens: 1200,
  });

  if (!Array.isArray(result.subQuestions)) {
    throw new Error(
      "Question decomposition returned invalid subQuestions"
    );
  }

  const subQuestions = result.subQuestions
    .filter(
      (item) =>
        typeof item === "string" &&
        item.trim().length > 0
    )
    .map((item) => item.trim())
    .slice(0, MAX_SUBQUESTIONS);

  if (subQuestions.length === 0) {
    throw new Error(
      "Question decomposition returned no usable sub-questions"
    );
  }

  return {
    question: question.trim(),
    subQuestions,
  };
}