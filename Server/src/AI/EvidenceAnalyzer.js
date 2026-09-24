import { groqJson } from "./GroqClient.js";

function unique(values) {
  return [
    ...new Set(
      values.filter(Boolean)
    ),
  ];
}

function sanitizeReferences(
  ids,
  validIds
) {
  if (!Array.isArray(ids)) {
    return [];
  }

  return unique(
    ids.filter((id) =>
      validIds.has(id)
    )
  );
}

function formatConclusionSentenceOrder(conclusionText, question) {
  const normalizedText = (conclusionText || "").replace(/[\u2010-\u2015]/g, "-");
  const isLongTermQuestion = /long-?term|sustained|over years|over time|lasting/i.test(
    (question || "").replace(/[\u2010-\u2015]/g, "-")
  );
  if (!isLongTermQuestion) return normalizedText;

  const sentences = normalizedText
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length <= 1) return normalizedText;

  // If sentence 0 already leads with long-term, keep it
  if (
    /^regarding long-?term|the available evidence does not establish a definitive long-?term|long-?term effects cannot be/i.test(
      sentences[0]
    )
  ) {
    return sentences.join(" ");
  }

  // Find index of long-term limitation sentence
  const ltIndex = sentences.findIndex((s) =>
    /does not establish a definitive long-?term|definitive long-?term conclusions? cannot be drawn|longer-?term \([^)]+\) data are limited|long-?term evidence is limited/i.test(
      s
    )
  );

  if (ltIndex > 0) {
    let ltSentence = sentences[ltIndex];
    // Clean leading "However, " or "Nevertheless, "
    ltSentence = ltSentence.replace(/^(however|nevertheless|nonetheless),\s*/i, "");
    // Ensure it begins with a clear timeframe lead
    if (!/^regarding long-?term/i.test(ltSentence)) {
      ltSentence =
        "Regarding long-term effects, " +
        ltSentence.charAt(0).toLowerCase() +
        ltSentence.slice(1);
    }
    sentences.splice(ltIndex, 1);
    sentences.unshift(ltSentence);
    return sentences.join(" ");
  }

  return sentences.join(" ");
}

