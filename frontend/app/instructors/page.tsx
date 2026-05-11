"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { instructors } from "@/lib/instructors";
import type { InstructorCategory } from "@/lib/instructors";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TABS: ("All" | InstructorCategory)[] = ["All", "Tech", "Design", "Business", "Marketing"];

export default function InstructorsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | InstructorCategory>("All");

  const visible = useMemo(() => {
    return instructors.filter((i) => {
      const matchQuery =
        !query ||
        i.name.toLowerCase().includes(query.toLowerCase()) ||
        i.role.toLowerCase().includes(query.toLowerCase()) ||
        i.company.toLowerCase().includes(query.toLowerCase());
      const matchCategory = category === "All" || i.category === category;
      return matchQuery && matchCategory;
    });
  }, [query, category]);

  return (
    <>
      <Navbar />
      <main className="bg-white">

        {/* ── Hero ── */}
        <section className="bg-slate-50 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left */}
              <div>
                <p className="text-xs font-semibold tracking-widest text-[#FF510E] uppercase mb-4">
                  World-Class Educators
                </p>
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-5">
                  Learn from the Best
                </h1>
                <p className="text-slate-500 text-base leading-relaxed max-w-lg">
                  Our instructors are industry veterans, award-winning designers, and tech pioneers
                  dedicated to sharing their decades of expertise with the next generation of global talent.
                </p>
              </div>

              {/* Right: image + badge */}
              <div className="hidden lg:block relative">
                <div className="relative h-64 rounded-2xl overflow-hidden">
                  <Image
                    src="/assets/less3.webp"
                    alt="Expert instructors"
                    fill
                    className="object-cover"
                    sizes="560px"
                    priority
                  />
                </div>
                {/* Floating badge */}
                <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg border border-slate-100 px-4 py-3 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {["bg-blue-400", "bg-rose-400", "bg-emerald-400"].map((c, i) => (
                      <div key={i} className={`w-7 h-7 ${c} rounded-full border-2 border-white`} />
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Join 50k+ students</p>
                    <p className="text-xs text-slate-500">Learning from masters</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Search + Filters ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-10 shadow-sm">
            {/* Search */}
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or expertise..."
                className="w-full pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF510E]/30 focus:border-[#FF510E]"
              />
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-500 mr-1">Categories:</span>
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCategory(tab)}
                  className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                    category === tab
                      ? "bg-[#FF510E] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* ── Instructor cards ── */}
          {visible.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <p className="font-medium">No instructors match your search.</p>
              <button
                onClick={() => { setQuery(""); setCategory("All"); }}
                className="mt-3 text-sm text-[#FF510E] font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {visible.map((inst) => (
                <div
                  key={inst.id}
                  className="bg-white border border-slate-100 rounded-xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 relative flex flex-col"
                >
                  {/* Arrow link (top right) */}
                  <button className="absolute top-5 right-5 w-8 h-8 bg-[#FF510E]/10 hover:bg-[#FF510E] rounded-full flex items-center justify-center text-[#FF510E] hover:text-white transition-colors group">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Avatar */}
                  <div
                    className={`w-14 h-14 ${inst.color} rounded-full flex items-center justify-center text-white text-lg font-bold mb-4`}
                  >
                    {inst.initials}
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-0.5">{inst.name}</h3>
                  <p className="text-xs font-semibold text-[#FF510E] tracking-wide mb-3">
                    {inst.role}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 flex-1 mb-4">
                    {inst.bio}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-400">★</span>
                      <span className="font-semibold text-slate-700">{inst.rating}</span>
                      <span>({inst.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      {inst.students} students
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Become an Instructor CTA ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="bg-[#1c1c1e] rounded-2xl px-10 py-14 relative overflow-hidden">
            {/* Graduation cap icon (decorative, right side) */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-10 hidden lg:block">
              <svg className="w-48 h-48 text-[#FF510E]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9 12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
              </svg>
            </div>

            <div className="relative max-w-md">
              <h2 className="text-3xl font-bold text-white mb-4">
                Become an<br />Instructor
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                Share your knowledge with a global community of learners and build your personal
                brand as a thought leader in your industry.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#apply"
                  className="bg-[#FF510E] text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Apply Now
                </a>
                <a
                  href="#learn"
                  className="bg-transparent text-white text-sm font-semibold px-6 py-3 rounded-lg border border-white/30 hover:bg-white/10 transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
