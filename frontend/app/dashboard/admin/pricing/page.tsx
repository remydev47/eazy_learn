import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getPricing } from "@/lib/pricing";
import { getCatalog } from "@/lib/moodle/catalog";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import PricingEditor from "@/components/dashboard/PricingEditor";

export const dynamic = "force-dynamic";

export default async function AdminPricingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "admin") redirect(`/dashboard/${session.user.role}`);

  const [pricing, catalog] = await Promise.all([getPricing(), getCatalog()]);
  const courses = catalog.map((c) => ({ slug: c.slug, title: c.title, level: c.level }));

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar active="pricing" />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-900">Pricing</h1>
          <p className="text-slate-500 mt-1 mb-8">Set single-course and tier prices, and mark courses free. Saved to Moodle and applied across the site.</p>
          <PricingEditor initial={pricing} courses={courses} />
        </div>
      </main>
    </div>
  );
}
