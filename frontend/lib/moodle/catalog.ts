// Server-side catalog fetchers. Maps Moodle's MoodleCourse shape onto the
// frontend's existing CourseData shape so the UI layer doesn't need rewriting.

import 'server-only'
import { moodleAPI } from './client'
import type { MoodleCourse } from './types'
import { getCourseMetadata } from '../course-metadata'
import type { CourseData } from '../courses'

const FRONTPAGE_COURSE_ID = 1 // Moodle's built-in "Site" course — never in the catalog.

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
  const overview = stripHtml(course.summary) || meta.category
  return {
    id: course.id,
    slug: course.shortname,
    title: course.fullname,
    shortDescription: shortDescriptionFrom(course.summary),
    overview,
    whatYouLearn: [
      `Master the fundamentals of ${meta.category.toLowerCase()}`,
      `Apply what you learn in ${meta.totalSessions} live sessions`,
      'Build a portfolio project you can show employers',
      'Get feedback from a working instructor every week',
      'Hands-on assignments with real-world context',
      'Certificate of completion when you finish',
    ],
    instructor: meta.instructor,
    category: meta.category,
    level: meta.level,
    rating: meta.rating,
    reviewCount: meta.reviewCount,
    studentCount: meta.studentCount,
    duration: `${meta.totalSessions} sessions · ~${meta.durationHours} hours`,
    totalLessons: meta.totalSessions,
    price: meta.priceUsd,
    originalPrice: meta.originalPriceUsd,
    image: meta.image,
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

/** Fetch the full catalog from Moodle (excluding Moodle's built-in Site frontpage course). */
export async function getCatalog(): Promise<CourseData[]> {
  const raw = await moodleAPI.getAllCourses({ revalidate: 60 })
  return raw
    .filter((c) => c.id !== FRONTPAGE_COURSE_ID && c.visible !== 0)
    .map(mapMoodleCourse)
}

/** Look up a single course by its URL slug (= Moodle shortname). */
export async function getCatalogCourseBySlug(slug: string): Promise<CourseData | null> {
  const result = await moodleAPI.getCoursesByField('shortname', slug, { revalidate: 60 })
  const course = result.courses?.[0]
  if (!course || course.id === FRONTPAGE_COURSE_ID) return null
  return mapMoodleCourse(course)
}
