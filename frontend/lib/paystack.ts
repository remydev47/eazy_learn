import 'server-only'
import crypto from 'crypto'

const SECRET = process.env.PAYSTACK_SECRET_KEY

if (!SECRET && process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line no-console
  console.warn('[paystack] PAYSTACK_SECRET_KEY missing — payments will fail')
}

const API = 'https://api.paystack.co'

export interface PaystackInitResult {
  authorization_url: string
  access_code: string
  reference: string
}

export interface PaystackVerifyResult {
  status: string // 'success' | 'failed' | ...
  amount: number // in subunit (KES * 100)
  currency: string
  reference: string
  metadata: Record<string, unknown>
  customer: { email: string }
}

/** Initialize a Paystack transaction. amount is in the major unit (KES); we convert to subunit. */
export async function initializeTransaction(params: {
  email: string
  amountKes: number
  callbackUrl: string
  metadata: Record<string, unknown>
}): Promise<PaystackInitResult> {
  const res = await fetch(`${API}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amountKes * 100), // KES -> subunit
      currency: 'KES',
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
    cache: 'no-store',
  })
  const json = await res.json()
  if (!json.status) throw new Error(json.message || 'Paystack initialize failed')
  return json.data
}

/** Verify a transaction by reference. Returns the transaction data (check .status === 'success'). */
export async function verifyTransaction(reference: string): Promise<PaystackVerifyResult> {
  const res = await fetch(`${API}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${SECRET}` },
    cache: 'no-store',
  })
  const json = await res.json()
  if (!json.status) throw new Error(json.message || 'Paystack verify failed')
  return json.data
}

/** Total successful revenue (KES) + transaction count from Paystack. Test-mode figures
 *  until live keys are set. Returns zeros if the call fails so the dashboard still renders. */
export async function getRevenueTotals(): Promise<{ totalKes: number; count: number }> {
  try {
    const res = await fetch(`${API}/transaction/totals`, {
      headers: { Authorization: `Bearer ${SECRET}` },
      cache: 'no-store',
    })
    const json = await res.json()
    if (!json.status) return { totalKes: 0, count: 0 }
    const d = json.data ?? {}
    const byCur: Array<{ currency: string; amount: number }> = d.total_volume_by_currency ?? []
    const kes = byCur.find((c) => c.currency === 'KES')?.amount ?? d.total_volume ?? 0
    return { totalKes: Math.round(kes / 100), count: d.total_transactions ?? 0 }
  } catch {
    return { totalKes: 0, count: 0 }
  }
}

/** Validate a Paystack webhook signature (HMAC SHA512 of the raw body with the secret key). */
export function isValidWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature || !SECRET) return false
  const hash = crypto.createHmac('sha512', SECRET).update(rawBody).digest('hex')
  return hash === signature
}
