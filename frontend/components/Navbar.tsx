"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const moodleUrl = process.env.NEXT_PUBLIC_MOODLE_URL;

  const loginHref  = moodleUrl ? `${moodleUrl}/login`            : "/demo";
  const signupHref = moodleUrl ? `${moodleUrl}/login/signup.php` : "/demo";

  const links = [
    { label: "Home",        href: "/" },
    { label: "Courses",     href: "/courses" },
    { label: "Instructors", href: "/instructors" },
    { label: "Resources",   href: "/resources" },
    { label: "Pricing",     href: "/pricing" },
    { label: "Dashboards",  href: "/demo" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center shrink-0">
            <span className="text-xl font-bold text-slate-900">Eazy</span>
            <span className="text-xl font-bold text-[#FF510E]">Tech</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href={loginHref}
              className="text-sm text-slate-700 font-medium px-4 py-2 hover:text-slate-900 transition-colors"
            >
              Log In
            </a>
            <a
              href={signupHref}
              className="text-sm bg-[#FF510E] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Get Started
            </a>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-md text-slate-600 hover:text-slate-900"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden py-4 border-t border-slate-100 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm text-slate-600 font-medium py-2.5 px-2 rounded-md hover:bg-slate-50"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-3 border-t border-slate-100 mt-2">
              <a href={loginHref} className="text-sm text-slate-700 font-medium py-2">
                Log In
              </a>
              <a
                href={signupHref}
                className="text-sm bg-[#FF510E] text-white font-semibold px-4 py-2 rounded-lg"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
