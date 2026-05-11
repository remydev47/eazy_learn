import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const stats = [
  { value: "84,000+", label: "Learners worldwide" },
  { value: "1,200+",  label: "Courses published" },
  { value: "320+",    label: "Expert instructors" },
  { value: "62",      label: "Countries reached" },
];

const values = [
  {
    title: "Accessible Education",
    body: "We believe quality learning should never be gated by geography or income. Our free tier, flexible pricing, and regional scholarships reflect that commitment.",
    bg: "bg-orange-50",
    accent: "bg-[#FF510E]",
  },
  {
    title: "Practitioner-Led Teaching",
    body: "Every instructor on EazyTech is a verified practitioner — working professionals, academics, and researchers who bring real-world context into every lesson.",
    bg: "bg-slate-50",
    accent: "bg-slate-800",
  },
  {
    title: "Outcomes First",
    body: "We measure success by what learners do after graduation — jobs landed, promotions earned, projects shipped. Completion certificates are the beginning, not the end.",
    bg: "bg-blue-50",
    accent: "bg-blue-600",
  },
];

const team = [
  { name: "Amara Osei",        role: "Co-Founder & CEO",       initials: "AO", color: "bg-[#FF510E]"   },
  { name: "Dr. Lena Fischer",  role: "Head of Curriculum",     initials: "LF", color: "bg-blue-600"    },
  { name: "Marcus Webb",       role: "CTO",                    initials: "MW", color: "bg-slate-800"   },
  { name: "Priya Nair",        role: "Head of Partnerships",   initials: "PN", color: "bg-violet-600"  },
  { name: "Kofi Mensah",       role: "Lead Instructor",        initials: "KM", color: "bg-emerald-600" },
  { name: "Sara Lindqvist",    role: "UX Director",            initials: "SL", color: "bg-amber-500"   },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-slate-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-[#FF510E]/10 text-[#FF510E] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight max-w-3xl mx-auto mb-6">
            We are building the future of professional learning
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            EazyTech was founded on a simple belief: that skill development should be as accessible as the internet itself. We partner with world-class instructors to deliver courses that actually change careers.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
            {stats.map((stat) => (
              <div key={stat.label} className="py-10 px-8 text-center">
                <p className="text-4xl font-bold text-[#FF510E] mb-1">{stat.value}</p>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-bold text-[#FF510E] uppercase tracking-widest">Our Mission</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3 mb-6 leading-snug">
                Closing the gap between learning and doing
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Traditional education often ends at theory. We build courses around real projects, live mentorship, and peer review — so learners arrive at their next opportunity ready to contribute on day one.
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                Since 2022, our instructors have helped learners land roles at leading organisations across tech, finance, design, and education — on every continent.
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 bg-[#FF510E] hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Explore our courses
              </Link>
            </div>
            <div className="relative h-80 rounded-3xl overflow-hidden bg-slate-100">
              <Image
                src="/assets/less4.webp"
                alt="Learning in action"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#FF510E] uppercase tracking-widest">What drives us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3">Our core values</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className={`${v.bg} rounded-3xl p-8`}>
                <div className={`w-3 h-3 rounded-full ${v.accent} mb-5`} />
                <h3 className="text-lg font-bold text-slate-900 mb-3">{v.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#FF510E] uppercase tracking-widest">The people</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-3">Meet the team</h2>
            <p className="text-slate-500 mt-3 max-w-xl mx-auto">
              A distributed team of educators, engineers, and designers united by a passion for learning that works.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 rounded-2xl ${member.color} flex items-center justify-center mb-4`}>
                  <span className="text-white text-xl font-bold">{member.initials}</span>
                </div>
                <h3 className="font-bold text-slate-900">{member.name}</h3>
                <p className="text-sm text-slate-500 mt-0.5">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-20 bg-[#FF510E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to start learning?
          </h2>
          <p className="text-orange-100 mb-8 max-w-xl mx-auto">
            Join over 84,000 learners who are already building the skills that matter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#FF510E] font-bold px-8 py-3.5 rounded-xl hover:bg-orange-50 transition-colors"
            >
              Browse Courses
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white font-semibold px-8 py-3.5 rounded-xl hover:border-white transition-colors"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
