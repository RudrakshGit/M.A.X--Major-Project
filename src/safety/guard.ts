/**
 * Output guard. Runs on a fully generated reply before it reaches the student.
 *
 * The rules mirror docs/safety.md. A reply that trips any of them is replaced
 * by GUARD_FALLBACK — it is never delivered and then apologised for.
 */

const VIOLATIONS: { regex: RegExp; code: string }[] = [
  { regex: /\byou (have|are suffering from) (depression|anxiety|bipolar|schizophrenia|adhd|ocd|ptsd)\b/i, code: "diagnosis_verdict" },
  { regex: /\byou are (clinically )?(depressed|anxious|bipolar|schizophrenic|suicidal)\b/i, code: "diagnosis_verdict" },
  { regex: /\b(you should |try |start |stop |quit )?(taking|take) (your )?(medication|pills|antidepressants|ssri|xanax|prozac)\b/i, code: "medication_advice" },
  { regex: /\b(stop|skip|reduce) (taking )?(your )?(medication|pills|antidepressants|ssri)\b/i, code: "medication_advice" },
  { regex: /\bi am a (licensed )?(therapist|psychiatrist|psychologist|doctor|counsell?or|human)\b/i, code: "false_identity" },
  { regex: /\bi'?m a (licensed )?(therapist|psychiatrist|psychologist|doctor|counsell?or|human)\b/i, code: "false_identity" },
  { regex: /\bonly i (understand|get) you\b/i, code: "dependence" },
  { regex: /\byou don'?t need (anyone else|anybody else|other people|friends|family)\b/i, code: "dependence" },
  { regex: /\b(don'?t|do not) (tell|talk to|reach out to|contact) (your )?(friends?|family|parents?|counsell?or|doctor)\b/i, code: "isolation" },
  { regex: /\b(this|our) (conversation|chat) (is|stays|will stay) (completely |totally |fully )?(confidential|private|between us)\b/i, code: "false_confidentiality" },
];

export const GUARD_FALLBACK =
  "I want to be careful with how I answer that, so let me stay on safer ground. " +
  "I'm here to listen — tell me a bit more about what's going on for you right now. " +
  "And if this needs more than I can give, the Urgent help page has free, confidential lines you can call.";

export type GuardResult = { safe: true } | { safe: false; code: string };

/** Returns the first rule a reply breaks, or `{ safe: true }`. */
export function inspectOutput(text: string): GuardResult {
  for (const { regex, code } of VIOLATIONS) {
    if (regex.test(text)) return { safe: false, code };
  }
  return { safe: true };
}

/** Convenience boolean for callers that only need pass/fail. */
export function guardOutput(text: string): boolean {
  return inspectOutput(text).safe;
}
