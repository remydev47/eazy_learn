"use client";

import { useState } from "react";
import type { Module } from "@/lib/courses";

interface Props {
  curriculum: Module[];
}

export default function CurriculumAccordion({ curriculum }: Props) {
  const [open, setOpen] = useState<number>(2);

  const totalLessons = curriculum.reduce((acc, m) => acc + m.lessons.length, 0);
  const totalDuration = curriculum.reduce((acc, m) => {
    return (
      acc +
      m.lessons.filter((l) => l.type === "video").length
    );
  }, 0);

  return (
    <div>
      <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
        <span>{curriculum.length} sections</span>
        <span className="text-slate-300">·</span>
        <span>{totalLessons} lessons</span>
        <span className="text-slate-300">·</span>
        <span>{totalDuration} video lessons</span>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
        {curriculum.map((module, idx) => (
          <div key={idx}>
            <button
              onClick={() => setOpen(open === idx ? -1 : idx)}
              className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-400 w-5 shrink-0">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-semibold text-slate-800">{module.title}</span>
                <span className="hidden sm:block text-xs text-slate-400 border border-slate-200 rounded-full px-2 py-0.5">
                  {module.lessons.length} lessons
                </span>
              </div>
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ml-4 ${open === idx ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {open === idx && (
              <div className="divide-y divide-slate-100 bg-white">
                {module.lessons.map((lesson, li) => (
                  <div
                    key={li}
                    className={`flex items-center justify-between px-5 py-3.5 ${
                      lesson.current ? "bg-[#FF510E]/5 border-l-2 border-[#FF510E]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {lesson.type === "video" ? (
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${lesson.current ? "bg-[#FF510E]" : "bg-slate-100"}`}>
                          <svg className={`w-3 h-3 ml-0.5 ${lesson.current ? "text-white" : "text-slate-500"}`} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center shrink-0">
                          <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                      )}
                      <span className={`text-xs leading-snug truncate ${lesson.current ? "text-[#FF510E] font-semibold" : "text-slate-700"}`}>
                        {lesson.title}
                      </span>
                    </div>
                    <span className={`text-xs shrink-0 ml-4 ${lesson.current ? "text-[#FF510E] font-semibold" : "text-slate-400"}`}>
                      {lesson.duration}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
