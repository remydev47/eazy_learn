import 'server-only'
import { verifyTransaction } from './paystack'
import { moodleAPI } from './moodle/client'

export interface FulfillResult {
  ok: boolean
  reason?: string
  courseId?: number
  slug?: string
}

/**
 * Verify a Paystack reference and, if the payment succeeded, enrol the student in
 * the Moodle course recorded in the transaction metadata. Idempotent — safe to call
 * from both the browser callback and the webhook (re-enrolling is a Moodle no-op).
 */
export async function fulfillPayment(reference: string): Promise<FulfillResult> {
  const tx = await verifyTransaction(reference)
  if (tx.status !== 'success') {
    return { ok: false, reason: `payment ${tx.status}` }
  }

  const courseId = Number(tx.metadata?.courseId)
  const userId = Number(tx.metadata?.userId)
  const slug = typeof tx.metadata?.slug === 'string' ? (tx.metadata.slug as string) : undefined

  if (!courseId || !userId) {
    return { ok: false, reason: 'missing courseId/userId in metadata' }
  }

  try {
    await moodleAPI.enrolUser(userId, courseId)
  } catch (err) {
    // If the user is already enrolled, Moodle may still return ok; log anything else.
    console.error('[payments] enrolUser failed:', err)
    return { ok: false, reason: 'enrolment failed', courseId, slug }
  }

  return { ok: true, courseId, slug }
}
