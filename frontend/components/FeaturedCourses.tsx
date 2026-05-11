import Link from "next/link";
import { courses } from "@/lib/courses";
import CourseCard from "./CourseCard";

export default function FeaturedCourses() {
  const moodleUrl = process.env.NEXT_PUBLIC_MOODLE_URL ?? "#";
  const featured = courses.slice(0, 3);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#FF510E] uppercase mb-2">
              Top Picks
            </p>
            <h2 className="text-3xl font-bold text-slate-900">Featured Courses</h2>
            <p className="text-slate-500 mt-2 text-sm">
              Start your journey with our highest-rated professional programs.
            </p>
          </div>
          <Link
            href="/courses"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-[#FF510E] transition-colors"
          >
            Explore all courses
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featured.map((course) => (
            <CourseCard key={course.id} course={course} moodleUrl={moodleUrl} />
          ))}
        </div>
      </div>
    </section>
  );
}
