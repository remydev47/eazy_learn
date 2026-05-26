// DEMO-ONLY METADATA LOOKUP — move to Moodle custom course fields before launch.
// Pricing, instructor bios, ratings, etc. are not in Moodle's default schema, so
// they're keyed here by course shortname (slug). When the client provides real
// data, drop this file and use Moodle custom fields read through the API.

import type { Level } from "./courses";

export interface CourseMetadata {
  level: Level;
  /** Tier code matches the Moodle category idnumber (tier-beginner/intermediate/advanced). */
  tier: "beginner" | "intermediate" | "advanced";
  priceUsd: number;
  priceKes: number;
  originalPriceUsd: number;
  /** Display category in the existing CourseData shape (used by filters). */
  category: string;
  instructor: {
    name: string;
    title: string;
    initials: string;
    color: string;
    bio: string;
  };
  /** Approx hours derived from sessions × 1.25 hr — also seeded in the course summary. */
  durationHours: number;
  /** Total live sessions. Visible on the card and detail page. */
  totalSessions: number;
  /** Static demo rating until real reviews exist. */
  rating: number;
  reviewCount: number;
  studentCount: string;
  image: string;
}

const TIER_PRICING_USD: Record<CourseMetadata["tier"], { price: number; original: number; priceKes: number }> = {
  beginner:     { price:  79, original: 129, priceKes:  9999 },
  intermediate: { price: 149, original: 249, priceKes: 19999 },
  advanced:     { price: 249, original: 399, priceKes: 32999 },
};

const PLACEHOLDER_INSTRUCTORS = [
  { name: "Brian Otieno",   title: "Senior Engineer",       initials: "BO", color: "bg-blue-500",    bio: "10+ years building production systems. Previously at Andela and Twiga Foods. Loves clean code and clearer thinking." },
  { name: "Sarah Chen",     title: "Staff Software Eng.",   initials: "SC", color: "bg-violet-500",  bio: "Full-stack engineer with a decade at fintech and payments companies. Teaches the production patterns that interviews rarely cover." },
  { name: "Dr. Kwame Nkosi", title: "Cloud Architect",      initials: "KN", color: "bg-emerald-500", bio: "AWS-certified architect who's migrated five enterprises to the cloud. Now teaches the path he wishes he'd taken sooner." },
  { name: "Amina Wanjiku",  title: "Security Researcher",   initials: "AW", color: "bg-amber-500",   bio: "Penetration tester and bug-bounty hunter. Has helped 30+ Kenyan companies secure their applications and ship safer code." },
  { name: "James Mbatha",   title: "ML Engineer",           initials: "JM", color: "bg-rose-500",    bio: "Builds production ML systems at scale. PhD in applied math, focused on making AI accessible to African startups." },
];

const FALLBACK_IMAGES = [
  "/assets/less1.webp",
  "/assets/less2.webp",
  "/assets/less3.webp",
  "/assets/less4.webp",
  "/assets/less5.webp",
  "/assets/less6.webp",
  "/assets/less7.webp",
  "/assets/less8.webp",
  "/assets/less9.webp",
];

// Keyed by course shortname (matches the seed in infra/moodle/seed-full-catalog.sh).
const COURSE_METADATA: Record<string, Pick<CourseMetadata, "tier" | "category" | "totalSessions"> & { instructorIdx: number; imageIdx: number }> = {
  // Beginner
  "intro-web-development":     { tier: "beginner",     category: "Web Dev",         totalSessions: 20, instructorIdx: 1, imageIdx: 1 },
  "intro-computers":           { tier: "beginner",     category: "Foundations",     totalSessions: 14, instructorIdx: 0, imageIdx: 0 },
  "intro-graphics":            { tier: "beginner",     category: "Design",          totalSessions: 15, instructorIdx: 1, imageIdx: 2 },

  // Intermediate
  "intro-apis":                { tier: "intermediate", category: "Web Dev",         totalSessions: 36, instructorIdx: 0, imageIdx: 3 },
  "intro-software-development":{ tier: "intermediate", category: "Programming",     totalSessions: 20, instructorIdx: 1, imageIdx: 4 },
  "intro-linux-servers":       { tier: "intermediate", category: "DevOps",          totalSessions: 22, instructorIdx: 2, imageIdx: 5 },
  "intro-databases":           { tier: "intermediate", category: "Data",            totalSessions: 11, instructorIdx: 0, imageIdx: 6 },
  "intro-python":              { tier: "intermediate", category: "Programming",     totalSessions: 37, instructorIdx: 4, imageIdx: 7 },

  // Advanced
  "intro-project-management":  { tier: "advanced",     category: "Leadership",      totalSessions: 25, instructorIdx: 0, imageIdx: 8 },
  "intro-aws":                 { tier: "advanced",     category: "Cloud",           totalSessions: 35, instructorIdx: 2, imageIdx: 0 },
  "intro-testing":             { tier: "advanced",     category: "Engineering",     totalSessions: 50, instructorIdx: 1, imageIdx: 1 },
  "intro-cybersecurity":       { tier: "advanced",     category: "Security",        totalSessions: 24, instructorIdx: 3, imageIdx: 2 },
  "intro-genai-ml":            { tier: "advanced",     category: "AI / ML",         totalSessions: 45, instructorIdx: 4, imageIdx: 3 },
};

const TIER_LEVEL: Record<CourseMetadata["tier"], Level> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

/** Look up demo metadata for a course by its Moodle shortname.
 *  Returns sensible defaults (intermediate tier, generic instructor) if unknown. */
export function getCourseMetadata(shortname: string): CourseMetadata {
  const meta = COURSE_METADATA[shortname];
  const tier: CourseMetadata["tier"] = meta?.tier ?? "intermediate";
  const sessions = meta?.totalSessions ?? 20;
  const pricing = TIER_PRICING_USD[tier];
  const instructor = PLACEHOLDER_INSTRUCTORS[(meta?.instructorIdx ?? 0) % PLACEHOLDER_INSTRUCTORS.length];
  const image = FALLBACK_IMAGES[(meta?.imageIdx ?? 0) % FALLBACK_IMAGES.length];

  return {
    level: TIER_LEVEL[tier],
    tier,
    priceUsd: pricing.price,
    priceKes: pricing.priceKes,
    originalPriceUsd: pricing.original,
    category: meta?.category ?? "General",
    instructor,
    durationHours: Math.round(sessions * 1.25),
    totalSessions: sessions,
    // Static demo numbers — keep them plausible, not exaggerated.
    rating: 4.7,
    reviewCount: 48,
    studentCount: "120+",
    image,
  };
}

/** All known course shortnames — used to short-circuit unknown slugs at build time. */
export const KNOWN_SHORTNAMES = Object.keys(COURSE_METADATA);
