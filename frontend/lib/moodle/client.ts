import 'server-only'
import type {
  ActivityCompletionResponse,
  AssignmentsResponse,
  CalendarEventsResponse,
  LogEntriesResponse,
  MoodleCourse,
  MoodleException,
  MoodleUser,
  SiteInfo,
  UserGradesResponse,
} from './types'

const MOODLE_URL = process.env.MOODLE_URL
const MOODLE_TOKEN = process.env.MOODLE_TOKEN

if (!MOODLE_URL || !MOODLE_TOKEN) {
  // Fail fast at module load so a misconfigured env doesn't silently 401 every call.
  // Comment this out only if you need to import the client in a build step before envs are set.
  if (process.env.NODE_ENV === 'production') {
    throw new Error('MOODLE_URL and MOODLE_TOKEN must be set in env')
  } else {
    // eslint-disable-next-line no-console
    console.warn('[moodle] MOODLE_URL or MOODLE_TOKEN missing — API calls will fail')
  }
}

const REST_ENDPOINT = `${MOODLE_URL}/webservice/rest/server.php`

export class MoodleAPIError extends Error {
  constructor(
    public errorcode: string,
    message: string,
    public exception?: string,
    public debuginfo?: string,
  ) {
    super(message)
    this.name = 'MoodleAPIError'
  }
}

interface CallOptions {
  /** Cache lifetime in seconds. 0 = no cache. Default 60. */
  revalidate?: number
  /** Cache tag(s) for on-demand revalidation via revalidateTag(). */
  tags?: string[]
}

/**
 * Low-level Moodle Web Services call.
 * Flattens nested params per Moodle's PHP-style bracket convention
 * (e.g. { criteria: [{ key, value }] } → criteria[0][key]=...&criteria[0][value]=...).
 */
async function callMoodle<T>(
  wsfunction: string,
  params: Record<string, unknown> = {},
  options: CallOptions = {},
): Promise<T> {
  const body = new URLSearchParams()
  body.append('wstoken', MOODLE_TOKEN!)
  body.append('wsfunction', wsfunction)
  body.append('moodlewsrestformat', 'json')
  appendParams(body, params)

  const res = await fetch(REST_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
    next: {
      revalidate: options.revalidate ?? 60,
      tags: options.tags,
    },
  })

  if (!res.ok) {
    throw new MoodleAPIError('http_error', `Moodle HTTP ${res.status}: ${res.statusText}`)
  }

  const data = (await res.json()) as T | MoodleException
  if (data && typeof data === 'object' && 'exception' in data) {
    const err = data as MoodleException
    throw new MoodleAPIError(err.errorcode, err.message, err.exception, err.debuginfo)
  }
  return data as T
}

function appendParams(body: URLSearchParams, params: Record<string, unknown>, prefix = ''): void {
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue
    const fieldKey = prefix ? `${prefix}[${key}]` : key
    if (Array.isArray(value)) {
      value.forEach((item, idx) => {
        const itemKey = `${fieldKey}[${idx}]`
        if (item !== null && typeof item === 'object') {
          appendParams(body, item as Record<string, unknown>, itemKey)
        } else {
          body.append(itemKey, String(item))
        }
      })
    } else if (typeof value === 'object') {
      appendParams(body, value as Record<string, unknown>, fieldKey)
    } else {
      body.append(fieldKey, String(value))
    }
  }
}

// ── Public API ──────────────────────────────────────────────────────────────

