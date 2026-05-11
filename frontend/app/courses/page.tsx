"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { courses } from "@/lib/courses";
import type { Level } from "@/lib/courses";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CATEGORIES = ["All Categories", "Web Dev", "Data Science", "Design", "Programming", "Marketing"];
const PRICE_RANGES = ["Any Price", "Under $100", "$100–$150", "$150–$200", "Over $200"];
const LEVELS: ("All Levels" | Level)[] = ["All Levels", "Beginner", "Intermediate", "Advanced"];

const levelColors: Record<string, string> = {
  Beginner: "bg-emerald-500",
  Intermediate: "bg-blue-500",
  Advanced: "bg-[#FF510E]",
};

const PAGE_SIZE = 6;

export default function CoursesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [priceRange, setPriceRange] = useState("Any Price");
  const [level, setLevel] = useState<"All Levels" | Level>("All Levels");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchQuery =
        !query ||
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.instructor.name.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase());

      const matchCategory = category === "All Categories" || c.category === category;

      const matchLevel = level === "All Levels" || c.level === level;

      const matchPrice =
        priceRange === "Any Price" ||
        (priceRange === "Under $100" && c.price < 100) ||
        (priceRange === "$100–$150" && c.price >= 100 && c.price <= 150) ||
        (priceRange === "$150–$200" && c.price > 150 && c.price <= 200) ||
        (priceRange === "Over $200" && c.price > 200);

      return matchQuery && matchCategory && matchLevel && matchPrice;
    });
  }, [query, category, priceRange, level]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function applyFilters() {
    setPage(1);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">
        {/* Page header */}
        <div className="bg-white border-b border-slate-100 py-14 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Explore Our Courses</h1>
          <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
            Master new skills with professional-grade curriculum designed for the modern era of
            design, technology, and business.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Search + view toggle */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search courses, instructors, or topics..."
                className="w-full bg-white border border-slate-200 rounded-lg pl-11 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF510E]/30 focus:border-[#FF510E]"
              />
            </div>
            {/* Grid / List toggle */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden shrink-0">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 ${viewMode === "grid" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"}`}
                aria-label="Grid view"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 ${viewMode === "list" ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"}`}
                aria-label="List view"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap gap-3 items-center mb-8">
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="bg-white border border-slate-200 text-sm text-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF510E]/30 cursor-pointer"
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>

            <select
              value={priceRange}
              onChange={(e) => { setPriceRange(e.target.value); setPage(1); }}
              className="bg-white border border-slate-200 text-sm text-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF510E]/30 cursor-pointer"
            >
              {PRICE_RANGES.map((p) => <option key={p}>{p}</option>)}
            </select>

            <select
              value={level}
              onChange={(e) => { setLevel(e.target.value as typeof level); setPage(1); }}
              className="bg-white border border-slate-200 text-sm text-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF510E]/30 cursor-pointer"
            >
              {LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>

            <button
              onClick={applyFilters}
              className="flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Apply Filters
            </button>

            {filtered.length !== courses.length && (
              <span className="text-sm text-slate-500 ml-1">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Course grid / list */}
          {paginated.length === 0 ? (
            <div className="text-center py-24 text-slate-400">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium text-slate-500">No courses match your filters.</p>
              <button
                onClick={() => { setQuery(""); setCategory("All Categories"); setPriceRange("Any Price"); setLevel("All Levels"); setPage(1); }}
                className="mt-3 text-sm text-[#FF510E] font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid md:grid-cols-3 gap-6">
              {paginated.map((course) => (
                <Link key={course.id} href={`/courses/${course.slug}`} className="group block bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <span className={`absolute top-3 left-3 ${levelColors[course.level]} text-white text-xs font-semibold px-2.5 py-1 rounded-md`}>
                      {course.level}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-amber-400 text-sm">★</span>
                      <span className="text-sm font-semibold text-slate-800">{course.rating}</span>
                      <span className="text-xs text-slate-400">({course.reviewCount.toLocaleString()} Reviews)</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug mb-3 line-clamp-2">{course.title}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`w-6 h-6 ${course.instructor.color} rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                        {course.instructor.initials}
                      </div>
                      <span className="text-xs text-slate-500">By {course.instructor.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-slate-900">${course.price}.00</span>
                      <span className="text-xs font-semibold bg-slate-900 text-white px-4 py-2 rounded-lg group-hover:bg-[#FF510E] transition-colors">
                        Enroll Now
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {paginated.map((course) => (
                <Link key={course.id} href={`/courses/${course.slug}`} className="group flex bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200">
                  <div className="relative w-48 shrink-0 overflow-hidden">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="200px"
                    />
                    <span className={`absolute top-3 left-3 ${levelColors[course.level]} text-white text-xs font-semibold px-2 py-0.5 rounded-md`}>
                      {course.level}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col justify-between flex-1">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-amber-400 text-xs">★</span>
                        <span className="text-xs font-semibold text-slate-800">{course.rating}</span>
                        <span className="text-xs text-slate-400">({course.reviewCount.toLocaleString()} Reviews)</span>
                        <span className="ml-2 text-xs text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full">{course.category}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1">{course.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{course.shortDescription}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 ${course.instructor.color} rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                          {course.instructor.initials}
                        </div>
                        <span className="text-xs text-slate-500">{course.instructor.name}</span>
                        <span className="text-xs text-slate-300">·</span>
                        <span className="text-xs text-slate-400">{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-900">${course.price}.00</span>
                        <span className="text-xs font-semibold bg-slate-900 text-white px-4 py-2 rounded-lg group-hover:bg-[#FF510E] transition-colors">
                          Enroll Now
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-12">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                    n === page
                      ? "bg-[#FF510E] text-white"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {n}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Newsletter CTA */}
          <div className="mt-16 bg-[#1a0a00] rounded-2xl px-8 py-14 text-center">
            <p className="text-[#FF510E] text-sm font-semibold mb-3">Stay in the loop</p>
            <h2 className="text-3xl font-bold text-white mb-3">Stay ahead of the curve</h2>
            <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
              Subscribe for early access to new courses, curated resources, and exclusive offers.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white text-slate-900 text-sm px-5 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF510E]/50"
              />
              <button
                type="submit"
                className="bg-[#FF510E] text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors shrink-0"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
