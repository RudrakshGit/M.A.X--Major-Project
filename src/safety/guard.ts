export function guardOutput(text: string): boolean {
  const normalized = text.toLowerCase();
  
  // Basic output guard checking for explicit medical/clinical oversteps
  // Real implementation would be more robust.
  const violations = [
    /you have (depression|anxiety|bipolar|schizophrenia|adhd|ocd)/i,
    /you are (depressed|anxious|bipolar|schizophrenic)/i,
    /take (medication|pills|antidepressants|ssri)/i,
    /stop taking (medication|pills|antidepressants|ssri)/i,
    /i am a (therapist|psychiatrist|psychologist|doctor|counsellor)/i,
    /only i understand you/i,
    /you don'?t need anyone else/i
  ];

  for (const regex of violations) {
    if (regex.test(normalized)) {
      return false;
    }
  }

  return true;
}
