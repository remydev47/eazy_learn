"use client";

import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Award,
  MessageSquare,
  PlayCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

/* ── Mock data ── */
const deadlines = [
  { title: "UX Research Case Study", due: "Due tomorrow, 11:59 PM", urgent: true },
  { title: "Advanced Figma Quiz", due: "Oct 24, 2024", urgent: false },
];

const enrolledCourses = [
  {
    id: 1,
    title: "Visual Storytelling in Product Design",
    description: "Master the art of emotional connection through digital interfaces.",
    category: "Design",
    progress: 85,
    instructors: ["JD", "ML"],
    image: "/assets/less4.webp",
    moodleId: 1,
  },
  {
    id: 2,
    title: "Growth Marketing Strategy 2024",
    description: "Advanced metrics and scaling techniques for modern startups.",
    category: "Business",
    progress: 12,
    instructors: ["AK"],
    image: "/assets/less3.webp",
    moodleId: 2,
  },
];

const avatarColors = [
  "bg-blue-400", "bg-violet-400", "bg-amber-400", "bg-emerald-400", "bg-rose-400",
];

const navItems = [
  { label: "Dashboard",   href: "/dashboard/student",              icon: LayoutDashboard, active: true },
  { label: "My Courses",  href: "/dashboard/student/courses",      icon: BookOpen },
  { label: "Assignments", href: "/dashboard/student/assignments",  icon: ClipboardList },
  { label: "Certificates",href: "/dashboard/student/certificates", icon: Award },
  { label: "Messages",    href: "/dashboard/student/messages",     icon: MessageSquare },
];

export default function StudentDashboardPage() {
  const moodleUrl = process.env.NEXT_PUBLIC_MOODLE_URL ?? "#";

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── Sidebar ── */}
      <aside className="w-52 shrink-0 bg-white border-r border-slate-100 flex flex-col">
        {/* Brand */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-100">
          <Link href="/">
            <span className="text-xl font-bold text-[#FF510E]">EazyTech</span>
          </Link>
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
            Academic Portal
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-[#FF510E] text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Upcoming Deadlines */}
        <div className="px-4 pb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Upcoming Deadlines
          </p>
          <div className="space-y-2">
            {deadlines.map((d) => (
              <div key={d.title} className="border-l-2 border-[#FF510E] pl-3 py-1">
                <p className="text-xs font-medium text-slate-800 leading-snug">{d.title}</p>
                <p className={`text-xs mt-0.5 ${d.urgent ? "text-rose-500" : "text-slate-400"}`}>
                  {d.due}
                </p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">

          {/* Welcome header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back, Alexander
              </h1>
              <p className="text-slate-500 mt-1">
                You&apos;re making great progress this week. Keep up the momentum!
              </p>
            </div>
            <div className="flex gap-3">
              <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 text-center shadow-sm">
                <p className="text-2xl font-bold text-slate-900">12</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide mt-0.5">Courses</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl px-5 py-3 text-center shadow-sm">
                <p className="text-2xl font-bold text-slate-900">48.5</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide mt-0.5">Hours</p>
              </div>
            </div>
          </div>

          {/* Continue Learning Banner */}
          <div className="relative rounded-2xl overflow-hidden mb-10 min-h-[200px] flex items-center">
            <Image
              src="/assets/less9.webp"
              alt="Continue learning"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/60 to-transparent" />
            <div className="relative z-10 px-8 py-10 max-w-xl">
              <span className="text-xs font-semibold tracking-widest text-[#FF510E] uppercase">
                Continue Learning
              </span>
              <h2 className="text-2xl font-bold text-white mt-2 mb-1">
                Advanced UI Architecture &amp; Design Systems
              </h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-1.5 bg-white/25 rounded-full overflow-hidden max-w-xs">
                  <div className="h-full bg-[#FF510E] rounded-full" style={{ width: "68%" }} />
                </div>
                <span className="text-sm text-white/80">68% Complete</span>
                <span className="text-sm text-white/60">14/22 Lessons</span>
              </div>
              <a
                href={`${moodleUrl}/course/view.php?id=3`}
                className="inline-flex items-center gap-2 bg-[#FF510E] hover:bg-orange-600 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors"
              >
                <PlayCircle className="w-4 h-4" />
                Resume Lesson 15
              </a>
            </div>
          </div>

          {/* My Enrolled Courses */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-900">My Enrolled Courses</h2>
              <Link
                href="/dashboard/student/courses"
                className="text-sm text-[#FF510E] font-medium hover:underline"
              >
                View All →
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition"
                >
                  <div className="relative h-44">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-white/90 text-slate-800 text-xs font-semibold">
                        {course.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 mb-1 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {course.instructors.map((initials, i) => (
                          <div
                            key={i}
                            className={`w-7 h-7 ${avatarColors[i % avatarColors.length]} rounded-full border-2 border-white flex items-center justify-center`}
                          >
                            <span className="text-white text-xs font-semibold">{initials}</span>
                          </div>
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-[#FF510E]">
                        {course.progress}% Complete
                      </span>
                    </div>
                    <Progress
                      value={course.progress}
                      className="mt-3 h-1.5 [&>div]:bg-[#FF510E]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended for You */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-5">Recommended for You</h2>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    Sustainable Leadership Principles
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">
                    Based on your interest in management and ethics. Join 5,000+ professionals this month.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs font-medium border-slate-300 text-slate-600">
                      4.9 ★ Rating
                    </Badge>
                    <Badge variant="outline" className="text-xs font-medium border-slate-300 text-slate-600">
                      8 Modules
                    </Badge>
                    <Badge variant="outline" className="text-xs font-medium border-slate-300 text-slate-600">
                      Intermediate
                    </Badge>
                  </div>
                </div>
                <a
                  href={`${moodleUrl}/course/view.php?id=10`}
                  className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors shrink-0"
                >
                  Enroll Now
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 mt-auto">
          <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between gap-4 text-xs">
            <div>
              <p className="text-white font-bold mb-1">EazyTech</p>
              <p>Empowering the next generation of global learners.</p>
            </div>
            <div className="flex gap-6 items-center">
              <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
              <Link href="/instructors" className="hover:text-white transition-colors">Instructors</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
          <div className="border-t border-slate-800">
            <p className="text-center text-xs text-slate-600 py-4">© 2026 EazyTech. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
