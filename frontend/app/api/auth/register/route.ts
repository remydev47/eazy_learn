import { NextRequest, NextResponse } from 'next/server'
import { moodleAPI, MoodleAPIError } from '@/lib/moodle/client'

export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Headless signup: creates a Moodle user via the API (confirmed, manual auth) so the
 * student never touches Moodle's UI. The email doubles as the username. After this
 * succeeds the client signs them in via NextAuth and lands on /dashboard/student.
 */
export async function POST(req: NextRequest) {
  let body: { firstname?: string; lastname?: string; email?: string; password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }

  const firstname = body.firstname?.trim()
  const lastname = body.lastname?.trim()
  const email = body.email?.trim().toLowerCase()
  const password = body.password ?? ''

  if (!firstname || !lastname || !email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please provide your name and a valid email.' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  // Reject duplicates up front for a friendly message (Moodle would also reject).
  try {
    const existing = await moodleAPI.getUsersByField('email', [email])
    if (existing.length) {
      return NextResponse.json({ error: 'An account with that email already exists. Try logging in.' }, { status: 409 })
    }
  } catch {
    /* non-fatal — fall through to create, which will also enforce uniqueness */
  }

  try {
    const [created] = await moodleAPI.createUser({
      username: email, // email-as-username (extendedusernamechars enabled in Moodle)
      password,
      firstname,
      lastname,
      email,
    })
    // Return the username so the client can sign in with the exact value.
    return NextResponse.json({ ok: true, username: created.username })
  } catch (err) {
    if (err instanceof MoodleAPIError) {
      // Surface Moodle's password-policy / duplicate messages to the user.
      const msg = /password/i.test(err.message)
        ? 'Password is too weak — use 8+ characters with a mix of letters, numbers, and a symbol.'
        : /exist|already/i.test(err.message)
          ? 'An account with that email already exists. Try logging in.'
          : 'Could not create your account. Please try again.'
      return NextResponse.json({ error: msg }, { status: 400 })
    }
    console.error('[auth/register]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
