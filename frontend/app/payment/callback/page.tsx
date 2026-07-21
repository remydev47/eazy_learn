import Link from 'next/link'
import { CheckCircle2, XCircle } from 'lucide-react'
import { fulfillPayment } from '@/lib/payments'

export const dynamic = 'force-dynamic'

// Paystack redirects here after checkout with ?reference=... (and ?trxref=...).
export default async function PaymentCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>
}) {
  const params = await searchParams
  const reference = params.reference ?? params.trxref

  const result = reference
    ? await fulfillPayment(reference)
    : { ok: false, reason: 'no payment reference' }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm max-w-md w-full p-8 text-center">
        {result.ok ? (
          <>
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">You&apos;re enrolled! 🎉</h1>
            <p className="text-slate-500 mb-6">
              Payment received. You now have access to{" "}
              <strong>all {result.enrolled} {result.tier} courses</strong>. Start learning right away.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard/student"
                className="w-full bg-[#1A6EF5] hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Go to my dashboard
              </Link>
              <Link href="/courses" className="text-sm text-slate-500 hover:text-slate-900">
                Browse courses
              </Link>
            </div>
          </>
        ) : (
          <>
            <XCircle className="w-14 h-14 text-rose-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment not completed</h1>
            <p className="text-slate-500 mb-2">We couldn&apos;t confirm your enrolment.</p>
            <p className="text-xs text-slate-400 mb-6">{result.reason}</p>
            <Link
              href="/courses"
              className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Back to courses
            </Link>
          </>
        )}
      </div>
    </main>
  )
}
