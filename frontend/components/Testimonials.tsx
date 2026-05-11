const reviews = [
  {
    name: "Alex Thompson",
    role: "Data Analyst, Barclays",
    initials: "AT",
    color: "bg-blue-500",
    rating: 5,
    text: "I'd tried three other platforms before EazyTech. The projects here are the difference — I shipped a real ML pipeline in week four. Had a job offer two months after finishing.",
  },
  {
    name: "Maria Garcia",
    role: "Frontend Developer, Shopify",
    initials: "MG",
    color: "bg-rose-500",
    rating: 5,
    text: "The React & Node.js course is genuinely the best structured course I've taken. Sarah Chen explains the *why* behind every pattern, not just the how. Worth every penny.",
  },
  {
    name: "James Obi",
    role: "Product Designer, Intercom",
    initials: "JO",
    color: "bg-emerald-500",
    rating: 5,
    text: "I completed the UI/UX course while working full time. The pacing was forgiving and the feedback from the community on my portfolio work was extremely useful.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-2">
            Student Stories
          </p>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Loved by 12,000+ Students
          </h2>
          <p className="text-slate-500">Real outcomes from people who committed to learning.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="bg-slate-50 border border-slate-100 rounded-xl p-6 flex flex-col gap-4"
            >
              <div className="flex text-amber-400 text-sm">
                {"★".repeat(r.rating)}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed flex-1">&ldquo;{r.text}&rdquo;</p>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                <div
                  className={`w-9 h-9 ${r.color} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}
                >
                  {r.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{r.name}</p>
                  <p className="text-xs text-slate-400">{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
