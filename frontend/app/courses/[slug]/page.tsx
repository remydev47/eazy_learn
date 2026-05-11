import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { courses, getCourseBySlug } from "@/lib/courses";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CurriculumAccordion from "@/components/CurriculumAccordion";
import CourseCard from "@/components/CourseCard";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);

  if (!course) notFound();

  const moodleUrl = process.env.NEXT_PUBLIC_MOODLE_URL ?? "#";
  const enrollUrl = course.moodleId
    ? `${moodleUrl}/course/view.php?id=${course.moodleId}`
    : `${moodleUrl}/login/signup.php`;

  const related = courses
    .filter((c) => c.id !== course.id && c.category === course.category)
    .slice(0, 2);

  const promoCards = [
    ...related,
  ];

  const courseIncludes = [
    { icon: "video", label: `${course.duration} on-demand video` },
    { icon: "download", label: `${course.totalLessons} downloadable resources` },
    { icon: "infinity", label: "Full lifetime access" },
    { icon: "mobile", label: "Access on mobile and desktop" },
    { icon: "certificate", label: "Certificate of completion" },
  ];

  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero header ── */}
        <div className="bg-[#1c1c1e] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">
              {/* Left */}
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-[#FF510E]/20 text-[#FF510E] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  TOP RATED COURSE 2024
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
                  {course.title}
                </h1>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-2xl">
                  {course.shortDescription}
                </p>

                {/* Stats row */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    {course.studentCount} Students
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    Multi-language Support
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Verified Certificate
                  </div>
                </div>
              </div>

              {/* Right: course thumbnail */}
              <div className="hidden lg:block relative h-52 rounded-xl overflow-hidden">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                  sizes="360px"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-[1fr_340px] gap-10 items-start">

            {/* ── LEFT column ── */}
            <div className="space-y-10">

              {/* Course Overview */}
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                  <span className="w-1 h-6 bg-[#FF510E] rounded-full inline-block"></span>
                  Course Overview
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">{course.overview}</p>
              </section>

              {/* What you'll learn */}
              <section className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 mb-4">What you&apos;ll learn</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {course.whatYouLearn.map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <svg className="w-4 h-4 text-[#FF510E] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs text-slate-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Course Curriculum */}
              <section>
                <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-3">
                  <span className="w-1 h-6 bg-[#FF510E] rounded-full inline-block"></span>
                  Course Curriculum
                </h2>
                <CurriculumAccordion curriculum={course.curriculum} />
              </section>

              {/* Meet the Instructor */}
              <section className="bg-white border border-slate-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-5">Meet your Instructor</h2>
                <div className="flex gap-5">
                  <div
                    className={`w-16 h-16 ${course.instructor.color} rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0`}
                  >
                    {course.instructor.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{course.instructor.name}</h3>
                    <p className="text-xs font-semibold text-[#FF510E] uppercase tracking-wide mb-3">
                      {course.instructor.title}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">{course.instructor.bio}</p>
                    <div className="flex gap-3 mt-4">
                      <button className="w-8 h-8 border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:border-[#FF510E] hover:text-[#FF510E] transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                      <button className="w-8 h-8 border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 hover:border-[#FF510E] hover:text-[#FF510E] transition-colors">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* ── RIGHT column: Sticky pricing card ── */}
            <div className="lg:sticky lg:top-20">
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-lg">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-3xl font-bold text-slate-900">${course.price}.00</span>
                    <span className="text-base text-slate-400 line-through">${course.originalPrice}.00</span>
                  </div>
                  <p className="text-xs text-emerald-600 font-semibold mb-5">
                    {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% off — limited time offer
                  </p>

                  <a
                    href={enrollUrl}
                    className="block w-full bg-[#FF510E] text-white text-sm font-bold text-center py-3.5 rounded-lg hover:bg-orange-600 transition-colors mb-3"
                  >
                    Enroll Now
                  </a>
                  <button className="block w-full border border-slate-300 text-slate-700 text-sm font-semibold text-center py-3 rounded-lg hover:bg-slate-50 transition-colors">
                    Add to Cart
                  </button>
                </div>

                <div className="p-6">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                    This Course Includes
                  </p>
                  <ul className="space-y-3">
                    {courseIncludes.map((item) => (
                      <li key={item.label} className="flex items-center gap-3 text-xs text-slate-600">
                        <IncludeIcon type={item.icon} />
                        {item.label}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Corporate training CTA */}
                <div className="mx-4 mb-4 bg-slate-50 rounded-lg p-4 flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-200 rounded-lg flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Corporate Training?</p>
                    <Link href="/enterprise" className="text-xs text-[#FF510E] font-medium hover:underline">
                      Get EazyTech for your team
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Related courses ── */}
        {promoCards.length > 0 && (
          <div className="bg-slate-50 border-t border-slate-100 py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Continue your learning journey</h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Curated picks based on your interest in {course.category}.
                  </p>
                </div>
                <Link
                  href="/courses"
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 bg-slate-900 text-white px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Browse Catalog
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {promoCards.map((c) => (
                  <CourseCard key={c.id} course={c} moodleUrl={moodleUrl} />
                ))}

                {/* EazyTech Pro promo card */}
                <div className="bg-[#FF510E] rounded-xl p-7 flex flex-col justify-between text-white">
                  <div>
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-5">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Unlimited Access</h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Unlock all 100+ courses and certifications with a yearly EazyTech Pro subscription.
                    </p>
                  </div>
                  <Link
                    href="/pricing"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:gap-3 transition-all"
                  >
                    Learn about Pro
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function IncludeIcon({ type }: { type: string }) {
  const cls = "w-4 h-4 text-slate-400 shrink-0";
  switch (type) {
    case "video":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "download":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case "infinity":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case "mobile":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    default:
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      );
  }
}
