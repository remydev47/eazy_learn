// Server-side catalog fetchers. Maps Moodle's MoodleCourse shape onto the
// frontend's existing CourseData shape so the UI layer doesn't need rewriting.

import 'server-only'
import { moodleAPI } from './client'
import type { MoodleCourse } from './types'
import { getCourseMetadata, KNOWN_SHORTNAMES } from '../course-metadata'
import type { CourseData, Level } from '../courses'
import { getPricing, coursePrice, isFree } from '../pricing'

const FRONTPAGE_COURSE_ID = 1 // Moodle's built-in "Site" course — never in the catalog.
const KNOWN = new Set(KNOWN_SHORTNAMES)

/** Level (which drives price) is read from the course's Moodle category name, so the
 *  client sets it entirely in Moodle — put a course under Beginner/Intermediate/Advanced. */
function levelFromCategory(categoryname?: string): Level | null {
  const n = (categoryname ?? '').toLowerCase()
  if (n.includes('beginner')) return 'Beginner'
  if (n.includes('intermediate')) return 'Intermediate'
  if (n.includes('advanced')) return 'Advanced'
  return null
}

/** Moodle course "overview" image → our public thumbnail proxy (token added server-side). */
function overviewImage(course: MoodleCourse): string | null {
  const file = course.overviewfiles?.find((f) => f.mimetype?.startsWith('image/') && f.fileurl)
  return file ? `/api/course-image?url=${encodeURIComponent(file.fileurl)}` : null
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
}

function shortDescriptionFrom(summary: string, maxLen = 180): string {
  const plain = stripHtml(summary)
  if (plain.length <= maxLen) return plain
  return plain.slice(0, maxLen).replace(/[\s,.;:!?]+\S*$/, '') + '…'
}

/** Convert a Moodle course + demo metadata into the existing CourseData shape. */
export function mapMoodleCourse(course: MoodleCourse): CourseData {
  const meta = getCourseMetadata(course.shortname)
  // Self-service overrides read straight from Moodle:
  //  • level  → the course's Moodle category (drives price)
  //  • image  → the uploaded course image (falls back to a placeholder)
  //  • category badge → topical label for known courses, else the Moodle category
  const level = levelFromCategory(course.categoryname) ?? meta.level
  const image = overviewImage(course) ?? meta.image
  const category = KNOWN.has(course.shortname)
    ? meta.category
    : (course.categoryname?.trim() || meta.category)
  const overview = stripHtml(course.summary) || category
  return {
    id: course.id,
    slug: course.shortname,
    title: course.fullname,
    shortDescription: shortDescriptionFrom(course.summary),
    overview,
    whatYouLearn: [
      `Master the fundamentals of ${category.toLowerCase()}`,
      `Apply what you learn in ${meta.totalSessions} live sessions`,
      'Build a portfolio project you can show employers',
      'Get feedback from a working instructor every week',
      'Hands-on assignments with real-world context',
      'Certificate of completion when you finish',
    ],
    instructor: meta.instructor,
    category,
    level,
    rating: meta.rating,
    reviewCount: meta.reviewCount,
    studentCount: meta.studentCount,
    duration: `${meta.totalSessions} sessions · ~${meta.durationHours} hours`,
    totalLessons: meta.totalSessions,
    price: meta.priceKes,
    originalPrice: meta.originalPriceKes,
    image,
    // Curriculum is placeholder for the demo. Real lesson structure would come
    // from `core_course_get_contents` (per-course sections + modules).
    curriculum: [
      {
        title: 'Course Sessions',
        lessons: Array.from({ length: Math.min(meta.totalSessions, 8) }, (_, i) => ({
          title: `Session ${i + 1}`,
          duration: '1.25 hr live',
          type: 'video' as const,
        })),
      },
    ],
    moodleId: course.id,
  }
}

/**
 * Fetch the full catalog from Moodle (excluding Moodle's built-in Site frontpage course).
 *
 * Returns an empty list (rather than throwing) if Moodle is unreachable. This keeps a
 * Vercel build — and the pages that prerender at build time — from hard-failing on a
 * transient backend hiccup. Pages are ISR (see `revalidate` exports), so the catalog
 * repopulates on the next request once Moodle recovers.
 */
export async function getCatalog(): Promise<CourseData[]> {
  try {
    const [result, pricing] = await Promise.all([
      moodleAPI.getAllCoursesDetailed({ revalidate: 60 }),
      getPricing(),
    ])
    return (result.courses ?? [])
      .filter((c) => c.id !== FRONTPAGE_COURSE_ID && c.visible !== 0)
      .map(mapMoodleCourse)
      .map((c) => ({
        ...c,
        priceKes: coursePrice(pricing, c.level),
        isFree: isFree(pricing, c.slug),
        price: coursePrice(pricing, c.level),
      }))
  } catch (err) {
    console.error('[catalog] getCatalog failed; serving empty catalog:', err)
    return []
  }
}

/** Look up a single course by its URL slug (= Moodle shortname). Returns null on outage. */
export async function getCatalogCourseBySlug(slug: string): Promise<CourseData | null> {
  try {
    const [result, pricing] = await Promise.all([
      moodleAPI.getCoursesByField('shortname', slug, { revalidate: 60 }),
      getPricing(),
    ])
    const course = result.courses?.[0]
    if (!course || course.id === FRONTPAGE_COURSE_ID) return null
    const mapped = mapMoodleCourse(course)
    return {
      ...mapped,
      priceKes: coursePrice(pricing, mapped.level),
      price: coursePrice(pricing, mapped.level),
      isFree: isFree(pricing, mapped.slug),
    }
  } catch (err) {
    console.error(`[catalog] getCatalogCourseBySlug(${slug}) failed:`, err)
    return null
  }
}