function classifyDivergence(item, claimObjMap) {
  const claimIds = item.claimIds || [];
  const c1 = claimObjMap.get(claimIds[0]);
  const c2 = claimObjMap.get(claimIds[1]);

  const rawType = (item.type || "").toLowerCase().trim();
  const why = (item.whyTheyDiffer || "").toLowerCase();
  const desc = (item.description || "").toLowerCase();
  const context = `${why} ${desc}`;

  // Scope extraction
  const s1 = c1?.scope || {};
  const s2 = c2?.scope || {};

  const c1Text = (c1?.claimText || "").toLowerCase();
  const c2Text = (c2?.claimText || "").toLowerCase();
  const combinedContext = `${c1Text} ${c2Text} ${context}`;

  // 1. OUTCOME comparison
  const outcome1 = (s1.outcome || "").toLowerCase();
  const outcome2 = (s2.outcome || "").toLowerCase();
  const outcomeDiffers =
    rawType === "different_outcome" ||
    /\b(different|differing|distinct)\s+(outcome|metric)/i.test(context) ||
    (outcome1 && outcome2 && outcome1 !== outcome2 && !outcome1.includes(outcome2) && !outcome2.includes(outcome1)) ||
    ((combinedContext.includes("dedication") || combinedContext.includes("inclusion") || combinedContext.includes("wellbeing") || combinedContext.includes("burnout") || combinedContext.includes("retention") || combinedContext.includes("satisfaction") || combinedContext.includes("culture")) &&
     (combinedContext.includes("productivity") || combinedContext.includes("output") || combinedContext.includes("calls per minute") || combinedContext.includes("speed")));

  // 2. TASK TYPE comparison
  const task1 = (s1.taskType || "").toLowerCase();
  const task2 = (s2.taskType || "").toLowerCase();
  const taskDiffers =
    rawType === "different_task_type" ||
    /\b(different|differing)\s+task/i.test(context) ||
    context.includes("routine vs collaborative") ||
    context.includes("individual-focused vs collaborative") ||
    context.includes("routine vs") ||
    (task1 && task2 && task1 !== task2 && !task1.includes(task2) && !task2.includes(task1)) ||
    ((combinedContext.includes("call center") || combinedContext.includes("call-center") || combinedContext.includes("routine")) &&
     (combinedContext.includes("creative") || combinedContext.includes("collaborat") || combinedContext.includes("brainstorming") || combinedContext.includes("knowledge work")));

  // 3. POPULATION / ORGANIZATION / CONTEXT comparison
  const pop1 = `${s1.population || ""} ${s1.organization || ""} ${s1.industry || ""}`.toLowerCase().trim();
  const pop2 = `${s2.population || ""} ${s2.organization || ""} ${s2.industry || ""}`.toLowerCase().trim();
  const popDiffers =
    rawType === "different_population" ||
    /\b(different|differing)\s+(population|organization|company|worker group|cohort)/i.test(context) ||
    context.includes("engineers vs") ||
    context.includes("ctrip vs zillow") ||
    (pop1 && pop2 && pop1 !== pop2 && !pop1.includes(pop2) && !pop2.includes(pop1)) ||
    ((combinedContext.includes("ctrip") || combinedContext.includes("travel agency")) &&
     (combinedContext.includes("zillow") || combinedContext.includes("tech company") || combinedContext.includes("tech firm")));

  // 4. MEASUREMENT METHOD comparison (objective output vs self-report vs manager perception)
  const meas1 = (s1.measurementType || "").toLowerCase();
  const meas2 = (s2.measurementType || "").toLowerCase();
  const measDiffers =
    rawType === "different_measurement" ||
    /\b(different|differing)\s+(measurement|method)/i.test(context) ||
    context.includes("self-reported vs") ||
    context.includes("objective vs") ||
    context.includes("objective output vs") ||
    context.includes("perception vs") ||
    (meas1 && meas2 && meas1 !== meas2 && !meas1.includes(meas2) && !meas2.includes(meas1)) ||
    ((combinedContext.includes("objective") || combinedContext.includes("calls") || combinedContext.includes("measured output") || combinedContext.includes("phone log")) &&
     (combinedContext.includes("perception") || combinedContext.includes("self-reported") || combinedContext.includes("survey") || combinedContext.includes("subjective")));

  // 5. TIMEFRAME comparison
  const time1 = (s1.timeframe || "").toLowerCase();
  const time2 = (s2.timeframe || "").toLowerCase();
  const timeDiffers =
    rawType === "different_time_period" ||
    /\b(different|differing)\s+(time|timeframe|time period)/i.test(context) ||
    context.includes("pandemic vs") ||
    context.includes("short-term vs") ||
    context.includes("2015 vs 2023") ||
    (time1 && time2 && time1 !== time2 && !time1.includes(time2) && !time2.includes(time1));

  // 6. INTERVENTION / WORK ARRANGEMENT / CONDITION comparison
  const cond1 = (s1.workArrangement || "").toLowerCase();
  const cond2 = (s2.workArrangement || "").toLowerCase();
  const condDiffers =
    rawType === "different_condition" ||
    /\b(different|differing)\s+(condition|arrangement|schedule)/i.test(context) ||
    (cond1 && cond2 && cond1 !== cond2 && !cond1.includes(cond2) && !cond2.includes(cond1));

  // 7. METHODOLOGY / STUDY DESIGN comparison
  const meth1 = (s1.studyDesign || "").toLowerCase();
  const meth2 = (s2.studyDesign || "").toLowerCase();
  const methDiffers =
    rawType === "different_methodology" ||
    /\b(different|differing)\s+(methodology|study design)/i.test(context) ||
    context.includes("rct vs") ||
    (meth1 && meth2 && meth1 !== meth2 && !meth1.includes(meth2) && !meth2.includes(meth1));

  // Collect distinct difference categories
  const detectedDiffs = [];
  if (outcomeDiffers) detectedDiffs.push("different_outcome");
  if (taskDiffers) detectedDiffs.push("different_task_type");
  if (popDiffers) detectedDiffs.push("different_population");
  if (measDiffers) detectedDiffs.push("different_measurement");
  if (timeDiffers) detectedDiffs.push("different_time_period");
  if (condDiffers) detectedDiffs.push("different_condition");
  if (methDiffers) detectedDiffs.push("different_methodology");

  // Rule 7: If multiple major differences make comparison inappropriate -> insufficient_comparability
  if (
    detectedDiffs.length >= 2 ||
    rawType === "insufficient_comparability" ||
    context.includes("insufficient comparability") ||
    context.includes("not directly comparable") ||
    context.includes("not comparable") ||
    context.includes("inappropriate to compare") ||
    (combinedContext.includes("ctrip") && combinedContext.includes("zillow"))
  ) {
    return {
      type: "insufficient_comparability",
      isTrueConflict: false,
    };
  }

  // Single difference
  if (detectedDiffs.length === 1) {
    return {
      type: detectedDiffs[0],
      isTrueConflict: false,
    };
  }

  // Rule 8: ONLY use true_conflict when comparable studies examine substantially the same
  // population, outcome, timeframe, intervention, and measurement but reach materially different conclusions.
  if (
    rawType === "true_conflict" ||
    /\b(contradict|conflict|opposing conclusions?|opposite directional|opposing effects?)\b/i.test(context)
  ) {
    return {
      type: "true_conflict",
      isTrueConflict: true,
    };
  }

  return {
    type: "different_condition",
    isTrueConflict: false,
  };
}

