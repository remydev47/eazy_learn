import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getCatalog, getCatalogCourseBySlug } from "@/lib/moodle/catalog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CurriculumAccordion from "@/components/CurriculumAccordion";
import CourseCard from "@/components/CourseCard";
import TierCheckoutButton from "@/components/TierCheckoutButton";
import CourseCheckoutButton from "@/components/CourseCheckoutButton";
import FreeEnrollButton from "@/components/FreeEnrollButton";
import { getTierByLevel } from "@/lib/tiers";
import { isFreeCourse } from "@/lib/free-courses";

// ISR: detail pages refresh hourly. New courses added to Moodle after deploy
// render on demand (dynamicParams defaults to true).
export const revalidate = 3600;

export async function generateStaticParams() {
  // Pre-render slugs that exist at build time. New courses added in Moodle
  // after deploy will still render on-demand thanks to dynamic params.
  try {
    const catalog = await getCatalog();
    return catalog.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = await getCatalogCourseBySlug(slug);

  if (!course) notFound();

  const moodleUrl = process.env.NEXT_PUBLIC_MOODLE_URL ?? "#";
  const tier = getTierByLevel(course.level);
  const free = isFreeCourse(course.slug);

  // "Continue your learning journey" — pick two other courses from the same
  // category. Cheap because getCatalog is cached.
  const catalog = await getCatalog();
  const related = catalog
    .filter((c) => c.id !== course.id && c.category === course.category)
    .slice(0, 2);

  const promoCards = [...related];

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
                <div className="inline-flex items-center gap-2 bg-[#1A6EF5]/20 text-[#1A6EF5] text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
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
                  <span className="w-1 h-6 bg-[#1A6EF5] rounded-full inline-block"></span>
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
                      <svg className="w-4 h-4 text-[#1A6EF5] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <span className="w-1 h-6 bg-[#1A6EF5] rounded-full inline-block"></span>
                  Course Curriculum
                </h2>
                <CurriculumAccordion curriculum={course.curriculum} />
              </section>

              {/* Instructor section hidden for now (client request); instructor data
                  still lives in lib/course-metadata.ts for when it's re-enabled. */}
            </div>

            {/* ── RIGHT column: Sticky pricing card ── */}
            <div className="lg:sticky lg:top-20">
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-lg">
                <div className="p-6 border-b border-slate-100">
                  {free ? (
                    <>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-3xl font-bold text-emerald-600">Free</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-5">
                        This course is free — enrol and start learning right away.
                      </p>
                      <FreeEnrollButton slug={course.slug} />
                    </>
                  ) : tier ? (
                    <>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">This course</p>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-3xl font-bold text-slate-900">Ksh {tier.coursePriceKes.toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">One-time payment for this single course.</p>
                      <CourseCheckoutButton
                        slug={course.slug}
                        label="Buy this course"
                        className="block w-full bg-[#1A6EF5] text-white text-sm font-bold text-center py-3.5 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-60"
                      />

                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-2">
                          Or get <strong>all {tier.name} courses</strong> for <strong>Ksh {tier.priceKes.toLocaleString()}</strong>:
                        </p>
                        <TierCheckoutButton
                          tier={tier.id}
                          label={`Get all ${tier.name} courses`}
                          className="block w-full border border-[#1A6EF5] text-[#1A6EF5] text-sm font-bold text-center py-2.5 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-60"
                        />
                      </div>
                    </>
                  ) : (
                    <a href="/pricing" className="block w-full bg-[#1A6EF5] text-white text-sm font-bold text-center py-3.5 rounded-lg hover:bg-blue-600 transition-colors">
                      View Pricing
                    </a>
                  )}
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
                    <Link href="/enterprise" className="text-xs text-[#1A6EF5] font-medium hover:underline">
                      Get KodeClass for your team
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

                {/* KodeClass Pro promo card */}
                <div className="bg-[#1A6EF5] rounded-xl p-7 flex flex-col justify-between text-white">
                  <div>
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-5">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Unlimited Access</h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Unlock all 100+ courses and certifications with a yearly KodeClass Pro subscription.
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
