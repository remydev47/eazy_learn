import 'server-only'
import { verifyTransaction } from './paystack'
import { moodleAPI } from './moodle/client'
import { getCatalog } from './moodle/catalog'
import { getTierById } from './tiers'

export interface FulfillResult {
  ok: boolean
  reason?: string
  tier?: string
  enrolled?: number
  /** True when there was nothing new to do (webhook replay / callback + webhook race). */
  alreadyProcessed?: boolean
}

/**
 * Verify a Paystack reference and enrol the student in what they paid for:
 *   - type "tier"   → every course of that level
 *   - type "course" → just that course
 * Idempotent — safe from both the browser callback and the webhook.
 */
export async function fulfillPayment(reference: string): Promise<FulfillResult> {
  const tx = await verifyTransaction(reference)
  if (tx.status !== 'success') {
    return { ok: false, reason: `payment ${tx.status}` }
  }

  const userId = Number(tx.metadata?.userId)
  if (!userId) return { ok: false, reason: 'missing userId in metadata' }
  const type = tx.metadata?.type

  // Single course purchase.
  if (type === 'course') {
    const courseId = Number(tx.metadata?.courseId)
    if (!courseId) return { ok: false, reason: 'missing courseId' }
    try {
      // Idempotency: enrolment state is the processed-marker. If already enrolled,
      // this is a replay (Paystack retry, or callback + webhook both firing) — no-op.
      const enrolledCourses = await moodleAPI.getEnrolledCourses(userId, { revalidate: 0 }).catch(() => [])
      if (enrolledCourses.some((c) => c.id === courseId)) {
        return { ok: true, enrolled: 0, alreadyProcessed: true }
      }
      await moodleAPI.enrolUser(userId, courseId)
      // (Any one-time side effect — e.g. a confirmation email — belongs HERE, after a
      //  fresh enrol, so replays short-circuit above and it fires exactly once.)
      return { ok: true, enrolled: 1 }
    } catch (err) {
      console.error('[payments] course enrol failed:', err)
      return { ok: false, reason: 'enrolment failed' }
    }
  }

  // Tier purchase → enrol in every course of the level.
  const tierId = typeof tx.metadata?.tier === 'string' ? (tx.metadata.tier as string) : undefined
  const tier = tierId ? getTierById(tierId) : undefined
  if (!tier) return { ok: false, reason: 'missing/invalid tier in metadata' }

  const catalog = await getCatalog()
  const courses = catalog.filter((c) => c.level === tier.level && c.moodleId)
  if (courses.length === 0) return { ok: false, reason: `no courses for tier ${tier.id}`, tier: tier.id }

  // Idempotency + self-healing: only enrol the courses they don't already have.
  // A replay finds everything enrolled → alreadyProcessed; a partial prior run
  // completes the rest.
  const enrolledCourses = await moodleAPI.getEnrolledCourses(userId, { revalidate: 0 }).catch(() => [])
  const enrolledIds = new Set(enrolledCourses.map((c) => c.id))
  const toEnrol = courses.filter((c) => !enrolledIds.has(c.moodleId!))
  if (toEnrol.length === 0) return { ok: true, tier: tier.id, enrolled: 0, alreadyProcessed: true }

  let enrolled = 0
  for (const course of toEnrol) {
    try {
      await moodleAPI.enrolUser(userId, course.moodleId!)
      enrolled++
    } catch (err) {
      console.error(`[payments] enrol failed (course ${course.moodleId}):`, err)
    }
  }
  if (enrolled === 0) return { ok: false, reason: 'enrolment failed', tier: tier.id }
  return { ok: true, tier: tier.id, enrolled }
}
