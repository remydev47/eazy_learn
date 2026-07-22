// Courses that are FREE to enrol in (no tier purchase needed). Edit this set to
// change which courses are free. Everything else is unlocked by buying its tier.
// One free course per tier for testing the learner flow end-to-end.
export const FREE_COURSES = new Set<string>([
  "intro-web-development", // Beginner
  "intro-linux-servers", // Intermediate
  "intro-aws", // Advanced
]);

export function isFreeCourse(slug: string): boolean {
  return FREE_COURSES.has(slug);
}
