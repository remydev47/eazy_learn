"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock, Send, Check } from "lucide-react";

const contactInfo = [
  { icon: Mail,    label: "Email",    value: "support@eazytech.com",   href: "mailto:support@eazytech.com" },
  { icon: Phone,   label: "Phone",    value: "+1 (555) 010-4820",      href: "tel:+15550104820" },
  { icon: MapPin,  label: "Address",  value: "Lagos · London · Remote", href: null },
  { icon: Clock,   label: "Support",  value: "Mon–Fri, 9 am–6 pm UTC", href: null },
];

const topics = [
  "Course enquiry",
  "Instructor application",
  "Enterprise / team plans",
  "Technical support",
  "Partnership",
  "Other",
];

type Status = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Page header */}
      <section className="bg-slate-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-[#FF510E]/10 text-[#FF510E] text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            Get in touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">How can we help?</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Whether you have a question, want to teach on EazyTech, or need enterprise pricing — we respond within one business day.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">

            {/* Contact details */}
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Contact details</h2>
              {contactInfo.map((item) => {
                const Icon = item.icon;
                const inner = (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                      <Icon className="w-4.5 h-4.5 text-[#FF510E]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                      <p className="text-sm font-medium text-slate-800">{item.value}</p>
                    </div>
                  </div>
                );
                return item.href ? (
                  <a key={item.label} href={item.href} className="block hover:opacity-80 transition-opacity">
                    {inner}
                  </a>
                ) : (
                  <div key={item.label}>{inner}</div>
                );
              })}

              {/* FAQ nudge */}
              <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-sm font-semibold text-slate-900 mb-1">Looking for quick answers?</p>
                <p className="text-xs text-slate-500 mb-3">
                  Browse our Help Centre for instant answers to the most common questions.
                </p>
                <a
                  href="#"
                  className="text-sm font-semibold text-[#FF510E] hover:underline"
                >
                  Visit Help Centre →
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              {status === "success" ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16 border border-slate-200 rounded-3xl">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                    <Check className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Message sent!</h3>
                  <p className="text-slate-500 max-w-sm">
                    Thanks, {form.name.split(" ")[0]}. We will get back to you at {form.email} within one business day.
                  </p>
                  <button
                    onClick={() => { setForm({ name: "", email: "", topic: "", message: "" }); setStatus("idle"); }}
                    className="mt-8 text-sm font-semibold text-[#FF510E] hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-3xl p-8 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name *</label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={set("name")}
                        placeholder="Jane Smith"
                        className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20 focus:border-[#FF510E]/50 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address *</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={set("email")}
                        placeholder="jane@example.com"
                        className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20 focus:border-[#FF510E]/50 transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Topic *</label>
                    <select
                      required
                      value={form.topic}
                      onChange={set("topic")}
                      className="w-full h-11 border border-slate-200 rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20 focus:border-[#FF510E]/50 transition appearance-none bg-white"
                    >
                      <option value="">Select a topic…</option>
                      {topics.map((t) => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={set("message")}
                      placeholder="Tell us what you need…"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF510E]/20 focus:border-[#FF510E]/50 transition resize-none"
                    />
                  </div>
                  {status === "error" && (
                    <p className="text-sm text-rose-600 bg-rose-50 rounded-xl px-4 py-3">
                      Something went wrong. Please try again or email us directly.
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full h-12 bg-[#FF510E] hover:bg-orange-600 disabled:opacity-60 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    {status === "loading" ? (
                      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send message
                      </>
                    )}
                  </button>
                  <p className="text-xs text-slate-400 text-center">
                    By submitting you agree to our{" "}
                    <a href="/privacy" className="underline hover:text-slate-600">Privacy Policy</a>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
