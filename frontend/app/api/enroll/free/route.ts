import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getCatalogCourseBySlug } from '@/lib/moodle/catalog'
import { isFreeCourse } from '@/lib/free-courses'
import { moodleAPI } from '@/lib/moodle/client'

export const dynamic = 'force-dynamic'

/** Enrol the logged-in user in a FREE course directly (no payment). */
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
  if (!slug || !isFreeCourse(slug)) {
    return NextResponse.json({ error: 'not_a_free_course' }, { status: 400 })
  }

  const course = await getCatalogCourseBySlug(slug)
  if (!course?.moodleId) return NextResponse.json({ error: 'course_not_found' }, { status: 404 })

  try {
    await moodleAPI.enrolUser(session.user.moodleId, course.moodleId)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[enroll/free]', err)
    return NextResponse.json({ error: 'enrol_failed' }, { status: 502 })
  }
}
