import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const lastUpdated = "May 2026";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using the EazyTech platform, you agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, please do not use our services. We reserve the right to update these terms at any time, with changes effective upon posting.`,
  },
  {
    title: "2. Eligibility",
    body: `You must be at least 13 years of age to use EazyTech. By using the platform, you represent and warrant that you meet this age requirement. If you are using the platform on behalf of an organisation, you represent that you have the authority to bind that organisation to these terms.`,
  },
  {
    title: "3. User Accounts",
    body: `You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorised use of your account. EazyTech will not be liable for any loss or damage arising from your failure to protect your account credentials.`,
  },
  {
    title: "4. Course Enrolment and Access",
    body: `Upon purchasing a course, you are granted a limited, non-exclusive, non-transferable licence to access and view the course content for personal, non-commercial purposes. Course access is subject to the platform remaining in operation and your account remaining in good standing.`,
  },
  {
    title: "5. Refund Policy",
    body: `We offer a 14-day money-back guarantee on all course purchases. If you are not satisfied with your course, contact support@eazytech.com within 14 days of purchase for a full refund. Refunds will not be issued if more than 50% of the course content has been consumed. Refunds are processed within 5–10 business days.`,
  },
  {
    title: "6. Intellectual Property",
    body: `All content on the EazyTech platform, including but not limited to video lectures, course materials, assessments, and platform design, is owned by EazyTech or its content providers and is protected by copyright and intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.`,
  },
  {
    title: "7. Instructor Terms",
    body: `Instructors who publish courses on EazyTech agree to provide accurate course information, own or have rights to all submitted content, and comply with our content quality standards. EazyTech retains a platform fee of 30% on all course sales. Earnings are disbursed monthly to verified instructor accounts.`,
  },
  {
    title: "8. Prohibited Conduct",
    body: `You agree not to: share your account credentials with others; use the platform for unlawful purposes; upload or transmit viruses or malicious code; scrape, crawl, or otherwise automatically collect content from the platform; or interfere with the security or proper functioning of the platform.`,
  },
  {
    title: "9. Disclaimer of Warranties",
    body: `The platform is provided on an "as is" and "as available" basis. EazyTech makes no warranties, expressed or implied, including warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the platform will be uninterrupted, error-free, or secure.`,
  },
  {
    title: "10. Limitation of Liability",
    body: `To the fullest extent permitted by law, EazyTech shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenue, whether incurred directly or indirectly, or any loss of data or goodwill, arising from your use of the platform.`,
  },
  {
    title: "11. Governing Law",
    body: `These Terms shall be governed by and construed in accordance with applicable law. Any disputes arising from these Terms or your use of the platform shall be subject to the exclusive jurisdiction of the courts in the applicable jurisdiction.`,
  },
  {
    title: "12. Contact",
    body: `For questions about these Terms, please contact us at: support@eazytech.com`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <section className="bg-slate-900 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-3">Terms of Use</h1>
          <p className="text-slate-400 text-sm">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-16 flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-slate-600 leading-relaxed mb-10 text-base">
            Please read these Terms of Use carefully before using EazyTech. These terms constitute a legally binding agreement between you and EazyTech governing your use of our website and learning management platform.
          </p>

          <div className="space-y-10">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-lg font-bold text-slate-900 mb-3">{s.title}</h2>
                <p className="text-slate-600 leading-relaxed text-[15px]">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-sm font-semibold text-slate-900 mb-1">Legal enquiries</p>
            <p className="text-sm text-slate-600">
              For legal questions, contact us at{" "}
              <a href="mailto:support@eazytech.com" className="text-[#FF510E] hover:underline font-medium">
                support@eazytech.com
              </a>
              . We respond to all legal enquiries within 5 business days.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
