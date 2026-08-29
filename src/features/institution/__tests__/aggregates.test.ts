import { describe, it, expect } from "vitest";
import { validatePrivacyCohort, MINIMUM_COHORT_SIZE } from "../validators";

describe("Campus Aggregates Privacy Invariant", () => {
  it("throws INSUFFICIENT_DATA when cohort size is below the minimum", () => {
    expect(() => validatePrivacyCohort(0)).toThrow("INSUFFICIENT_DATA");
    expect(() => validatePrivacyCohort(MINIMUM_COHORT_SIZE - 1)).toThrow("INSUFFICIENT_DATA");
  });

  it("passes when cohort size is at or above the minimum", () => {
    expect(validatePrivacyCohort(MINIMUM_COHORT_SIZE)).toBe(true);
    expect(validatePrivacyCohort(MINIMUM_COHORT_SIZE + 10)).toBe(true);
  });
});