export const moodleAPI = {
  /** Connectivity check + returns the token's user. Use this for the first end-to-end test. */
  getSiteInfo(opts?: CallOptions) {
    return callMoodle<SiteInfo>('core_webservice_get_site_info', {}, opts)
  },

  // ── Student ────────────────────────────────────────────────────────────────

  getEnrolledCourses(userId: number, opts?: CallOptions) {
    return callMoodle<MoodleCourse[]>(
      'core_enrol_get_users_courses',
      { userid: userId },
      { revalidate: 60, tags: [`user:${userId}:courses`], ...opts },
    )
  },

  getCourseProgress(userId: number, courseId: number, opts?: CallOptions) {
    return callMoodle<ActivityCompletionResponse>(
      'core_completion_get_activities_completion_status',
      { userid: userId, courseid: courseId },
      { revalidate: 60, tags: [`user:${userId}:course:${courseId}:progress`], ...opts },
    )
  },

  getUpcomingAssignments(courseIds: number[], opts?: CallOptions) {
    return callMoodle<AssignmentsResponse>(
      'mod_assign_get_assignments',
      { courseids: courseIds },
      { revalidate: 300, ...opts },
    )
  },

  getUserGrades(userId: number, courseId?: number, opts?: CallOptions) {
    return callMoodle<UserGradesResponse>(
      'gradereport_user_get_grade_items',
      { userid: userId, ...(courseId && { courseid: courseId }) },
      { revalidate: 60, tags: [`user:${userId}:grades`], ...opts },
    )
  },

  getCalendarEvents(courseIds: number[], opts?: CallOptions) {
    return callMoodle<CalendarEventsResponse>(
      'core_calendar_get_calendar_events',
      { events: { courseids: courseIds }, options: { userevents: 1, siteevents: 0 } },
      { revalidate: 300, ...opts },
    )
  },

  // ── Instructor ─────────────────────────────────────────────────────────────

  getEnrolledStudents(courseId: number, opts?: CallOptions) {
    return callMoodle<MoodleUser[]>(
      'core_enrol_get_enrolled_users',
      { courseid: courseId },
      { revalidate: 60, tags: [`course:${courseId}:students`], ...opts },
    )
  },

  getCourseActivityLogs(courseId: number, opts?: CallOptions) {
    return callMoodle<LogEntriesResponse>(
      'report_log_get_entries',
      { courseid: courseId },
      { revalidate: 120, ...opts },
    )
  },

  // ── Catalog (public pages) ─────────────────────────────────────────────────

  /** All courses on the site. Moodle returns course id=1 (the "Site" frontpage) too — filter it out. */
  getAllCourses(opts?: CallOptions) {
    return callMoodle<MoodleCourse[]>(
      'core_course_get_courses',
      {},
      { revalidate: 60, tags: ['catalog'], ...opts },
    )
  },

  /** Look up a single course by a unique field (e.g. `shortname` as a URL slug). */
  getCoursesByField(field: 'id' | 'ids' | 'shortname' | 'idnumber' | 'category', value: string, opts?: CallOptions) {
    return callMoodle<{ courses: MoodleCourse[]; warnings?: unknown[] }>(
      'core_course_get_courses_by_field',
      { field, value },
      { revalidate: 60, ...opts },
    )
  },

  // ── Admin ──────────────────────────────────────────────────────────────────

  getAllUsers(opts?: CallOptions) {
    return callMoodle<{ users: MoodleUser[]; warnings?: unknown[] }>(
      'core_user_get_users',
      { criteria: [{ key: 'deleted', value: '0' }] },
      { revalidate: 120, tags: ['users'], ...opts },
    )
  },

  getUsersByField(field: 'id' | 'email' | 'username' | 'idnumber', values: string[], opts?: CallOptions) {
    return callMoodle<MoodleUser[]>(
      'core_user_get_users_by_field',
      { field, values },
      { revalidate: 60, ...opts },
    )
  },

  updateUser(user: Partial<MoodleUser> & { id: number }, opts?: CallOptions) {
    return callMoodle<null>(
      'core_user_update_users',
      { users: [user] },
      { revalidate: 0, ...opts },
    )
  },

  assignRole(userId: number, roleId: number, contextId: number, opts?: CallOptions) {
    return callMoodle<null>(
      'core_role_assign_roles',
      { assignments: [{ roleid: roleId, userid: userId, contextid: contextId }] },
      { revalidate: 0, ...opts },
    )
  },
}

export { callMoodle }
