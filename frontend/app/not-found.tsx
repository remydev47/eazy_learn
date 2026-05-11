import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  const links = [
    { label: "Browse Courses",    href: "/courses"     },
    { label: "Meet Instructors",  href: "/instructors" },
    { label: "Free Resources",    href: "/resources"   },
    { label: "Pricing",           href: "/pricing"     },
    { label: "About EazyTech",    href: "/about"       },
    { label: "Contact us",        href: "/contact"     },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">

          {/* Large 404 */}
          <div className="relative mb-8">
            <p className="text-[160px] font-black text-slate-100 leading-none select-none">
              404
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-[#FF510E] text-white text-sm font-bold px-5 py-2 rounded-full shadow-lg">
                Page not found
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Looks like this page went off-course
          </h1>
          <p className="text-slate-500 mb-10 max-w-md mx-auto">
            The page you are looking for does not exist, was moved, or the link is broken. Here are some useful places to go instead:
          </p>

          {/* Quick links grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="border border-slate-200 hover:border-[#FF510E]/40 hover:bg-orange-50/50 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:text-[#FF510E] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#FF510E] hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
