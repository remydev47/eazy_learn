import Image from "next/image";
import type { CourseData } from "@/lib/courses";

const levelColors: Record<string, string> = {
  Beginner: "bg-emerald-500",
  Intermediate: "bg-blue-500",
  Advanced: "bg-[#FF510E]",
};

interface Props {
  course: CourseData;
  moodleUrl?: string;
  variant?: "grid" | "listing";
}

export default function CourseCard({ course, moodleUrl = "#", variant = "grid" }: Props) {
  const courseUrl = course.moodleId
    ? `${moodleUrl}/course/view.php?id=${course.moodleId}`
    : `/courses/${course.slug}`;

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

        <h3 className="font-bold text-slate-900 text-sm leading-snug mb-3 line-clamp-2">{course.title}</h3>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className={`w-6 h-6 ${course.instructor.color} rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0`}
          >
            {course.instructor.initials}
          </div>
          <span className="text-xs text-slate-500">By {course.instructor.name}</span>
        </div>

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-base font-bold text-slate-900">${course.price}.00</span>
          <a
            href={courseUrl}
            className="text-xs font-semibold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-[#FF510E] transition-colors"
          >
            {variant === "listing" ? "Enroll Now" : "View Course"}
          </a>
        </div>
      </div>
    </div>
  );
}
