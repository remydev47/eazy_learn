import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, Video } from "lucide-react";
import { EVENTS, type KcEvent } from "@/lib/events";
import { JITSI_DOMAIN } from "@/lib/live";

export const dynamic = "force-dynamic";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-KE", { hour: "numeric", minute: "2-digit" });
}

export default function EventsPage() {
  const now = Date.now();
  const events = [...EVENTS].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
  const upcoming = events.filter((e) => new Date(e.startsAt).getTime() + e.durationMins * 60000 >= now);

  const joinHref = (e: KcEvent) =>
    e.type === "class" && e.courseSlug
      ? `/live/${e.courseSlug}`
      : e.joinRoom
        ? `https://${JITSI_DOMAIN}/${e.joinRoom}`
        : "#";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-100 py-14 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Events & Webinars</h1>
          <p className="text-slate-500 max-w-md mx-auto text-sm">
            Join our free webinars and live cohort sessions. All sessions run online via Jitsi.
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {upcoming.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium text-slate-500">No upcoming events right now. Check back soon.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcoming.map((e) => (
                <div key={e.id} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="shrink-0 w-full sm:w-32 text-center sm:text-left">
                    <div className="flex items-center gap-1.5 text-[#1A6EF5] text-sm font-semibold justify-center sm:justify-start">
                      <Calendar className="w-4 h-4" /> {fmtDate(e.startsAt)}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1 justify-center sm:justify-start">
                      <Clock className="w-3.5 h-3.5" /> {fmtTime(e.startsAt)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${e.type === "webinar" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-[#1A6EF5]"}`}>
                        {e.type === "webinar" ? "Free Webinar" : "Live Class"}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900">{e.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{e.description}</p>
                  </div>
                  <Link
                    href={joinHref(e)}
                    className="shrink-0 inline-flex items-center gap-2 bg-slate-900 hover:bg-[#1A6EF5] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                  >
                    <Video className="w-4 h-4" /> Join
                  </Link>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-slate-400 text-center mt-10">
            Times shown in East Africa Time (EAT).
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
