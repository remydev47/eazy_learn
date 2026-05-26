import { NextResponse } from 'next/server'
import { moodleAPI, MoodleAPIError } from '@/lib/moodle/client'

/**
 * Smoke test for Moodle connectivity. Hit GET /api/moodle/ping once envs are set.
 * Returns sitename + release on success, or the Moodle error on failure.
 *
 * Remove this route once dashboards are wired.
 */
export async function GET() {
  try {
    const info = await moodleAPI.getSiteInfo({ revalidate: 0 })
    return NextResponse.json({
      ok: true,
      sitename: info.sitename,
      release: info.release,
      username: info.username,
      siteurl: info.siteurl,
      userissiteadmin: info.userissiteadmin,
      functionsAvailable: info.functions.length,
    })
  } catch (err) {
    if (err instanceof MoodleAPIError) {
      return NextResponse.json(
        { ok: false, errorcode: err.errorcode, message: err.message, debuginfo: err.debuginfo },
        { status: 502 },
      )
    }
    const message = err instanceof Error ? err.message : 'unknown error'
    return NextResponse.json({ ok: false, message }, { status: 500 })
  }
}
