import { describe, it, expect } from "vitest";
import {
  classifyRisk,
  RiskLevelSchema,
  ClassificationResultSchema,
  type RiskLevel,
} from "../classifier";
import goldenCases from "./golden.json";

interface TestCase {
  message: string;
  expectedLevel: RiskLevel;
  reason: string;
}

describe("Safety Risk Classifier (Deterministic)", () => {
  it("has at least 40 cases in the golden test suite", () => {
    expect(goldenCases.length).toBeGreaterThanOrEqual(40);
  });

  it("handles empty or whitespace-only messages gracefully", () => {
    const res = classifyRisk("   ");
    expect(res.level).toBe("none");
    expect(res.deterministic).toBe(true);
    expect(ClassificationResultSchema.safeParse(res).success).toBe(true);
  });

  describe("Golden Test Suite Evaluation", () => {
    (goldenCases as TestCase[]).forEach(({ message, expectedLevel, reason }) => {
      it(`evaluates [${expectedLevel.toUpperCase()}]: "${message.slice(0, 45)}..."`, () => {
        const result = classifyRisk(message);
        
        // Assert schema validity
        const parseCheck = ClassificationResultSchema.safeParse(result);
        expect(parseCheck.success).toBe(true);
        expect(RiskLevelSchema.safeParse(result.level).success).toBe(true);

        // Assert deterministic flag is always true
        expect(result.deterministic).toBe(true);

        // Assert level matches golden expectation
        expect(
          result.level,
          `Failed for case: "${message}". Reason: ${reason}. Expected: ${expectedLevel}, Received: ${result.level} (classifier reason: ${result.reason})`
        ).toBe(expectedLevel);
      });
    });
  });
});
