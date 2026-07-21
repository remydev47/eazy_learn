import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TierCheckoutButton from "@/components/TierCheckoutButton";
import { getCatalog } from "@/lib/moodle/catalog";
import { TIERS } from "@/lib/tiers";

export const revalidate = 60;

const faqs = [
  {
    q: "How does tier pricing work?",
    a: "Each tier is a one-time payment that unlocks every course in that level. Buy Beginner and you get all Beginner courses; the same for Intermediate and Advanced.",
  },
  {
    q: "What payment methods can I use?",
    a: "M-Pesa and all major cards (Visa, Mastercard), in Kenyan Shillings, via Paystack — the same secure checkout used by leading Kenyan businesses.",
  },
  {
    q: "Do I get a certificate?",
    a: "Yes — you receive a certificate of completion for each course you finish.",
  },
  {
    q: "Is access time-limited?",
    a: "No. Once you buy a tier you keep access to its courses, including any live-session recordings.",
  },
];

export default async function PricingPage() {
  const catalog = await getCatalog();

  return (
    <>
      <Navbar />
      <main className="bg-white">
        <section className="relative overflow-hidden py-20 text-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
            <p className="text-xs font-semibold tracking-widest text-[#1A6EF5] uppercase mb-4">
              Invest in Your Future
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Simple Tier Pricing</h1>
            <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
              One payment unlocks an entire level. Pay with M-Pesa or card in KES.
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {TIERS.map((tier) => {
              const courses = catalog.filter((c) => c.level === tier.level);
              return (
                <div key={tier.id} className="relative flex flex-col">
                  {tier.highlight && (
                    <div className="flex justify-center -mb-px z-10 relative">
                      <span className="bg-[#1A6EF5] text-white text-xs font-bold px-5 py-1.5 rounded-full">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <div
                    className={`flex flex-col flex-1 bg-white rounded-2xl p-7 border-2 transition-shadow ${
                      tier.highlight ? "border-[#1A6EF5] shadow-xl shadow-blue-100" : "border-slate-200 hover:shadow-md"
                    }`}
                  >
                    <h2 className="text-xl font-bold text-slate-900 mb-1">{tier.name}</h2>
                    <p className="text-sm text-slate-500 mb-6">{tier.tagline}</p>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-slate-900">
                          Ksh {tier.priceKes.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        One-time · {courses.length} course{courses.length !== 1 ? "s" : ""}
                      </p>
                    </div>

                    <TierCheckoutButton
                      tier={tier.id}
                      label={`Get ${tier.name} Access`}
                      className={`block w-full text-sm font-semibold text-center py-3 rounded-xl mb-7 transition-colors disabled:opacity-60 ${
                        tier.highlight
                          ? "bg-[#1A6EF5] text-white hover:bg-blue-600"
                          : "bg-slate-900 text-white hover:bg-slate-700"
                      }`}
                    />

                    <ul className="space-y-3">
                      {courses.map((c) => (
                        <li key={c.id} className="flex items-start gap-2.5 text-sm text-slate-700">
                          <svg className="w-4 h-4 text-[#1A6EF5] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          {c.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="bg-slate-50 py-20 border-t border-slate-100">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details key={faq.q} className="group bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-slate-50">
                    <span className="text-sm font-semibold text-slate-900 pr-4">{faq.q}</span>
                    <svg className="w-4 h-4 text-slate-400 shrink-0 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-5">
                    <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
