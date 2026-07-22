import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getRevenueTotals, listTransactions } from "@/lib/paystack";
import AdminSidebar from "@/components/dashboard/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminRevenuePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "admin") redirect(`/dashboard/${session.user.role}`);

  const [totals, txns] = await Promise.all([getRevenueTotals(), listTransactions(25)]);
  const success = txns.filter((t) => t.status === "success");

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar active="revenue" />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-900">Revenue</h1>
          <p className="text-slate-500 mt-1 mb-8">Live from Paystack (test mode until live keys are set).</p>

          <div className="grid grid-cols-2 gap-4 mb-10 max-w-md">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-2xl font-bold text-slate-900">Ksh {totals.totalKes.toLocaleString()}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wide mt-0.5">Total revenue</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <p className="text-2xl font-bold text-slate-900">{totals.count.toLocaleString()}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wide mt-0.5">Transactions</p>
            </div>
          </div>

          <h2 className="text-lg font-bold text-slate-900 mb-4">Recent transactions</h2>
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            {txns.length === 0 ? (
              <p className="text-sm text-slate-400 p-6">No transactions yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                      <th className="px-5 py-3 font-semibold">Customer</th>
                      <th className="px-5 py-3 font-semibold">Amount</th>
                      <th className="px-5 py-3 font-semibold">Channel</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                      <th className="px-5 py-3 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {txns.map((t) => (
                      <tr key={t.reference} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                        <td className="px-5 py-3 text-slate-700">{t.email || "—"}</td>
                        <td className="px-5 py-3 font-medium text-slate-900">Ksh {t.amountKes.toLocaleString()}</td>
                        <td className="px-5 py-3 text-slate-500 capitalize">{t.channel || "—"}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${t.status === "success" ? "text-emerald-600 bg-emerald-50" : "text-slate-500 bg-slate-100"}`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-400">
                          {t.paidAt ? new Date(t.paidAt).toLocaleDateString("en-KE", { day: "numeric", month: "short" }) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-4">{success.length} successful of {txns.length} shown.</p>
        </div>
      </main>
    </div>
  );
}
