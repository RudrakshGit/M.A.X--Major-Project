export const MINIMUM_COHORT_SIZE = 10;

export function validatePrivacyCohort(count: number) {
  if (count < MINIMUM_COHORT_SIZE) {
    throw new Error("INSUFFICIENT_DATA");
  }
  return true;
}
