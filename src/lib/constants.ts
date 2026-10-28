export const YEAR_LEVELS = [1, 2, 3, 4] as const;

export const YEAR_LEVEL_LABELS: Record<number, string> = {
  1: "1st Year",
  2: "2nd Year",
  3: "3rd Year",
  4: "4th Year",
};

export const COURSE_SUGGESTIONS = [
  "BS Information Technology",
  "BS Computer Science",
  "BS Civil Engineering",
  "BS Accountancy",
  "BS Nursing",
  "BS Education",
] as const;

export function yearLevelLabel(year: number): string {
  return YEAR_LEVEL_LABELS[year] ?? `Year ${year}`;
}
