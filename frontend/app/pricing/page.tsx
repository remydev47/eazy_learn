"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ─── Data ─────────────────────────────────────────────────── */

const plans = [
  {
    name: "Free",
    tagline: "Explore the basics of learning.",
    monthly: 0,
    yearly: 0,
    cta: "Get Started",
    ctaHref: "/courses",
    popular: false,
    features: [
      "10 Basic Courses",
      "Community Forum Access",
      "Standard Support",
    ],
  },
  {
    name: "Pro",
    tagline: "For dedicated skill builders.",
    monthly: 29,
    yearly: 23,
    cta: "Start Free Trial",
    ctaHref: "#",
    popular: true,
    features: [
      "Unlimited Access",
      "Certified Badges",
      "1-on-1 Mentorship",
      "Offline Learning",
    ],
  },
  {
    name: "Enterprise",
    tagline: "Custom solutions for teams.",
    monthly: null,
    yearly: null,
    cta: "Contact Sales",
    ctaHref: "/contact",
    popular: false,
    features: [
      "Admin Dashboard",
      "SSO Integration",
      "Dedicated Account Manager",
      "Custom Content Creation",
    ],
  },
] as const;

const faqs = [
  {
    q: "Can I switch plans anytime?",
    a: "Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes are applied at the start of your next billing cycle with no hidden fees.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. Enterprise plans also support bank transfers and purchase orders.",
  },
  {
    q: "Is there a student discount available?",
    a: "Yes. Students with a valid .edu email receive 30% off all paid plans. Verify your student status at checkout and use code STUDENT30.",
  },
  {
    q: "Do you offer certificates?",
    a: "All Pro and Enterprise subscribers receive verified digital certificates upon course completion. Certificates include a unique URL and can be shared directly to LinkedIn.",
  },
];

const institutions = ["University of Lagos", "MIT OpenCourseWare", "Coursera Partners", "KNUST"];

/* ─── Component ─────────────────────────────────────────────── */

export default function PricingPage() {
  const [yearly, setYearly] = useState(true);
  const [openFaq, setOpenFaq] = useState<number>(0);

  return (
    <>
      <Navbar />
      <main className="bg-white">

        {/* ── Header ── */}
        <section className="relative overflow-hidden py-20 text-center">
          {/* Subtle gradient blob top-right */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
            <p className="text-xs font-semibold tracking-widest text-[#FF510E] uppercase mb-4">
              Invest in Your Future
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed mb-10">
              Choose the perfect plan for your learning journey. No hidden fees, cancel anytime.
            </p>

            {/* Monthly / Yearly toggle */}
            <div className="inline-flex items-center gap-4">
              <span className={`text-sm font-medium ${!yearly ? "text-slate-900" : "text-slate-400"}`}>
                Monthly
              </span>
              <button
                onClick={() => setYearly(!yearly)}
                className={`relative w-12 h-6 rounded-full transition-colors ${yearly ? "bg-[#FF510E]" : "bg-slate-300"}`}
                aria-label="Toggle billing period"
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${yearly ? "translate-x-6" : "translate-x-0"}`}
                />
              </button>
              <span className={`text-sm font-medium ${yearly ? "text-slate-900" : "text-slate-400"}`}>
                Yearly
              </span>
              {yearly && (
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  Save 20%
                </span>
              )}
            </div>
          </div>
        </section>

        {/* ── Pricing cards ── */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {plans.map((plan) => (
              <div key={plan.name} className="relative flex flex-col">
                {/* Most popular badge sits above the card */}
                {plan.popular && (
                  <div className="flex justify-center mb-0 -mb-px z-10 relative">
                    <span className="bg-[#FF510E] text-white text-xs font-bold px-5 py-1.5 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div
                  className={`flex flex-col flex-1 bg-white rounded-2xl p-7 border-2 transition-shadow ${
                    plan.popular
                      ? "border-[#FF510E] shadow-xl shadow-orange-100"
                      : "border-slate-200 hover:shadow-md"
                  }`}
                >
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h2>
                    <p className="text-sm text-slate-500">{plan.tagline}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    {plan.monthly === null ? (
                      <p className="text-4xl font-bold text-slate-900">Custom</p>
                    ) : plan.monthly === 0 ? (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-slate-900">$0</span>
                        <span className="text-slate-400 text-sm">/mo</span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-slate-900">
                          ${yearly ? plan.yearly : plan.monthly}
                        </span>
                        <span className="text-slate-400 text-sm">/mo</span>
                      </div>
                    )}
                    {yearly && plan.monthly !== null && plan.monthly > 0 && (
                      <p className="text-xs text-slate-400 mt-1">
                        Billed ${(plan.yearly! * 12)} annually
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={plan.ctaHref}
                    className={`block w-full text-sm font-semibold text-center py-3 rounded-xl mb-7 transition-colors ${
                      plan.popular
                        ? "bg-[#FF510E] text-white hover:bg-orange-600"
                        : plan.name === "Enterprise"
                        ? "bg-slate-900 text-white hover:bg-slate-700"
                        : "border-2 border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                        <svg
                          className="w-4 h-4 text-[#FF510E] shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="bg-slate-50 py-20 border-t border-slate-100">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-sm font-semibold text-slate-900 pr-4">{faq.q}</span>
                    <svg
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5">
                      <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trusted by institutions ── */}
        <section className="py-14 border-t border-slate-100 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-8">
              Trusted by leading academic institutions
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-items-center">
              {institutions.map((inst) => (
                <div
                  key={inst}
                  className="h-16 w-full bg-slate-100 rounded-xl flex items-center justify-center px-4"
                >
                  <span className="text-slate-400 font-semibold text-xs text-center leading-tight">{inst}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
