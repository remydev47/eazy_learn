import Link from "next/link";
import { getCatalog } from "@/lib/moodle/catalog";
import CourseCard from "./CourseCard";

export default async function FeaturedCourses() {
  const catalog = await getCatalog();
  // One from each tier where possible, else the first few.
  const byTier = (level: string) => catalog.find((c) => c.level === level);
  const picks = [byTier("Beginner"), byTier("Intermediate"), byTier("Advanced")].filter(Boolean);
  const featured = (picks.length === 3 ? picks : catalog.slice(0, 3)) as typeof catalog;

  if (featured.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#1A6EF5] uppercase mb-2">
              Top Picks
            </p>
            <h2 className="text-3xl font-bold text-slate-900">Featured Courses</h2>
            <p className="text-slate-500 mt-2 text-sm">
              Start your journey with our highest-rated professional programs.
            </p>
          </div>
          <Link
            href="/courses"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-[#1A6EF5] transition-colors"
          >
            Explore all courses
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
