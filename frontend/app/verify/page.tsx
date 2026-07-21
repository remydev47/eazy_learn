import Link from 'next/link'
import { CheckCircle2, XCircle } from 'lucide-react'
import { verifyVerifyToken } from '@/lib/verify-token'
import { moodleAPI } from '@/lib/moodle/client'

export const dynamic = 'force-dynamic'

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  const payload = token ? await verifyVerifyToken(token) : null

  let ok = false
  if (payload) {
    try {
      await moodleAPI.setUserCustomField(payload.userId, 'emailverified', '1')
      ok = true
    } catch (err) {
      console.error('[verify] failed to set emailverified:', err)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm max-w-md w-full p-8 text-center">
        {ok ? (
          <>
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Email verified ✅</h1>
            <p className="text-slate-500 mb-6">Your account is active. You can now sign in and start learning.</p>
            <Link
              href="/login"
              className="inline-block w-full bg-[#1A6EF5] hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            <XCircle className="w-14 h-14 text-rose-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Link invalid or expired</h1>
            <p className="text-slate-500 mb-6">
              This verification link is no longer valid. Try signing up again, or contact support.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Back to sign up
            </Link>
          </>
        )}
      </div>
    </main>
  )
}
