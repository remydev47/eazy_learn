import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getTierById } from '@/lib/tiers'
import { initializeTransaction } from '@/lib/paystack'

export const dynamic = 'force-dynamic'

/**
 * Start a Paystack payment for a TIER (Beginner/Intermediate/Advanced). Paying a tier
 * enrols the student in every course of that level. The price comes from the server-side
 * tier config (never trusted from the client). Requires a logged-in user.
 */
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.moodleId) {
    return NextResponse.json({ error: 'not_authenticated' }, { status: 401 })
  }

  let tierId: string | undefined
  try {
    const body = await req.json()
    tierId = typeof body?.tier === 'string' ? body.tier : undefined
  } catch {
    /* ignore */
  }

  const tier = tierId ? getTierById(tierId) : undefined
  if (!tier) return NextResponse.json({ error: 'invalid_tier' }, { status: 400 })

  const origin = req.nextUrl.origin
  const rawEmail = session.user.email ?? ''
  const email =
    !rawEmail.includes('@') || /\.(local|test|invalid|localhost|example)$/i.test(rawEmail)
      ? `user${session.user.moodleId}@kodeclass.com`
      : rawEmail

  try {
    const tx = await initializeTransaction({
      email,
      amountKes: tier.priceKes,
      callbackUrl: `${origin}/payment/callback`,
      metadata: {
        type: 'tier',
        tier: tier.id,
        userId: session.user.moodleId,
        tierName: tier.name,
      },
    })
    return NextResponse.json({ authorization_url: tx.authorization_url })
  } catch (err) {
    console.error('[payments/initialize]', err)
    return NextResponse.json({ error: 'paystack_init_failed' }, { status: 502 })
  }
}
