"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/** Buy a SINGLE course. Starts a Paystack checkout for just this course. */
export default function CourseCheckoutButton({ slug, label, className }: {
  slug: string; label: string; className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (res.status === 401) {
        router.push(`/login?callbackUrl=${encodeURIComponent(`/courses/${slug}`)}`);
        return;
      }
      const data = await res.json();
      if (!res.ok || !data.authorization_url) throw new Error(data.error || "Could not start checkout");
      window.location.href = data.authorization_url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <>
      <button onClick={handleClick} disabled={loading} className={className}>
        {loading ? "Starting checkout…" : label}
      </button>
      {error && <p className="text-xs text-rose-500 mt-2 text-center">{error}</p>}
    </>
  );
}
