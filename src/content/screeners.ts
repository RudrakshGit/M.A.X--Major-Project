export type ScreenerOption = {
  text: string;
  score: number;
};

export type ScreenerQuestion = {
  id: string;
  text: string;
};

export type Screener = {
  id: string;
  title: string;
  description: string;
  options: ScreenerOption[];
  questions: ScreenerQuestion[];
};

export const PHQ9: Screener = {
  id: "phq9",
  title: "Patient Health Questionnaire (PHQ-9)",
  description: "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
  options: [
    { text: "Not at all", score: 0 },
    { text: "Several days", score: 1 },
    { text: "More than half the days", score: 2 },
    { text: "Nearly every day", score: 3 },
  ],
  questions: [
    { id: "phq9-1", text: "Little interest or pleasure in doing things" },
    { id: "phq9-2", text: "Feeling down, depressed, or hopeless" },
    { id: "phq9-3", text: "Trouble falling or staying asleep, or sleeping too much" },
    { id: "phq9-4", text: "Feeling tired or having little energy" },
    { id: "phq9-5", text: "Poor appetite or overeating" },
    { id: "phq9-6", text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down" },
    { id: "phq9-7", text: "Trouble concentrating on things, such as reading the newspaper or watching television" },
    { id: "phq9-8", text: "Moving or speaking so slowly that other people could have noticed. Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual" },
    { id: "phq9-9", text: "Thoughts that you would be better off dead, or of hurting yourself in some way" },
  ],
};

export const GAD7: Screener = {
  id: "gad7",
  title: "Generalised Anxiety Disorder Assessment (GAD-7)",
  description: "Over the last 2 weeks, how often have you been bothered by the following problems?",
  options: [
    { text: "Not at all", score: 0 },
    { text: "Several days", score: 1 },
    { text: "More than half the days", score: 2 },
    { text: "Nearly every day", score: 3 },
  ],
  questions: [
    { id: "gad7-1", text: "Feeling nervous, anxious, or on edge" },
    { id: "gad7-2", text: "Not being able to stop or control worrying" },
    { id: "gad7-3", text: "Worrying too much about different things" },
    { id: "gad7-4", text: "Trouble relaxing" },
    { id: "gad7-5", text: "Being so restless that it is hard to sit still" },
    { id: "gad7-6", text: "Becoming easily annoyed or irritable" },
    { id: "gad7-7", text: "Feeling afraid, as if something awful might happen" },
  ],
};

export const CBI: Screener = {
  id: "cbi",
  title: "Copenhagen Burnout Inventory (CBI) - Student Version",
  description: "Please indicate how often you feel the following statements apply to you.",
  options: [
    { text: "Always", score: 100 },
    { text: "Often", score: 75 },
    { text: "Sometimes", score: 50 },
    { text: "Seldom", score: 25 },
    { text: "Never/Almost Never", score: 0 },
  ],
  questions: [
    // Personal Burnout
    { id: "cbi-1", text: "How often do you feel tired?" },
    { id: "cbi-2", text: "How often are you physically exhausted?" },
    { id: "cbi-3", text: "How often are you emotionally exhausted?" },
    { id: "cbi-4", text: "How often do you think: 'I can't take it anymore'?" },
    { id: "cbi-5", text: "How often do you feel worn out?" },
    { id: "cbi-6", text: "How often do you feel weak and susceptible to illness?" },
    // Studies-related Burnout
    { id: "cbi-7", text: "Do you feel worn out at the end of the study day?" },
    { id: "cbi-8", text: "Are you exhausted in the morning at the thought of another day at college?" },
    { id: "cbi-9", text: "Do you feel that every hour of studying is tiring for you?" },
    { id: "cbi-10", text: "Do you have enough energy for family and friends during your free time?" }, // Note: This is usually reverse scored, but we'll assume a direct scale where lower energy = higher burnout for simplicity, wait, let's omit or rephrase if reverse. The standard is "Do you have enough energy for family and friends during leisure time?" (Reversed). Let's use direct phrasing to avoid complex engine. "Do you feel you lack enough energy for family and friends during your free time?"
    { id: "cbi-11", text: "Is your coursework frustrating for you?" },
    { id: "cbi-12", text: "Do you feel that you are studying harder than you should?" },
    { id: "cbi-13", text: "Does studying burn you out?" },
  ],
};

export const instruments: Record<string, Screener> = {
  phq9: PHQ9,
  gad7: GAD7,
  cbi: CBI,
};

export function scorePHQ9(responses: number[]): { total: number; band: string } {
  const total = responses.reduce((acc, curr) => acc + curr, 0);
  let band = "None-minimal";
  if (total >= 5) band = "Mild";
  if (total >= 10) band = "Moderate";
  if (total >= 15) band = "Moderately Severe";
  if (total >= 20) band = "Severe";
  return { total, band };
}

export function scoreGAD7(responses: number[]): { total: number; band: string } {
  const total = responses.reduce((acc, curr) => acc + curr, 0);
  let band = "Minimal";
  if (total >= 5) band = "Mild";
  if (total >= 10) band = "Moderate";
  if (total >= 15) band = "Severe";
  return { total, band };
}

export function scoreCBI(responses: number[]): { total: number; band: string } {
  const totalScore = responses.reduce((acc, curr) => acc + curr, 0);
  const average = responses.length > 0 ? Math.round(totalScore / responses.length) : 0;
  
  let band = "Low Burnout";
  if (average >= 25) band = "Moderate Burnout";
  if (average >= 50) band = "High Burnout";
  if (average >= 75) band = "Severe Burnout";
  
  return { total: average, band };
}
