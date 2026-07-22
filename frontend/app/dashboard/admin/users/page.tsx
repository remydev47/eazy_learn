import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { moodleAPI } from "@/lib/moodle/client";
import AdminSidebar from "@/components/dashboard/AdminSidebar";

export const dynamic = "force-dynamic";

function fmtAccess(ts?: number) {
  if (!ts) return "Never";
  const d = Date.now() / 1000 - ts;
  if (d < 3600) return "Just now";
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  if (d < 2592000) return `${Math.floor(d / 86400)}d ago`;
  return new Date(ts * 1000).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "admin") redirect(`/dashboard/${session.user.role}`);

  const resp = await moodleAPI.getAllUsers({ revalidate: 30 }).catch(() => ({ users: [] }));
  const users = (resp.users ?? []).filter((u) => u.id !== 1).sort((a, b) => b.id - a.id);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar active="users" />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
          <p className="text-slate-500 mt-1 mb-8">{users.length} registered {users.length === 1 ? "user" : "users"}.</p>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                    <th className="px-5 py-3 font-semibold">Name</th>
                    <th className="px-5 py-3 font-semibold">Email</th>
                    <th className="px-5 py-3 font-semibold">Last active</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                      <td className="px-5 py-3 font-medium text-slate-800">{u.fullname}</td>
                      <td className="px-5 py-3 text-slate-500">{u.email}</td>
                      <td className="px-5 py-3 text-slate-500">{fmtAccess(u.lastaccess)}</td>
                      <td className="px-5 py-3">
                        {u.suspended ? (
                          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">Suspended</span>
                        ) : u.confirmed === false ? (
                          <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Unconfirmed</span>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            User management actions (roles, suspend) are done in Moodle admin for now.
          </p>
        </div>
      </main>
    </div>
  );
}
