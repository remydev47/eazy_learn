import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PlayCircle } from "lucide-react";
import { DEMO_VIDEOS, BLOG_POSTS } from "@/lib/demos";

export const metadata = { title: "Demos & Blog — KodeClass" };

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" });
}

export default function DemosPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50">
        <div className="bg-white border-b border-slate-100 py-14 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Demos & Insights</h1>
          <p className="text-slate-500 max-w-md mx-auto text-sm">
            See the platform in action, and read our take on learning tech in Kenya.
          </p>
        </div>

        {/* Demo videos */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Video Demos</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {DEMO_VIDEOS.map((v) => (
              <div key={v.id} className="bg-white border border-slate-100 rounded-xl overflow-hidden">
                <div className="relative aspect-video bg-slate-900">
                  {v.youtubeId ? (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${v.youtubeId}`}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60 bg-gradient-to-br from-slate-800 to-slate-900">
                      <PlayCircle className="w-12 h-12 mb-2" />
                      <span className="text-xs">Video coming soon</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{v.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{v.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Blog */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">From the Blog</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {BLOG_POSTS.map((p) => (
              <article key={p.id} className="bg-white border border-slate-100 rounded-xl p-6 flex flex-col">
                <p className="text-xs text-slate-400 mb-2">{fmt(p.date)} · {p.readMins} min read</p>
                <h3 className="font-bold text-slate-900 mb-2 leading-snug">{p.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">{p.excerpt}</p>
                <span className="text-sm font-semibold text-[#1A6EF5] mt-4">Read more →</span>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
