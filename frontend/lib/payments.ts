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
}

/**
 * Verify a Paystack reference and, if the payment succeeded, enrol the student in
 * EVERY course of the purchased tier's level. Idempotent — safe to call from both the
 * browser callback and the webhook (re-enrolling is a Moodle no-op).
 */
export async function fulfillPayment(reference: string): Promise<FulfillResult> {
  const tx = await verifyTransaction(reference)
  if (tx.status !== 'success') {
    return { ok: false, reason: `payment ${tx.status}` }
  }

  const tierId = typeof tx.metadata?.tier === 'string' ? (tx.metadata.tier as string) : undefined
  const userId = Number(tx.metadata?.userId)
  const tier = tierId ? getTierById(tierId) : undefined

  if (!tier || !userId) {
    return { ok: false, reason: 'missing tier/userId in metadata' }
  }

  // Enrol the student in every course of that level.
  const catalog = await getCatalog()
  const courses = catalog.filter((c) => c.level === tier.level && c.moodleId)
  if (courses.length === 0) {
    return { ok: false, reason: `no courses found for tier ${tier.id}`, tier: tier.id }
  }

  let enrolled = 0
  for (const course of courses) {
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
