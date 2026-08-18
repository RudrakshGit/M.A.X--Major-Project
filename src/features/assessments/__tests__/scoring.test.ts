import { describe, it, expect } from "vitest";
import { scorePHQ9, scoreGAD7, scoreCBI } from "../../../content/screeners";

describe("PHQ-9 Scoring", () => {
  it("scores minimal depression correctly", () => {
    const responses = [0, 0, 1, 0, 1, 0, 0, 0, 0]; // 2
    const result = scorePHQ9(responses);
    expect(result.total).toBe(2);
    expect(result.band).toBe("None-minimal");
  });

  it("scores mild depression correctly", () => {
    const responses = [1, 1, 1, 1, 1, 0, 0, 0, 0]; // 5
    const result = scorePHQ9(responses);
    expect(result.total).toBe(5);
    expect(result.band).toBe("Mild");
  });

  it("scores severe depression correctly", () => {
    const responses = [3, 3, 3, 3, 3, 3, 2, 0, 0]; // 20
    const result = scorePHQ9(responses);
    expect(result.total).toBe(20);
    expect(result.band).toBe("Severe");
  });
});

describe("GAD-7 Scoring", () => {
  it("scores minimal anxiety correctly", () => {
    const responses = [1, 0, 1, 0, 1, 0, 0]; // 3
    const result = scoreGAD7(responses);
    expect(result.total).toBe(3);
    expect(result.band).toBe("Minimal");
  });

  it("scores severe anxiety correctly", () => {
    const responses = [3, 3, 3, 3, 2, 2, 3]; // 19
    const result = scoreGAD7(responses);
    expect(result.total).toBe(19);
    expect(result.band).toBe("Severe");
  });
});

describe("CBI Scoring", () => {
  it("scores low burnout correctly", () => {
    // 13 questions
    const responses = [0, 0, 25, 0, 0, 25, 0, 0, 0, 25, 0, 0, 0];
    const result = scoreCBI(responses);
    expect(result.total).toBeLessThan(25);
    expect(result.band).toBe("Low Burnout");
  });

  it("scores severe burnout correctly", () => {
    // 13 questions, all 100
    const responses = Array(13).fill(100);
    const result = scoreCBI(responses);
    expect(result.total).toBe(100);
    expect(result.band).toBe("Severe Burnout");
  });
});
