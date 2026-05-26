import 'server-only'
import { moodleAPI } from './client'
import type { MoodleUser, UserRole } from './types'

const MOODLE_URL = process.env.MOODLE_URL
const MOODLE_AUTH_SERVICE = process.env.MOODLE_AUTH_SERVICE || 'moodle_mobile_app'

interface TokenResponse {
  token?: string
  privatetoken?: string
  error?: string
  errorcode?: string
  stacktrace?: string
}

/**
 * Validate user credentials against Moodle's login/token.php endpoint.
 * Returns the user's token + Moodle user record on success, null on bad credentials.
 *
 * Note: this token is per-user and short-lived. We don't store it — we just use it
 * to confirm the credentials are valid, then resolve the user via the service token.
 */
export async function authenticateWithMoodle(
  username: string,
  password: string,
): Promise<{ user: MoodleUser; role: UserRole } | null> {
  const params = new URLSearchParams({
    username,
    password,
    service: MOODLE_AUTH_SERVICE,
  })

  const res = await fetch(`${MOODLE_URL}/login/token.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
    cache: 'no-store',
  })

  if (!res.ok) return null
  const data = (await res.json()) as TokenResponse
  if (!data.token) return null

  // 1. Look up the user record via our admin service token (needed for fullname/email).
  const users = await moodleAPI.getUsersByField('username', [username])
  if (!users.length) return null
  const user = users[0]

  // 2. Resolve role. The user record returned by core_user_get_users_by_field has
  //    no `roles` field, so we have to do it via two side-channels: the user's own
  //    siteinfo (for `userissiteadmin`), and the course roster (for editingteacher).
  const role = await resolveSystemRole(user.id, data.token)
  return { user, role }
}

interface UserSiteInfo {
  userid: number
  userissiteadmin: boolean
}

interface EnrolledUserWithRoles {
  id: number
  roles?: Array<{ shortname: string }>
}

/**
 * Determine the user's app-level role.
 *
 * Moodle does not expose site-wide role assignments via any out-of-the-box
 * `core_user_*` web service. We work around this with two reads:
 *   1. Call `core_webservice_get_site_info` with the USER's own freshly-issued
 *      token. The response has `userissiteadmin` → admin if true.
 *   2. Otherwise list the user's enrolled courses (admin token) and check the
 *      first few course rosters; if they hold editingteacher/teacher anywhere,
 *      they're an instructor.
 *
 * Both lookups are best-effort; on failure we fall through to `student` so the
 * user can still log in.
 */
async function resolveSystemRole(userId: number, userToken: string): Promise<UserRole> {
  try {
    const url = new URL(`${MOODLE_URL}/webservice/rest/server.php`)
    url.searchParams.set('wstoken', userToken)
    url.searchParams.set('wsfunction', 'core_webservice_get_site_info')
    url.searchParams.set('moodlewsrestformat', 'json')
    const res = await fetch(url.toString(), { cache: 'no-store' })
    if (res.ok) {
      const info = (await res.json()) as UserSiteInfo
      if (info.userissiteadmin) return 'admin'
    }
  } catch {
    // fall through
  }

  try {
    const courses = await moodleAPI.getEnrolledCourses(userId, { revalidate: 0 })
    for (const course of courses.slice(0, 5)) {
      const url = new URL(`${MOODLE_URL}/webservice/rest/server.php`)
      url.searchParams.set('wstoken', process.env.MOODLE_TOKEN!)
      url.searchParams.set('wsfunction', 'core_enrol_get_enrolled_users')
      url.searchParams.set('moodlewsrestformat', 'json')
      url.searchParams.set('courseid', String(course.id))
      const res = await fetch(url.toString(), { cache: 'no-store' })
      if (!res.ok) continue
      const roster = (await res.json()) as EnrolledUserWithRoles[]
      const me = roster.find((u) => u.id === userId)
      if (!me?.roles) continue
      const shortnames = me.roles.map((r) => r.shortname.toLowerCase())
      if (shortnames.includes('editingteacher') || shortnames.includes('teacher')) {
        return 'instructor'
      }
    }
  } catch {
    // fall through
  }

  return 'student'
}
