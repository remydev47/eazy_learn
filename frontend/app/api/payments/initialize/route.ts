import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getCatalogCourseBySlug } from '@/lib/moodle/catalog'
import { initializeTransaction } from '@/lib/paystack'

export const dynamic = 'force-dynamic'

/**
 * Start a Paystack payment for a course. The price and Moodle course id are looked
 * up server-side from the slug (never trusted from the client). Requires a logged-in
 * user (their Moodle id + email come from the session).
 */
export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.moodleId) {
    return NextResponse.json({ error: 'not_authenticated' }, { status: 401 })
  }

  let slug: string | undefined
  try {
    const body = await req.json()
    slug = typeof body?.slug === 'string' ? body.slug : undefined
  } catch {
    /* ignore */
  }
  if (!slug) return NextResponse.json({ error: 'missing_slug' }, { status: 400 })

  const course = await getCatalogCourseBySlug(slug)
  if (!course || !course.moodleId) {
    return NextResponse.json({ error: 'course_not_found' }, { status: 404 })
  }
  if (!course.price || course.price <= 0) {
    return NextResponse.json({ error: 'course_not_purchasable' }, { status: 400 })
  }

  const origin = req.nextUrl.origin
  const email = session.user.email ?? `user${session.user.moodleId}@kodeclass.com`

  try {
    const tx = await initializeTransaction({
      email,
      amountKes: course.price,
      callbackUrl: `${origin}/payment/callback`,
      metadata: {
        courseId: course.moodleId,
        userId: session.user.moodleId,
        slug: course.slug,
        courseTitle: course.title,
      },
    })
    return NextResponse.json({ authorization_url: tx.authorization_url })
  } catch (err) {
    console.error('[payments/initialize]', err)
    return NextResponse.json({ error: 'paystack_init_failed' }, { status: 502 })
  }
}
