import Link from "next/link";
import Image from "next/image";

export default function HeroSection() {

  const modules = [
    { label: "Building REST APIs", done: true },
    { label: "Auth & JWT Tokens", done: true },
    { label: "React State Management", done: false },
  ];

  const avatarColors = ["bg-blue-400", "bg-purple-400", "bg-amber-400", "bg-emerald-400"];

  return (
    <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-16 pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 text-sm mb-8 shadow-sm">
              <span className="text-amber-400 tracking-tight">★★★★★</span>
              <span className="text-slate-600">4.8 · rated by 12,000+ students</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.1] tracking-tight mb-6">
              Build Real Skills<br />
              With{" "}
              <span className="text-blue-600">Expert-Led</span>
              <br />
              Courses
            </h1>

            <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-lg">
              Master the most in-demand tech skills with courses built for career
              outcomes — real projects, live feedback, and certificates that matter.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/courses"
                className="inline-flex items-center bg-blue-600 text-white font-semibold px-6 py-3.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Explore Courses
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-3 font-semibold px-6 py-3.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors text-sm"
              >
                <span className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                Watch Demo
              </Link>
            </div>
          </div>

          {/* Right: Course preview card */}
          <div className="relative hidden lg:flex justify-center">
            <div className="relative">
              {/* Main card */}
              <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200 p-5 w-80 border border-slate-100">
                {/* Thumbnail */}
                <Image src="/assets/hero.png" alt="React & Node.js Bootcamp" width={300} height={300} />  

                <h3 className="font-bold text-slate-900 text-sm mb-0.5">React & Node.js Bootcamp</h3>
                <p className="text-xs text-slate-400 mb-4">Instructor: Sarah Chen</p>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>Your Progress</span>
                    <span className="font-semibold text-blue-600">68%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: "68%" }} />
                  </div>
                </div>

                <div className="space-y-2">
                  {modules.map((m) => (
                    <div key={m.label} className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-full shrink-0 flex items-center justify-center ${
                          m.done ? "bg-blue-600" : "bg-slate-100"
                        }`}
                      >
                        {m.done && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-xs ${m.done ? "text-slate-700" : "text-slate-400"}`}>
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating: hours stat */}
              <div className="absolute -top-5 -right-6 bg-white rounded-xl shadow-lg border border-slate-100 px-4 py-3 text-center">
                <p className="text-2xl font-bold text-slate-900">4k+</p>
                <p className="text-xs text-slate-500">hours of content</p>
              </div>

              {/* Floating: students enrolled */}
              <div className="absolute -bottom-5 -left-6 bg-white rounded-xl shadow-lg border border-slate-100 px-4 py-3 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {avatarColors.map((c, i) => (
                    <div key={i} className={`w-7 h-7 ${c} rounded-full border-2 border-white`} />
                  ))}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">12,000+</p>
                  <p className="text-xs text-slate-500">students enrolled</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
