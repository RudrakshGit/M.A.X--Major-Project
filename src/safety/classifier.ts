import { z } from "zod";

export const RiskLevelSchema = z.enum(["none", "distress", "crisis"]);
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

export const ClassificationResultSchema = z.object({
  level: RiskLevelSchema,
  reason: z.string().optional(),
  deterministic: z.boolean(),
});
export type ClassificationResult = z.infer<typeof ClassificationResultSchema>;

interface PatternRule {
  regex: RegExp;
  reason: string;
}

// Idioms and non-literal expressions that should not trigger crisis classification
const HARD_NEGATIVE_PATTERNS: RegExp[] = [
  /\b(assignment|homework|exam|test|job|work|code|bug|headache|feet|shoes|back|traffic|noise|heat|cold|sun|boss|teacher|professor|schedule|deadlines?)\s+(is|are|was|were)\s+killing\s+me\b/i,
  /\b(you'?re|you\s+are)\s+killing\s+me\b/i,
  /\b(kill|killing)\s+(some\s+)?time\b/i,
  /\bdied\s+(laughing|of\s+laughter|from\s+laughing)\b/i,
  /\bdying\s+(laughing|of\s+laughter|from\s+laughing|to\s+see|to\s+know|to\s+hear)\b/i,
  /\b(dead\s+tired|dead\s+serious|dead\s+giveaway|dead\s+end|dead\s+on)\b/i,
  /\b(to\s+die\s+for)\b/i,
  /\b(killer\s+(presentation|party|outfit|beat|app|move|joke|workout))\b/i,
  /\b(suicide\s+(squad|doors?|pass|grip|run|sprint))\b/i,
  /\bover\s+my\s+dead\s+body\b/i,
  /\bbored\s+to\s+death\b/i,
];

// Patterns indicating immediate risk to life, suicidal ideation, or severe self-harm
const CRISIS_PATTERNS: PatternRule[] = [
  {
    regex: /\b(kill|end)\s+(my\s*self|my\s+own\s+life|my\s+life)\b/i,
    reason: "Explicit statement of intent to kill self",
  },
  {
    regex: /\b(want|wish|planning|going|ready)\s+to\s+die\b/i,
    reason: "Expressed desire or plan to die",
  },
  {
    regex: /\b(better\s+off\s+dead|don'?t\s+want\s+to\s+(live|wake\s+up|exist)\s*(anymore)?)\b/i,
    reason: "Passive or active suicidal ideation",
  },
  {
    regex: /\b(commit(ting)?\s+suicide|attempt(ing)?\s+suicide|thinking\s+about\s+suicide|considering\s+suicide)\b/i,
    reason: "Direct mention of suicide",
  },
  {
    regex: /\b(end\s+it\s+all|take\s+my\s+(own\s+)?life)\b/i,
    reason: "Intent to end life",
  },
  {
    regex: /\b(hang\s+myself|shoot\s+myself|drown\s+myself|slit\s+my\s+(wrists?|throat)|cut\s+my\s+wrists?)\b/i,
    reason: "Specific method of suicide or lethal self-harm",
  },
  {
    regex: /\b(overdose|swallow\s+(a\s+bunch\s+of\s+|all\s+my\s+)?pills)\s+(to\s+die|on\s+purpose|and\s+end)\b/i,
    reason: "Overdose intent",
  },
  {
    regex: /\bjump(ing)?\s+off\s+(a\s+|the\s+)?(bridge|building|roof|cliff|balcony)\b/i,
    reason: "Lethal jump intent",
  },
  {
    regex: /\b(goodbye\s+note|suicide\s+note|saying\s+my\s+last\s+goodbyes|wrote\s+a\s+note\s+to\s+my\s+family)\b/i,
    reason: "Suicide preparation / note",
  },
  {
    regex: /\b(no\s+reason\s+to\s+live|give\s+away\s+all\s+my\s+(things|belongings)\s+before\s+i\s+go)\b/i,
    reason: "Loss of will to live / final preparations",
  },
  {
    regex: /\b(self[-\s]?harm|cutting\s+myself|burning\s+myself|hurt(ing)?\s+myself)\b/i,
    reason: "Direct self-harm mention",
  },
  {
    regex: /\b(suicide|suicidal)\b/i,
    reason: "General suicide keyword presence",
  },
];

// Patterns indicating acute emotional distress, panic, grief, or severe burnout without immediate lethal intent
const DISTRESS_PATTERNS: PatternRule[] = [
  {
    regex: /\b(panic\s+attack|anxiety\s+attack|hyperventilating)\b/i,
    reason: "Panic or acute anxiety episode",
  },
  {
    regex: /\b(mental\s+breakdown|emotional\s+breakdown|having\s+a\s+breakdown|falling\s+apart)\b/i,
    reason: "Breakdown or crisis of coping",
  },
  {
    regex: /\b(can'?t\s+stop\s+crying|crying\s+all\s+day|crying\s+for\s+hours|sobbing\s+uncontrollably)\b/i,
    reason: "Severe emotional distress / crying",
  },
  {
    regex: /\b(can'?t\s+(take|handle|bear|do)\s+this\s+anymore|at\s+my\s+breaking\s+point)\b/i,
    reason: "Overwhelmed / breaking point",
  },
  {
    regex: /\b(feel(ing)?\s+(completely\s+|totally\s+|so\s+)?(hopeless|worthless|empty|trapped|despair)|hopeless|worthless)\b/i,
    reason: "Pronounced feelings of hopelessness or worthlessness",
  },
  {
    regex: /\b((extreme|severe|intense)\s+(depression|anxiety|burnout|stress)|(extremely|severely|intensely)\s+(depressed|anxious|stressed))\b/i,
    reason: "High-intensity distress symptoms",
  },
  {
    regex: /\b(grief|grieving|lost\s+a\s+loved\s+one|mourning)\b/i,
    reason: "Acute grief",
  },
  {
    regex: /\b(scared\s+to\s+death|terrified\s+and\s+alone|can'?t\s+cope|despair)\b/i,
    reason: "Intense fear or inability to cope",
  },
];

/**
 * Deterministically classifies a text message into one of three risk levels:
 * - `crisis`: Imminent danger to life or intentional self-harm (model bypassed in product).
 * - `distress`: Acute suffering requiring grounded response and resource support.
 * - `none`: General conversation, mild stress, or harmless idioms.
 */
export function classifyRisk(rawMessage: string): ClassificationResult {
  const message = rawMessage.trim();
  if (!message) {
    return {
      level: "none",
      reason: "Empty message",
      deterministic: true,
    };
  }

  // 1. Check for Hard Negatives first
  let cleanedMessage = message;
  let hasHardNegative = false;
  for (const pattern of HARD_NEGATIVE_PATTERNS) {
    if (pattern.test(cleanedMessage)) {
      hasHardNegative = true;
      // Mask out the matched idiom to avoid false positive triggers in later rules
      cleanedMessage = cleanedMessage.replace(pattern, " [IDIOM] ");
    }
  }

  // 2. Check for Crisis Patterns
  for (const rule of CRISIS_PATTERNS) {
    if (rule.regex.test(cleanedMessage)) {
      return {
        level: "crisis",
        reason: rule.reason,
        deterministic: true,
      };
    }
  }

  // If a hard negative was matched and no explicit crisis intent was found elsewhere in the sentence,
  // check if there are remaining distress indicators.
  // 3. Check for Distress Patterns
  for (const rule of DISTRESS_PATTERNS) {
    if (rule.regex.test(cleanedMessage)) {
      return {
        level: "distress",
        reason: rule.reason,
        deterministic: true,
      };
    }
  }

  return {
    level: "none",
    reason: hasHardNegative ? "Recognized harmless idiom/expression" : "No safety risk detected",
    deterministic: true,
  };
}
