"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  slug: string;
  price: number;
}

/**
 * On-site checkout. Initializes a Paystack transaction server-side and redirects to
 * the Paystack checkout (M-Pesa / card, KES). After paying, the user returns to
 * /payment/callback. If they aren't logged in, the API returns 401 and we send them
 * to /login and back. Keeps the course page static (auth is checked on click).
 */
export default function EnrollButton({ slug, price }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEnroll() {
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
      if (!res.ok || !data.authorization_url) {
        throw new Error(data.error || "Could not start checkout");
      }
      window.location.href = data.authorization_url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="mb-3">
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="block w-full bg-[#1A6EF5] text-white text-sm font-bold text-center py-3.5 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Starting checkout…" : `Enroll Now — Ksh ${price.toLocaleString()}`}
      </button>
      {error && <p className="text-xs text-rose-500 mt-2 text-center">{error}</p>}
    </div>
  );
}
