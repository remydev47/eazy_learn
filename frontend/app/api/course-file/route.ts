import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const MOODLE_URL = process.env.MOODLE_URL ?? ''
const MOODLE_TOKEN = process.env.MOODLE_TOKEN ?? ''

/**
 * Streams a Moodle file to a logged-in user with the web-service token added
 * server-side (the token is never exposed to the browser). Only proxies URLs on
 * our own Moodle host.
 */
export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return new NextResponse('Unauthorized', { status: 401 })

  const fileUrl = req.nextUrl.searchParams.get('url')
  if (!fileUrl || !fileUrl.startsWith(MOODLE_URL)) {
    return new NextResponse('Bad request', { status: 400 })
  }

  // Use the token-authenticated pluginfile endpoint.
  let target = fileUrl.replace('/pluginfile.php/', '/webservice/pluginfile.php/')
  target += (target.includes('?') ? '&' : '?') + 'token=' + encodeURIComponent(MOODLE_TOKEN)

  const res = await fetch(target, { cache: 'no-store' })
  if (!res.ok) return new NextResponse('Not found', { status: 404 })

  const headers = new Headers()
  headers.set('Content-Type', res.headers.get('Content-Type') ?? 'application/octet-stream')
  // Inline display (not forced download).
  headers.set('Content-Disposition', 'inline')
  headers.set('Cache-Control', 'private, max-age=300')
  return new NextResponse(res.body, { status: 200, headers })
}
