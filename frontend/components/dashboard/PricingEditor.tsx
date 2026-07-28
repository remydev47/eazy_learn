"use client";

import { useState } from "react";
import type { PricingConfig } from "@/lib/pricing";
import type { Level } from "@/lib/courses";

const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];

interface CourseLite { slug: string; title: string; level: Level }

export default function PricingEditor({ initial, courses }: { initial: PricingConfig; courses: CourseLite[] }) {
  const [cfg, setCfg] = useState<PricingConfig>(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const setCourse = (l: Level, v: string) => setCfg((c) => ({ ...c, perCourse: { ...c.perCourse, [l]: Number(v) || 0 } }));
  const setTier = (l: Level, v: string) => setCfg((c) => ({ ...c, tier: { ...c.tier, [l]: Number(v) || 0 } }));
  const toggleFree = (slug: string) =>
    setCfg((c) => ({ ...c, free: c.free.includes(slug) ? c.free.filter((s) => s !== slug) : [...c.free, slug] }));

  async function save() {
    setStatus("saving");
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cfg),
      });
      setStatus(res.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="font-bold text-slate-900 mb-1">Single-course price (KES)</h2>
        <p className="text-xs text-slate-500 mb-4">What one course costs, by level.</p>
        <div className="grid grid-cols-3 gap-4">
          {LEVELS.map((l) => (
            <label key={l} className="text-sm">
              <span className="block text-slate-600 mb-1">{l}</span>
              <input type="number" min={0} value={cfg.perCourse[l]} onChange={(e) => setCourse(l, e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A6EF5]/30" />
            </label>
          ))}
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="font-bold text-slate-900 mb-1">Tier price (KES)</h2>
        <p className="text-xs text-slate-500 mb-4">Buys every course in that level.</p>
        <div className="grid grid-cols-3 gap-4">
          {LEVELS.map((l) => (
            <label key={l} className="text-sm">
              <span className="block text-slate-600 mb-1">{l}</span>
              <input type="number" min={0} value={cfg.tier[l]} onChange={(e) => setTier(l, e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1A6EF5]/30" />
            </label>
          ))}
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="font-bold text-slate-900 mb-1">Free courses</h2>
        <p className="text-xs text-slate-500 mb-4">Ticked courses are free to enrol (no payment).</p>
        <div className="space-y-2">
          {courses.map((c) => (
            <label key={c.slug} className="flex items-center gap-3 text-sm text-slate-700">
              <input type="checkbox" checked={cfg.free.includes(c.slug)} onChange={() => toggleFree(c.slug)} className="accent-[#1A6EF5]" />
              <span>{c.title} <span className="text-slate-400">· {c.level}</span></span>
            </label>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-4">
        <button onClick={save} disabled={status === "saving"}
          className="bg-[#1A6EF5] hover:bg-blue-600 text-white font-semibold text-sm px-6 py-2.5 rounded-lg disabled:opacity-60">
          {status === "saving" ? "Saving…" : "Save pricing"}
        </button>
        {status === "saved" && <span className="text-sm text-emerald-600">Saved ✓ (live within ~30s)</span>}
        {status === "error" && <span className="text-sm text-rose-600">Could not save — try again.</span>}
      </div>
    </div>
  );
}
