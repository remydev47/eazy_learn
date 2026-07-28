import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPricing, savePricing, DEFAULT_PRICING, type PricingConfig } from '@/lib/pricing'
import type { Level } from '@/lib/courses'

export const dynamic = 'force-dynamic'

async function requireAdmin() {
  const session = await auth()
  return session?.user?.role === 'admin'
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  return NextResponse.json(await getPricing())
}

const LEVELS: Level[] = ['Beginner', 'Intermediate', 'Advanced']
const num = (v: unknown) => Math.max(0, Math.round(Number(v) || 0))

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  let body: Partial<PricingConfig>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }

  // Sanitise into a clean config (never trust raw client input).
  const config: PricingConfig = {
    perCourse: { ...DEFAULT_PRICING.perCourse },
    tier: { ...DEFAULT_PRICING.tier },
    free: Array.isArray(body.free) ? body.free.filter((s): s is string => typeof s === 'string') : DEFAULT_PRICING.free,
  }
  for (const l of LEVELS) {
    if (body.perCourse && body.perCourse[l] != null) config.perCourse[l] = num(body.perCourse[l])
    if (body.tier && body.tier[l] != null) config.tier[l] = num(body.tier[l])
  }

  try {
    await savePricing(config)
    return NextResponse.json({ ok: true, config })
  } catch (err) {
    console.error('[admin/pricing] save failed:', err)
    return NextResponse.json({ error: 'save_failed' }, { status: 502 })
  }
}
