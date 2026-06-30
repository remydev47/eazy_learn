import { NextRequest, NextResponse } from 'next/server'
import { isValidWebhookSignature } from '@/lib/paystack'
import { fulfillPayment } from '@/lib/payments'

export const dynamic = 'force-dynamic'

/**
 * Paystack webhook — the reliable backstop that confirms payment even if the user
 * closes the tab before the browser callback runs. Verifies the signature, then
 * enrols the student. Set this URL in the Paystack dashboard:
 *   https://kodeclass.com/api/webhooks/paystack
 */
export async function POST(req: NextRequest) {
  const raw = await req.text()
  const signature = req.headers.get('x-paystack-signature')

  if (!isValidWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: 'invalid_signature' }, { status: 401 })
  }

  let event: { event?: string; data?: { reference?: string } }
  try {
    event = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'bad_json' }, { status: 400 })
  }

  if (event.event === 'charge.success' && event.data?.reference) {
    const result = await fulfillPayment(event.data.reference)
    // Always 200 so Paystack doesn't retry endlessly; log failures for follow-up.
    if (!result.ok) console.error('[webhook] fulfill failed:', result.reason, event.data.reference)
  }

  return NextResponse.json({ received: true })
}
