import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getTierById, getCoursePriceByLevel } from '@/lib/tiers'
import { getCatalogCourseBySlug } from '@/lib/moodle/catalog'
import { initializeTransaction } from '@/lib/paystack'

export const dynamic = 'force-dynamic'

/**
 * Start a Paystack payment for either:
 *   - a TIER (body.tier) → unlocks every course in that level, or
 *   - a single COURSE (body.slug) → unlocks just that course.
 * Prices come from server-side config (never trusted from the client). Requires login.
 */
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.moodleId) {
    return NextResponse.json({ error: 'not_authenticated' }, { status: 401 })
  }

  let body: { tier?: string; slug?: string } = {}
  try {
    body = await req.json()
  } catch {
    /* ignore */
  }

  const origin = req.nextUrl.origin
  const rawEmail = session.user.email ?? ''
  const email =
    !rawEmail.includes('@') || /\.(local|test|invalid|localhost|example)$/i.test(rawEmail)
      ? `user${session.user.moodleId}@kodeclass.com`
      : rawEmail

  let amountKes = 0
  let metadata: Record<string, unknown> = { userId: session.user.moodleId }

  if (body.tier) {
    const tier = getTierById(body.tier)
    if (!tier) return NextResponse.json({ error: 'invalid_tier' }, { status: 400 })
    amountKes = tier.priceKes
    metadata = { ...metadata, type: 'tier', tier: tier.id, tierName: tier.name }
  } else if (body.slug) {
    const course = await getCatalogCourseBySlug(body.slug)
    if (!course?.moodleId) return NextResponse.json({ error: 'course_not_found' }, { status: 404 })
    amountKes = getCoursePriceByLevel(course.level)
    if (amountKes <= 0) return NextResponse.json({ error: 'course_not_purchasable' }, { status: 400 })
    metadata = { ...metadata, type: 'course', courseId: course.moodleId, slug: course.slug, courseTitle: course.title }
  } else {
    return NextResponse.json({ error: 'missing_tier_or_slug' }, { status: 400 })
  }

  try {
    const tx = await initializeTransaction({
      email,
      amountKes,
      callbackUrl: `${origin}/payment/callback`,
      metadata,
    })
    return NextResponse.json({ authorization_url: tx.authorization_url })
  } catch (err) {
    console.error('[payments/initialize]', err)
    return NextResponse.json({ error: 'paystack_init_failed' }, { status: 502 })
  }
}
