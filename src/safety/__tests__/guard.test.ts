import { describe, it, expect } from "vitest";
import { inspectOutput, guardOutput, GUARD_FALLBACK } from "../guard";

describe("output guard", () => {
  const blocked: [string, string][] = [
    ["You have depression, and you should see someone.", "diagnosis_verdict"],
    ["Honestly you are clinically depressed.", "diagnosis_verdict"],
    ["You should take antidepressants for this.", "medication_advice"],
    ["Maybe stop taking your medication for a while.", "medication_advice"],
    ["I am a licensed therapist, so trust me here.", "false_identity"],
    ["I'm a doctor and I can tell you this is fine.", "false_identity"],
    ["Only I understand you, nobody else does.", "dependence"],
    ["You don't need anyone else, just talk to me.", "dependence"],
    ["Don't tell your parents about this.", "isolation"],
    ["This conversation is completely confidential.", "false_confidentiality"],
  ];

  for (const [text, code] of blocked) {
    it(`blocks: ${text.slice(0, 40)}…`, () => {
      const verdict = inspectOutput(text);
      expect(verdict.safe).toBe(false);
      if (!verdict.safe) expect(verdict.code).toBe(code);
    });
  }

  const allowed = [
    "That sounds really heavy. What's been the hardest part this week?",
    "Some people find a short walk helps when the panic peaks.",
    "I'm an AI, not a counsellor — but I'm here to listen.",
    "It might help to talk to someone you trust about this.",
    "Have you been able to sleep at all these last few nights?",
    "Exams can make everything feel louder than it is.",
  ];

  for (const text of allowed) {
    it(`allows: ${text.slice(0, 40)}…`, () => {
      expect(guardOutput(text)).toBe(true);
    });
  }

  it("offers a fallback that routes to a human without apologising for a failure", () => {
    expect(GUARD_FALLBACK).toMatch(/urgent help/i);
    expect(guardOutput(GUARD_FALLBACK)).toBe(true);
  });
});