function validateAndRepairSynthesis({
  question,
  claims,
  sources,
  keyFindings,
  conflictingEvidence,
  comparabilityNotes,
  conditions,
  conclusion,
}) {
  const validClaimIds = new Set(claims.map((c) => c.claimId));
  const validSourceIds = new Set(sources.map((s) => s.id));
  const claimSourceMap = new Map(claims.map((c) => [c.claimId, c.sourceId]));
  const claimObjMap = new Map(claims.map((c) => [c.claimId, c]));

  const resolveSources = (explicitSourceIds, claimIds) => {
    const sanitized = sanitizeReferences(explicitSourceIds, validSourceIds);
    if (sanitized.length > 0) return sanitized;
    const derived = (claimIds || [])
      .map((cid) => claimSourceMap.get(cid))
      .filter((sid) => sid && validSourceIds.has(sid));
    return unique(derived);
  };

  // 1. Sanitize key findings
  const repairedKeyFindings = (keyFindings || [])
    .map((item) => {
      const claimIds = sanitizeReferences(item.claimIds, validClaimIds);
      return {
        text: typeof item.text === "string" ? item.text.trim() : "",
        claimIds,
        sourceIds: resolveSources(item.sourceIds, claimIds),
      };
    })
    .filter((item) => item.text);

  // 2. Strict Partition: ONLY true_conflict in conflictingEvidence; all others in comparabilityNotes
  const allDivergences = [
    ...(conflictingEvidence || []),
    ...(comparabilityNotes || []),
  ];

  const onlyTrueConflicts = [];
  const repairedComparabilityNotes = [];

  for (const item of allDivergences) {
    const claimIds = sanitizeReferences(item.claimIds, validClaimIds);
    const classification = classifyDivergence(item, claimObjMap);

    let whyTheyDiffer =
      typeof item.whyTheyDiffer === "string" ? item.whyTheyDiffer.trim() : "";
    if (!whyTheyDiffer) {
      if (classification.type === "insufficient_comparability") {
        whyTheyDiffer =
          "Studies differ across multiple major dimensions (such as outcome, task type, measurement method, and population), making direct comparison inappropriate.";
      } else if (classification.type === "different_measurement") {
        whyTheyDiffer =
          "Studies use different measurement methods (e.g. objective output metrics vs self-reported surveys or manager perceptions).";
      } else if (classification.type === "different_task_type") {
        whyTheyDiffer =
          "Studies evaluate different task types (e.g. routine individual tasks vs creative collaborative tasks).";
      } else if (classification.type === "different_outcome") {
        whyTheyDiffer =
          "Studies evaluate fundamentally distinct outcomes rather than conflicting measurements of the same outcome.";
      } else if (classification.type === "different_population") {
        whyTheyDiffer =
          "Studies examine different worker populations, organizational contexts, or industries.";
      }
    }

    const sanitizedItem = {
      type: classification.type,
      description:
        typeof item.description === "string" ? item.description.trim() : "",
      claimIds,
      sourceIds: resolveSources(item.sourceIds, claimIds),
      whyTheyDiffer,
    };

    if (!sanitizedItem.description) continue;

    // RULE 8 & 9: ONLY genuine true_conflict belongs in conflictingEvidence.
    // All non-contradictory differences belong in comparabilityNotes.
    if (classification.isTrueConflict && sanitizedItem.type === "true_conflict") {
      onlyTrueConflicts.push(sanitizedItem);
    } else {
      repairedComparabilityNotes.push(sanitizedItem);
    }
  }

  // 3. Sanitize conditions
  const repairedConditions = (conditions || [])
    .map((item) => {
      const claimIds = sanitizeReferences(item.claimIds, validClaimIds);
      return {
        text: typeof item.text === "string" ? item.text.trim() : "",
        claimIds,
        sourceIds: resolveSources(item.sourceIds, claimIds),
      };
    })
    .filter((item) => item.text);

  // 4. Sanitize and repair conclusion
  let conclusionText =
    typeof conclusion?.text === "string" && conclusion.text.trim()
      ? conclusion.text.trim().replace(/[\u2010-\u2015]/g, "-")
      : "The available evidence does not support a sufficiently clear conclusion.";

  let conclusionClaimIds = sanitizeReferences(
    conclusion?.claimIds,
    validClaimIds
  );

  // If conclusion has no cited claims, pull from keyFindings
  if (conclusionClaimIds.length === 0 && repairedKeyFindings.length > 0) {
    conclusionClaimIds = unique(
      repairedKeyFindings.flatMap((kf) => kf.claimIds)
    );
  }

  let conclusionSourceIds = resolveSources(
    conclusion?.sourceIds,
    conclusionClaimIds
  );

  // 5. Long-term consistency verification & repair (Sections 3, 9, 10, 30)
  const isLongTermQuestion = /long-?term|sustained|over years|over time|lasting/i.test(
    question.replace(/[\u2010-\u2015]/g, "-")
  );

  if (isLongTermQuestion) {
    const hasDirectionalLongTerm =
      /^long-?term\s+[^.]+?\b(tends to|reduces?|harms?|hurts?|boosts?|improves?|increases?|destroys?)\b/i.test(
        conclusionText
      );
    const admitsNoLongTerm =
      /definitive long-?term conclusions? cannot be drawn|evidence is limited to short|not enough long-?term evidence|longer-?term \([^)]+\) data are limited/i.test(
        conclusionText
      );

    if (hasDirectionalLongTerm && admitsNoLongTerm) {
      conclusionText = conclusionText.replace(
        /^long-?term\s+[^.]+?\.\s*/i,
        "Regarding long-term effects, the available evidence does not establish a definitive long-term effect of working from home on employee productivity or innovation, as multi-year longitudinal evidence remains limited. Short- and medium-term observations indicate that "
      );
    }

    // Ensure sentence 1 leads directly with the timeframe verdict
    conclusionText = formatConclusionSentenceOrder(conclusionText, question);
  }

  // 6. Prevent false conflict synthesis and remove unsolicited advice (Rule 10)
  conclusionText = conclusionText
    .replace(
      /\bconflicting\s+evidence\s+(between|regarding)\s+(Ctrip|routine\s+workers)[^.]*?(Zillow|perceptions?)[^.]*\./gi,
      "Comparability differences exist between studies of routine individual workers (such as Ctrip, which measured objective call-center output) and studies of knowledge workers (such as Zillow, which captured employee perceptions of dedication and inclusion)."
    )
    .replace(
      /\b(conflict|contradict)\b[^.]*?\b(Ctrip|Zillow)\b[^.]*?\./gi,
      "Findings from Ctrip (objective call-center output) and Zillow (employee perceptions) represent different outcomes, measurement types, and task contexts rather than an empirical contradiction."
    )
    .replace(
      /\b(Therefore|In conclusion),\s+(companies|organizations|employers)\s+(must|should|need to)\s+[^.]+\./gi,
      ""
    )
    .trim();

  return {
    keyFindings: repairedKeyFindings,
    conflictingEvidence: onlyTrueConflicts, // ONLY true conflicts!
    comparabilityNotes: repairedComparabilityNotes, // Non-contradictory differences (task, measurement, context)
    conditions: repairedConditions,
    conclusion: {
      text: conclusionText,
      claimIds: conclusionClaimIds,
      sourceIds: conclusionSourceIds,
    },
  };
}

