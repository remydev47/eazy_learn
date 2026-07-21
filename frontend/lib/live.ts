import 'server-only'
import crypto from 'crypto'

/**
 * Deterministic, hard-to-guess Jitsi room name for a course. Same course → same room
 * (so a cohort always meets in the same place), but the hash suffix keeps the URL
 * unguessable. Access is further gated by login + enrolment on the /live page.
 * (For stronger control later, self-host Jitsi with JWT auth.)
 */
export function roomForCourse(slug: string): string {
  const salt = process.env.AUTH_SECRET || 'kodeclass'
  const hash = crypto.createHash('sha256').update(`${slug}:${salt}`).digest('hex').slice(0, 12)
  return `KodeClass-${slug}-${hash}`
}

export const JITSI_DOMAIN = 'meet.jit.si'
