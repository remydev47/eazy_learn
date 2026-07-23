import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { auth } from "@/lib/auth";
import { moodleAPI } from "@/lib/moodle/client";
import StudentSidebar from "@/components/dashboard/StudentSidebar";

export const dynamic = "force-dynamic";

const fallbackImages = ["/assets/less4.webp", "/assets/less3.webp", "/assets/less9.webp"];

export default async function MyCoursesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const raw = await moodleAPI.getEnrolledCourses(session.user.moodleId).catch(() => []);
  const courses = raw.map((c, i) => {
    const isSvg = c.courseimage?.includes("/generated/course.svg") ?? true;
    return {
      id: c.id,
      slug: c.shortname,
      title: c.fullname,
      progress: typeof c.progress === "number" ? Math.round(c.progress) : 0,
      image: isSvg ? fallbackImages[i % fallbackImages.length] : c.courseimage!,
    };
  });

  return (
    <div className="min-h-screen flex bg-gray-50">
      <StudentSidebar active="courses" />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-900">My Courses</h1>
          <p className="text-slate-500 mt-1 mb-8">
            {courses.length === 0 ? "You're not enrolled in any courses yet." : `You're enrolled in ${courses.length} ${courses.length === 1 ? "course" : "courses"}.`}
          </p>

          {courses.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center">
              <p className="text-slate-600 font-medium mb-4">Browse the catalog to enrol in your first course.</p>
              <Link href="/courses" className="inline-block bg-[#1A6EF5] hover:bg-blue-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg">Browse courses</Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                  <div className="relative h-40">
                    <Image src={course.image} alt={course.title} fill className="object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 mb-3 leading-snug">{course.title}</h3>
                    <div className="flex justify-end">
                      <span className="text-sm font-semibold text-[#1A6EF5]">{course.progress}% Complete</span>
                    </div>
                    <Progress value={course.progress} className="mt-2 h-1.5 [&>div]:bg-[#1A6EF5]" />
                    <div className="mt-4 flex gap-2">
                      <Link href={`/learn/${course.slug}`} className="flex-1 text-center text-xs font-semibold bg-slate-900 text-white py-2 rounded-lg hover:bg-slate-800">Course content</Link>
                      <Link href={`/live/${course.slug}`} className="flex-1 text-center text-xs font-semibold border border-[#1A6EF5] text-[#1A6EF5] py-2 rounded-lg hover:bg-blue-50">Join Live Class</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
