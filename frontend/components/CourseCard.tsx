import Image from "next/image";
import type { CourseData } from "@/lib/courses";

const levelColors: Record<string, string> = {
  Beginner: "bg-emerald-500",
  Intermediate: "bg-blue-500",
  Advanced: "bg-[#1A6EF5]",
};

interface Props {
  course: CourseData;
  moodleUrl?: string;
  variant?: "grid" | "listing";
}

export default function CourseCard({ course, variant = "grid" }: Props) {
  // Headless: cards always link to our own detail page, never Moodle.
  const courseUrl = `/courses/${course.slug}`;
  void variant;

  return (
    <div className="bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <span
          className={`absolute top-3 left-3 ${levelColors[course.level]} text-white text-xs font-semibold px-2.5 py-1 rounded-md`}
        >
          {course.level}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-amber-400 text-sm">★</span>
          <span className="text-sm font-semibold text-slate-800">{course.rating}</span>
          <span className="text-xs text-slate-400">({course.reviewCount.toLocaleString()} Reviews)</span>
        </div>

        <h3 className="font-bold text-slate-900 text-sm leading-snug mb-4 line-clamp-2">{course.title}</h3>

        {/* CTA */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500">
            {course.totalLessons} sessions
          </span>
          <a
            href={courseUrl}
            className="text-xs font-semibold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-[#1A6EF5] transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
}
