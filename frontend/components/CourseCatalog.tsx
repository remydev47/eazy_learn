"use client";

import { useState } from "react";
import { courses } from "@/lib/courses";
import CourseCard from "./CourseCard";

const tabs = ["All Courses", "Web Dev", "Programming", "Design", "Marketing"];

export default function CourseCatalog() {
  const [active, setActive] = useState("All Courses");
  const moodleUrl = process.env.NEXT_PUBLIC_MOODLE_URL ?? "#";

  const visible =
    active === "All Courses"
      ? courses.slice(3, 9)
      : courses.filter((c) => c.category === active).slice(0, 6);

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-widest text-[#FF510E] uppercase mb-2">
            Full Catalog
          </p>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Explore Every Discipline</h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm">
            Find exactly what you need to take your career to the next level.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`text-sm font-medium px-5 py-2.5 rounded-full transition-colors ${
                active === tab
                  ? "bg-slate-900 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {visible.map((course) => (
            <CourseCard key={course.id} course={course} moodleUrl={moodleUrl} />
          ))}
        </div>
      </div>
    </section>
  );
}