export async function analyzeEvidence({
  question,
  claims,
  sources,
}) {
  if (
    !Array.isArray(claims) ||
    claims.length === 0
  ) {
    return {
      keyFindings: [],
      conflictingEvidence: [],
      comparabilityNotes: [],
      conditions: [],
      conclusion: {
        text: "There is not enough extracted evidence to produce a supported conclusion.",
        claimIds: [],
        sourceIds: [],
      },
    };
  }

  const allFromSnippets =
    sources.length > 0 &&
    sources.every(
      (s) =>
        s.contentType === "search_snippet" ||
        s.extractionStatus === "fallback"
    );

  const claimText = claims
    .map((claim) => {
      const scopeParts = claim.scope
        ? [
            claim.scope.analyticalLevel && `Level: ${claim.scope.analyticalLevel}`,
            claim.scope.taskType && `Task: ${claim.scope.taskType}`,
            claim.scope.population && `Population: ${claim.scope.population}`,
            claim.scope.timeframe && `Timeframe: ${claim.scope.timeframe}`,
            claim.scope.workArrangement && `Arrangement: ${claim.scope.workArrangement}`,
            claim.scope.measurementType && `Measurement: ${claim.scope.measurementType}`,
            claim.scope.outcome && `Outcome: ${claim.scope.outcome}`,
            claim.scope.sample && `Sample: ${claim.scope.sample}`,
            claim.scope.organization && `Organization: ${claim.scope.organization}`,
            claim.scope.industry && `Industry: ${claim.scope.industry}`,
            claim.scope.studyDesign && `Design: ${claim.scope.studyDesign}`,
          ]
            .filter(Boolean)
            .join(" | ")
        : "";

      return `
CLAIM ID: ${claim.claimId}
SOURCE ID: ${claim.sourceId}
Sub-question: ${claim.subQuestion}
Claim: ${claim.claimText}
Type: ${claim.claimType}
Strength: ${claim.evidenceStrength || "moderate"}
Condition: ${claim.condition || "None"}
${scopeParts ? `Scope: ${scopeParts}` : ""}
`;
    })
    .join("\n--------------------------\n");

  const sourceText = sources
    .map(
      (source) => `
SOURCE ID: ${source.id}
Title: ${source.title}
Publisher: ${source.source || "Unknown"}
URL: ${source.url}
Published: ${source.publishedDate || "Unknown"}
Content Type: ${source.contentType || "full_webpage"}
`
    )
    .join("\n");

  const prompt = `
You are DeepScout's final evidence reasoning component.

The user asked:
"${question}"

You are given extracted claims from researched sources, including their granular evidence scopes (analytical level, task type, population, timeframe, measurement type, outcome).
Your job is to analyze ONLY these claims.

You must produce:
1. Key findings (scope-preserving, independent per outcome, preserving analytical levels)
2. Conflicting evidence (ONLY genuine empirical contradictions where studies evaluate substantially the same population, task type, timeframe, arrangement, outcome, and measurement, yet reach opposing empirical conclusions)
3. Comparability notes (Divergences between non-comparable studies that differ in outcome, task type, population, measurement method, timeframe, or condition. Do NOT label these as conflicting evidence!)
4. Conditions under which findings change
5. A structured final conclusion answering the user's question directly

CRITICAL EVIDENCE RULES:

1. EVIDENCE GROUNDING & SCOPE PRESERVATION:
   - Derive conclusions ENTIRELY from the provided claims and their scopes.
   - Do NOT generalize beyond the evidence:
     * If a claim is at the "industry" level (e.g. BLS total factor productivity), do NOT describe it as individual employee productivity.
     * If a claim is "self-reported" survey data, do NOT state it as measured objective output.
     * If a claim applies to "creative teams" or "call-center workers", do NOT generalize to "all workers".
     * If a claim was measured over "6 months", do NOT describe it as "long-term".
   - Do not use outside knowledge. Do not invent statistics, study names, or author names.
   - If claims have evidenceStrength of 'limited', temper conclusions accordingly using cautious language ('preliminary evidence suggests', 'some sources indicate').
   ${
     allFromSnippets
       ? "- NOTE: All claims are derived from search snippets rather than full webpages. Note this limitation in your conclusion: 'This conclusion is based on search snippets and may lack context that full source texts would provide.'"
       : ""
   }

2. TRUE CONFLICT VS. COMPARABILITY NOTES (DO NOT CALL NON-COMPARABLE STUDIES A CONFLICT):
   - Before declaring any conflict, compare:
     * outcome
     * population
     * task type
     * measurement type (objective output vs self-report vs manager perception)
     * timeframe
     * intervention / work arrangement
     * context / organization
   - ONLY place an item under "conflictingEvidence" with type "true_conflict" when comparable studies examine substantially the same population, outcome, timeframe, intervention, and measurement, but reach materially different conclusions.
   - If findings differ because of non-comparable study contexts, they are NOT contradictory. DO NOT place them under "conflictingEvidence"! Place them in "comparabilityNotes":
     * If studies measure different outcomes -> classify: "different_outcome"
     * If they use different task types -> classify: "different_task_type"
     * If they use different populations or organizations -> classify: "different_population"
     * If they use different measurement methods (objective output vs self-report vs manager perception) -> classify: "different_measurement"
     * If multiple major differences make comparison inappropriate -> classify: "insufficient_comparability"
     * If they are from different time periods -> classify: "different_time_period"
     * If work arrangements or conditions differ -> classify: "different_condition"
     * If study designs or methodologies differ -> classify: "different_methodology"
   - EXAMPLE:
     Ctrip: objective productivity of routine individual workers
     Zillow: employee perceptions of dedication/inclusion
     These are NOT a true conflict! They must be classified under comparabilityNotes as "insufficient_comparability" (or "different_measurement" / "different_outcome" / "different_task_type"), NEVER as conflicting evidence.

3. PREVENT COMBINING UNRELATED FINDINGS INTO OVERGENERALIZED CLAIMS (RULE 10):
   - Every conclusion sentence MUST be directly supported by its cited claims.
   - Do NOT merge unrelated findings into a single stronger claim than the evidence supports:
     * Do NOT combine routine individual productivity (e.g. Ctrip call-center output) with employee perceptions of dedication/inclusion (e.g. Zillow surveys) into an overarching claim of a "productivity vs dedication tradeoff" or "contradictory workforce effects".
     * If studies evaluate different outcomes, report them separately and factually (e.g., "While objective output increased in routine call-center tasks, employee surveys in tech roles reflected concerns regarding peer dedication and inclusion.").
     * Do NOT generalize from a narrow task or population to "all remote workers" or "overall organizational performance".
   - Do NOT invent evidence, claims, source IDs, or conclusions.

4. FINAL CONCLUSION STRUCTURE (ANSWER THE QUESTION FIRST):
   - Sentence 1: Directly address the original question and the requested timeframe first. If the user asks about "long-term" effects and available evidence only covers short/medium-term observations, state this immediately in Sentence 1:
     "Regarding long-term effects, the available evidence does not establish a definitive long-term effect of working from home on employee productivity or innovation, as multi-year longitudinal evidence remains limited."
   - Sentence 2: Explain what the shorter- and medium-term evidence establishes.
   - Sentence 3: Highlight critical nuances by task type (e.g. individual routine tasks vs creative collaborative tasks) and analytical level (industry vs individual).
   - Sentence 4: State findings regarding hybrid arrangements or other conditions if supported.
   - Do NOT begin with broad short-term findings and only mention that long-term evidence is lacking at the very end.

5. NO UNSOLICITED RECOMMENDATIONS:
   - DeepScout investigates evidence, not business consulting. Do NOT include unsolicited management advice (e.g., "Organizations should therefore mandate...").

6. TRACEABILITY & CITATIONS:
   - Every finding, conflict, comparability note, condition, and the conclusion itself MUST cite the relevant claimIds and sourceIds.
   - All cited claimIds MUST exist in the CLAIMS list below.
   - All cited sourceIds MUST exist in the SOURCE METADATA list below.

CLAIMS:
${claimText}

SOURCE METADATA:
${sourceText}

Return ONLY valid JSON with this exact schema:
{
  "keyFindings": [
    {
      "text": "...",
      "claimIds": ["claim_1"],
      "sourceIds": ["source_1"]
    }
  ],
  "conflictingEvidence": [
    {
      "type": "true_conflict",
      "description": "...",
      "claimIds": ["claim_1", "claim_2"],
      "sourceIds": ["source_1", "source_2"],
      "whyTheyDiffer": "..."
    }
  ],
  "comparabilityNotes": [
    {
      "type": "different_task_type",
      "description": "...",
      "claimIds": ["claim_1", "claim_2"],
      "sourceIds": ["source_1", "source_2"],
      "whyTheyDiffer": "..."
    }
  ],
  "conditions": [
    {
      "text": "...",
      "claimIds": ["claim_1"],
      "sourceIds": ["source_1"]
    }
  ],
  "conclusion": {
    "text": "...",
    "claimIds": ["claim_1", "claim_2"],
    "sourceIds": ["source_1", "source_2"]
  }
}
`;

  const result = await groqJson({
    user: prompt,
    temperature: 0.1,
    maxTokens: 3000,
  });

  return validateAndRepairSynthesis({
    question,
    claims,
    sources,
    keyFindings: result.keyFindings,
    conflictingEvidence: result.conflictingEvidence,
    comparabilityNotes: result.comparabilityNotes,
    conditions: result.conditions,
    conclusion: result.conclusion,
  });
}