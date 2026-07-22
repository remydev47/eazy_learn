import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { moodleAPI } from "@/lib/moodle/client";
import { getCatalog } from "@/lib/moodle/catalog";
import { getTierByLevel } from "@/lib/tiers";
import { isFreeCourse } from "@/lib/free-courses";
import AdminSidebar from "@/components/dashboard/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "admin") redirect(`/dashboard/${session.user.role}`);

  const catalog = await getCatalog();
  const rows = await Promise.all(
    catalog.map(async (c) => {
      let enrolled = 0;
      if (c.moodleId) {
        try {
          const roster = await moodleAPI.getEnrolledStudents(c.moodleId, { revalidate: 120 });
          enrolled = roster.filter((u) => u.roles?.some((r) => r.shortname.toLowerCase() === "student")).length;
        } catch { /* keep 0 */ }
      }
      const tier = getTierByLevel(c.level);
      const price = isFreeCourse(c.slug) ? "Free" : tier ? `Ksh ${tier.priceKes.toLocaleString()}` : "—";
      return { c, enrolled, price };
    }),
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar active="courses" />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-900">Courses</h1>
          <p className="text-slate-500 mt-1 mb-8">{catalog.length} courses. Create/edit content in Moodle admin.</p>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-5 py-3 font-semibold">Course</th>
                    <th className="px-5 py-3 font-semibold">Level</th>
                    <th className="px-5 py-3 font-semibold">Price (tier)</th>
                    <th className="px-5 py-3 font-semibold text-right">Enrolled</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ c, enrolled, price }) => (
                    <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                      <td className="px-5 py-3 font-medium text-slate-800">{c.title}</td>
                      <td className="px-5 py-3 text-slate-500">{c.level}</td>
                      <td className="px-5 py-3 text-slate-500">{price}</td>
                      <td className="px-5 py-3 text-right font-semibold text-slate-900">{enrolled}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
