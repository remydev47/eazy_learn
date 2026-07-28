import 'server-only'
import { moodleAPI } from './moodle/client'
import type { Level } from './courses'

// Pricing lives in Moodle (a hidden custom profile field on the admin user) so the
// Admin → Pricing page can edit it and it persists. Falls back to these defaults.
const STORE_USER_ID = 2 // Moodle admin user holds the site pricing config
const FIELD = 'pricing_config'

export interface PricingConfig {
  perCourse: Record<Level, number>
  tier: Record<Level, number>
  free: string[] // course slugs that are free
}

export const DEFAULT_PRICING: PricingConfig = {
  perCourse: { Beginner: 1000, Intermediate: 2000, Advanced: 3000 },
  tier: { Beginner: 3000, Intermediate: 7000, Advanced: 10000 },
  free: ['intro-web-development', 'intro-linux-servers', 'intro-aws'],
}

function merge(raw: Partial<PricingConfig> | null): PricingConfig {
  if (!raw) return DEFAULT_PRICING
  return {
    perCourse: { ...DEFAULT_PRICING.perCourse, ...(raw.perCourse ?? {}) },
    tier: { ...DEFAULT_PRICING.tier, ...(raw.tier ?? {}) },
    free: Array.isArray(raw.free) ? raw.free : DEFAULT_PRICING.free,
  }
}

/** Read the current pricing config from Moodle (falls back to defaults on any failure). */
export async function getPricing(): Promise<PricingConfig> {
  try {
    const users = await moodleAPI.getUsersByField('id', [String(STORE_USER_ID)], { revalidate: 30 })
    const field = users[0]?.customfields?.find((f) => f.type === FIELD || f.shortname === FIELD)
    if (field?.value) return merge(JSON.parse(field.value))
  } catch (err) {
    console.error('[pricing] read failed, using defaults:', err)
  }
  return DEFAULT_PRICING
}

/** Persist a new pricing config to Moodle. */
export async function savePricing(config: PricingConfig): Promise<void> {
  await moodleAPI.setUserCustomField(STORE_USER_ID, FIELD, JSON.stringify(config))
}

export const coursePrice = (p: PricingConfig, level: Level) => p.perCourse[level] ?? 0
export const tierPrice = (p: PricingConfig, level: Level) => p.tier[level] ?? 0
export const isFree = (p: PricingConfig, slug: string) => p.free.includes(slug)
