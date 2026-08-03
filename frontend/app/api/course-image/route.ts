import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const MOODLE_URL = process.env.MOODLE_URL ?? ''
const MOODLE_TOKEN = process.env.MOODLE_TOKEN ?? ''

/**
 * PUBLIC proxy for course card thumbnails (Moodle course "overview" images).
 *
 * Unlike /api/course-file (which is login-gated for private content), catalog
 * thumbnails must load for logged-out visitors. To keep this safe it is locked to
 * the `course/overviewfiles` filearea only — it can NOT be used to pull private,
 * token-gated content files (videos, PDFs) even though it adds the WS token. It also
 * refuses to stream anything whose content-type isn't an image.
 */
export async function GET(req: NextRequest) {
  const fileUrl = req.nextUrl.searchParams.get('url')
  if (
    !fileUrl ||
    !fileUrl.startsWith(MOODLE_URL) ||
    !fileUrl.includes('/course/overviewfiles/')
  ) {
    return new NextResponse('Bad request', { status: 400 })
  }

  // Only rewrite to the token endpoint when Moodle hasn't already — avoids a broken
  // /webservice/webservice/ path.
  let target = fileUrl.includes('/webservice/pluginfile.php/')
    ? fileUrl
    : fileUrl.replace('/pluginfile.php/', '/webservice/pluginfile.php/')
  target += (target.includes('?') ? '&' : '?') + 'token=' + encodeURIComponent(MOODLE_TOKEN)

  const res = await fetch(target, { cache: 'no-store' })
  if (!res.ok) return new NextResponse('Not found', { status: 404 })

  const contentType = res.headers.get('Content-Type') ?? ''
  if (!contentType.startsWith('image/')) return new NextResponse('Forbidden', { status: 403 })

  const headers = new Headers()
  headers.set('Content-Type', contentType)
  // Public marketing image — safe to cache on the CDN/browser.
  headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400')
  return new NextResponse(res.body, { status: 200, headers })
}
