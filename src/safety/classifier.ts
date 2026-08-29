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


// ---------------------------------------------------------------------------
// Hindi and romanised Hinglish
//
// Most of our users write Hinglish. English-only detection would miss them
// entirely, so these carry the same weight as the English rules above.
// Transliteration is inconsistent in practice (hu/hun/hoon, nahi/nahin/nhi,
// dunga/doonga), so every pattern accepts the common spellings.
// ---------------------------------------------------------------------------

const HINGLISH_HARD_NEGATIVE_PATTERNS: RegExp[] = [
  // "exam ne maar dala", "paper ne maar diya" — idiom, not intent.
  /\b(exam|paper|test|assignment|padhai|kaam|garmi|sardi|bhook|bhookh|thakan)\s+(ne\s+)?(maar|mar)\s+(dala|diya|dia)\b/i,
  /\b(hans|hass)(\s+hans)?\s+ke\s+mar\s+(gaya|gayi|raha)\b/i,
  /\bhas(i|ee)\s+se\s+mar\b/i,
  /\b(thak|bhook|bhookh|garmi|sardi|bore)\s*(ke|se)\s+mar\s+raha\b/i,
];

const HINGLISH_CRISIS_PATTERNS: PatternRule[] = [
  {
    regex: /\bj(ee|i)(ne|na)\s+k[ai]\s+man+\s+(nahi|nahin|nai|nhi)/i,
    reason: "Hinglish: no will to live",
  },
  {
    regex: /\bmujhe\s+j(ee|i)na\s+(nahi|nahin|nai|nhi)|\bab\s+(nahi|nahin|nai|nhi)\s+j(ee|i)na\b/i,
    reason: "Hinglish: does not want to live",
  },
  {
    regex: /\b(marna|mar\s*ja(na|ana))\s+chah(ta|ti|ata)/i,
    reason: "Hinglish: wish to die",
  },
  {
    regex: /\b(khatam|khatm|khtm)\s+kar\s+(dun|lun|doon|loon)/i,
    reason: "Hinglish: intent to end it",
  },
  {
    regex: /\bkhud\s+ko\s+(maar|mar|khatam|khatm|nuksan|nuqsan|hurt|chot)/i,
    reason: "Hinglish: intent to harm or kill self",
  },
  {
    regex: /\bjaan\s+(de\s+(dun|dungi|doon)|dena|le\s+lun)/i,
    reason: "Hinglish: intent to give up life",
  },
  {
    regex: /\b(aa?tm[ah]?hatya|khud\s*kushi)\b/i,
    reason: "Hinglish: suicide (atmahatya / khudkushi)",
  },
  {
    regex: /\bsuicide\s+kar\s+(lun|dun|loon|doon)/i,
    reason: "Hinglish: stated suicide intent",
  },
  {
    regex: /\b(zindagi|zindgi|jindagi)\s+(khatam|khatm)\b/i,
    reason: "Hinglish: life is over",
  },
  {
    regex: /\bj(ee|i)ne\s+ka\s+koi\s+(matlab|faida|fayda|maksad|maqsad)\s+(nahi|nahin|nai|nhi)/i,
    reason: "Hinglish: no reason to live",
  },
  {
    regex: /\b(nas|nass|haath|hath)\s+kaa?t|ph(aa|a)nsi|\b(zeher|zahar|jeher)\s+kha|\bse\s+k(oo|u)d\s*(jaun|jaunga|ke)/i,
    reason: "Hinglish: specific method of self-harm",
  },
  {
    regex: /\bsab\s*(pe|par|ko)\s+bojh\s+(hu|hun|hoon|ban)/i,
    reason: "Hinglish: sees self as a burden",
  },
  {
    regex: /\bmar\s+jaa?un?\s+t[oa]\s+(accha|acha|behtar|better)/i,
    reason: "Hinglish: better off dead",
  },
  // Devanagari
  {
    regex: /(मरना|मर\s*जाना)\s*चाह|जीने\s+का\s+मन\s+नहीं|मुझे\s+जीना\s+नहीं|अब\s+नहीं\s+जीना/,
    reason: "Hindi: no will to live",
  },
  {
    regex: /(आत्महत्या|खुदकुशी)/,
    reason: "Hindi: suicide",
  },
  {
    regex: /(खत्म\s+कर\s+(दूंगा|लूंगा|दूँगी)|खुद\s+को\s+(मार|खत्म|नुकसान)|जान\s+दे\s+दूंगा)/,
    reason: "Hindi: intent to end life or self-harm",
  },
  {
    regex: /(ज़िंदगी|जिंदगी)\s+खत्म/,
    reason: "Hindi: life is over",
  },
];

const HINGLISH_DISTRESS_PATTERNS: PatternRule[] = [
  {
    regex: /\b(ghabrahat|ghabra\s*raha|ghabra\s*rahi|panic\s+ho\s+raha)/i,
    reason: "Hinglish: panic or acute anxiety",
  },
  {
    regex: /\b(rona\s+aa?\s+raha|ro\s+raha\s+(hu|hun|hoon)|rote\s+rehta)/i,
    reason: "Hinglish: persistent crying",
  },
  {
    regex: /\b(kuch\s+(accha|acha)\s+(nahi|nahin|nhi)\s+lag|man+\s+(nahi|nahin|nhi)\s+lag)/i,
    reason: "Hinglish: pervasive low mood or anhedonia",
  },
  {
    regex: /\b(himmat|bardaas?ht|bardasht)\s+(nahi|nahin|nhi)/i,
    reason: "Hinglish: at breaking point",
  },
  {
    regex: /\b(toot|tut)\s+(gaya|gayi|chuka)\b/i,
    reason: "Hinglish: feeling broken",
  },
  {
    regex: /\b(akela|akeli|akelapan|tanha)\b/i,
    reason: "Hinglish: loneliness",
  },
  {
    regex: /\b(bekaar|bekar|kisi\s+kaam\s+ka\s+(nahi|nahin|nhi))\s*(hu|hun|hoon)?/i,
    reason: "Hinglish: worthlessness",
  },
  {
    regex: /\b(umeed|ummid|ummeed)\s+(nahi|nahin|nhi)|\bghutan\b/i,
    reason: "Hinglish: hopelessness or suffocation",
  },
  {
    regex: /\b(neend|nind)\s+(nahi|nahin|nhi)\s+aa/i,
    reason: "Hinglish: insomnia",
  },
  // Devanagari
  {
    regex: /(घबराहट|रोना\s+आ\s+रहा|मन\s+नहीं\s+लग|अकेला|अकेली|हिम्मत\s+नहीं|बर्दाश्त\s+नहीं|उम्मीद\s+नहीं|नींद\s+नहीं)/,
    reason: "Hindi: acute distress",
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
  for (const pattern of [...HARD_NEGATIVE_PATTERNS, ...HINGLISH_HARD_NEGATIVE_PATTERNS]) {
    if (pattern.test(cleanedMessage)) {
      hasHardNegative = true;
      // Mask out the matched idiom to avoid false positive triggers in later rules
      cleanedMessage = cleanedMessage.replace(pattern, " [IDIOM] ");
    }
  }

  // 2. Check for Crisis Patterns
  for (const rule of [...CRISIS_PATTERNS, ...HINGLISH_CRISIS_PATTERNS]) {
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
  for (const rule of [...DISTRESS_PATTERNS, ...HINGLISH_DISTRESS_PATTERNS]) {
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
