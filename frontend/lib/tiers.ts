import type { Level } from "./courses";

export type TierId = "beginner" | "intermediate" | "advanced";

export interface TierPlan {
  id: TierId;
  name: string;
  level: Level; // matches CourseData.level
  priceKes: number; // TIER price — buys every course in this level
  coursePriceKes: number; // price of a SINGLE course in this level
  tagline: string;
  highlight?: boolean;
}

/**
 * Single source of truth for tier/batch pricing. Buying a tier enrols the student
 * in EVERY course of that level. Prices are charged server-side from here, so the
 * client can never tamper with the amount. (Editing prices = change here + redeploy;
 * a backend admin UI for prices is a future enhancement.)
 */
export const TIERS: TierPlan[] = [
  {
    id: "beginner",
    name: "Beginner",
    level: "Beginner",
    priceKes: 3000,
    coursePriceKes: 1000,
    tagline: "Access to all Beginner courses.",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    level: "Intermediate",
    priceKes: 7000,
    coursePriceKes: 2000,
    tagline: "Access to all Intermediate courses.",
    highlight: true,
  },
  {
    id: "advanced",
    name: "Advanced",
    level: "Advanced",
    priceKes: 10000,
    coursePriceKes: 3000,
    tagline: "Access to all Advanced courses.",
  },
];

export function getTierById(id: string): TierPlan | undefined {
  return TIERS.find((t) => t.id === id);
}

/** Map a course's Level to its tier plan (for the "buy this tier" CTA on a course page). */
export function getTierByLevel(level: Level): TierPlan | undefined {
  return TIERS.find((t) => t.level === level);
}

/** Single-course price for a given level (0 if unknown). */
export function getCoursePriceByLevel(level: Level): number {
  return getTierByLevel(level)?.coursePriceKes ?? 0;
}
