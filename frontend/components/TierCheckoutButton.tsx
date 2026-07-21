"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TierId } from "@/lib/tiers";

interface Props {
  tier: TierId;
  label: string;
  className?: string;
}

/**
 * Starts an on-site Paystack checkout for a whole tier. Initializes server-side and
 * redirects to the Paystack checkout (M-Pesa / card, KES). If not logged in, the API
 * returns 401 and we route to /login and back.
 */
export default function TierCheckoutButton({ tier, label, className }: Props) {
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
        body: JSON.stringify({ tier }),
      });
      if (res.status === 401) {
        router.push(`/login?callbackUrl=${encodeURIComponent("/pricing")}`);
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
