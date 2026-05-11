const steps = [
  {
    number: "1",
    title: "Explore",
    description:
      "Browse our catalog of 100+ expert-led courses. Filter by category, difficulty, or duration to find your perfect match.",
  },
  {
    number: "2",
    title: "Enroll & Learn",
    description:
      "Purchase once, access forever. Work through structured modules at your own pace with video lectures, quizzes, and hands-on projects.",
  },
  {
    number: "3",
    title: "Earn Your Certificate",
    description:
      "Complete the course and receive a verifiable certificate. Share it on LinkedIn or attach it directly to your job applications.",
  },
];

export default function PathToMastery() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-2">
            How It Works
          </p>
          <h2 className="text-3xl font-bold text-slate-900">Your Path to Mastery</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-xl p-7 border border-slate-100 flex flex-col gap-4"
            >
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-base shrink-0">
                {step.number}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
