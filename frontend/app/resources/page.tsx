"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { resources } from "@/lib/resources";
import type { ResourceType, ResourceCategory } from "@/lib/resources";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TYPE_TABS: ("All" | ResourceType)[] = ["All", "E-book", "Article", "Template", "Tool"];
const CATEGORY_TABS: ResourceCategory[] = ["All", "Web Dev", "Data Science", "Design", "Programming", "Marketing"];

const typeBadgeColors: Record<ResourceType, string> = {
  "E-book":   "bg-blue-50 text-blue-700",
  "Article":  "bg-emerald-50 text-emerald-700",
  "Template": "bg-violet-50 text-violet-700",
  "Tool":     "bg-amber-50 text-amber-700",
};

const stats = [
  { value: "80+", label: "Free resources" },
  { value: "Weekly", label: "New additions" },
  { value: "9 topics", label: "Covered" },
  { value: "100%", label: "Free forever" },
];

export default function ResourcesPage() {
  const [typeFilter, setTypeFilter] = useState<"All" | ResourceType>("All");
  const [catFilter, setCatFilter] = useState<ResourceCategory>("All");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    return resources.filter((r) => {
      const matchType = typeFilter === "All" || r.type === typeFilter;
      const matchCat = catFilter === "All" || r.category === catFilter;
      const matchQuery =
        !query ||
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.description.toLowerCase().includes(query.toLowerCase());
      return matchType && matchCat && matchQuery;
    });
  }, [typeFilter, catFilter, query]);

  return (
    <>
      <Navbar />
      <main className="bg-white">

        {/* ── Hero ── */}
        <section className="bg-gradient-to-br from-slate-50 to-white border-b border-slate-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-semibold tracking-widest text-[#FF510E] uppercase mb-3">
              Free Learning Hub
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Resources to Level Up
            </h1>
            <p className="text-slate-500 max-w-lg mx-auto leading-relaxed mb-10">
              E-books, articles, templates, and tools — curated by our instructors and updated every
              week. No sign-up required to download.
            </p>

            {/* Search */}
            <div className="relative max-w-lg mx-auto">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
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
                placeholder="Search resources..."
                className="w-full pl-11 pr-4 py-3.5 text-sm bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF510E]/30 focus:border-[#FF510E] placeholder-slate-400"
              />
            </div>
          </div>
        </section>

        {/* ── Stats strip ── */}
        <div className="border-b border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap justify-center gap-x-16 gap-y-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-xl font-bold text-slate-900">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
          {/* Type tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {TYPE_TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`text-sm font-medium px-5 py-2.5 rounded-full transition-colors ${
                  typeFilter === t
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            {CATEGORY_TABS.map((c) => (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                className={`text-xs font-medium px-4 py-2 rounded-full border transition-colors ${
                  catFilter === c
                    ? "border-[#FF510E] text-[#FF510E] bg-[#FF510E]/5"
                    : "border-slate-200 text-slate-500 hover:border-slate-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* ── Resource grid ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {visible.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 font-medium">No resources match your filters.</p>
              <button
                onClick={() => { setTypeFilter("All"); setCatFilter("All"); setQuery(""); }}
                className="mt-3 text-sm text-[#FF510E] font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {visible.map((r) => (
                <div
                  key={r.id}
                  className="bg-white border border-slate-100 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
                >
                  {/* Cover */}
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={r.image}
                      alt={r.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-md ${typeBadgeColors[r.type]}`}>
                      {r.type}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    {/* Meta */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-slate-400 border border-slate-200 rounded-full px-2.5 py-0.5">
                        {r.category}
                      </span>
                      <span className="text-xs text-slate-400">{r.meta}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm leading-snug mb-2 line-clamp-2">
                      {r.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 flex-1 mb-5">
                      {r.description}
                    </p>

                    <a
                      href="#"
                      className="inline-flex items-center gap-2 text-xs font-semibold text-[#FF510E] hover:gap-3 transition-all"
                    >
                      {r.downloadLabel}
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Newsletter CTA ── */}
        <div className="bg-slate-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-semibold tracking-widest text-[#FF510E] uppercase mb-3">
              Stay updated
            </p>
            <h2 className="text-3xl font-bold text-white mb-3">
              New resources every week
            </h2>
            <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
              Get fresh e-books, templates, and articles delivered to your inbox. Unsubscribe
              anytime.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-white/10 text-white border border-white/20 text-sm px-5 py-3 rounded-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF510E]/50"
              />
              <button
                type="submit"
                className="bg-[#FF510E] text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors shrink-0"
              >
                Subscribe Free
              </button>
            </form>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
