import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const lastUpdated = "May 2026";

const sections = [
  {
    title: "1. Information We Collect",
    body: `We collect information you provide directly when you create an account, enrol in a course, or contact us. This includes your name, email address, and payment information. We also automatically collect certain technical data such as your IP address, browser type, device identifiers, and pages visited on our platform.`,
  },
  {
    title: "2. How We Use Your Information",
    body: `We use the information we collect to provide, maintain, and improve our services; process transactions and send related information including purchase confirmations and invoices; send promotional communications (you may opt out at any time); respond to your comments and questions; and comply with legal obligations.`,
  },
  {
    title: "3. Sharing of Information",
    body: `We do not sell your personal data. We may share your information with third-party vendors who assist us in operating our platform (such as payment processors, email service providers, and analytics tools), all of whom are bound by data processing agreements. We may also share information when required by law or to protect our rights.`,
  },
  {
    title: "4. Cookies",
    body: `We use cookies and similar tracking technologies to track activity on our platform and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.`,
  },
  {
    title: "5. Data Retention",
    body: `We retain your personal data for as long as your account is active or as needed to provide you with our services. You may request deletion of your account and associated data at any time by contacting support@eazytech.com. We will respond within 30 days.`,
  },
  {
    title: "6. Security",
    body: `We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.`,
  },
  {
    title: "7. Your Rights",
    body: `Depending on your location, you may have the right to access, correct, or delete the personal data we hold about you; object to or restrict our processing of your data; and receive a machine-readable copy of your data (data portability). To exercise any of these rights, please contact us at support@eazytech.com.`,
  },
  {
    title: "8. Children's Privacy",
    body: `Our services are not directed to children under the age of 13. We do not knowingly collect personal data from children under 13. If we become aware that a child under 13 has provided us with personal data, we will take steps to delete such information.`,
  },
  {
    title: "9. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of the platform after any changes constitutes your acceptance of the new policy.`,
  },
  {
    title: "10. Contact Us",
    body: `If you have any questions about this Privacy Policy or our data practices, please contact us at: support@eazytech.com or by writing to EazyTech, Legal Department.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <section className="bg-slate-900 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-slate-400 text-sm">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-16 flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-slate-600 leading-relaxed mb-10 text-base">
            EazyTech (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform at ezaytech.com and our associated learning management system.
          </p>

          <div className="space-y-10">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-lg font-bold text-slate-900 mb-3">{s.title}</h2>
                <p className="text-slate-600 leading-relaxed text-[15px]">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-orange-50 rounded-2xl border border-orange-100">
            <p className="text-sm font-semibold text-slate-900 mb-1">Questions about your data?</p>
            <p className="text-sm text-slate-600">
              Email us at{" "}
              <a href="mailto:support@eazytech.com" className="text-[#FF510E] hover:underline font-medium">
                support@eazytech.com
              </a>{" "}
              and we will respond within 2 business days.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
