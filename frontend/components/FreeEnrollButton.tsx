"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Enrol in a free course directly (no payment). Sends to login first if needed. */
export default function FreeEnrollButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/enroll/free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (res.status === 401) {
        router.push(`/login?callbackUrl=${encodeURIComponent(`/courses/${slug}`)}`);
        return;
      }
      if (!res.ok) throw new Error("Could not enrol. Please try again.");
      router.push("/dashboard/student");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading}
        className="block w-full bg-emerald-600 text-white text-sm font-bold text-center py-3.5 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60"
      >
        {loading ? "Enrolling…" : "Enrol for Free"}
      </button>
      {error && <p className="text-xs text-rose-500 mt-2 text-center">{error}</p>}
    </>
  );
}
