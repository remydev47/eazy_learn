import 'server-only'
import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret')

interface VerifyPayload {
  userId: number
  email: string
}

/** Sign a short-lived (24h) email-verification token. */
export async function signVerifyToken(payload: VerifyPayload): Promise<string> {
  return new SignJWT({ userId: payload.userId, email: payload.email, purpose: 'email-verify' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}

/** Verify a token; returns the payload or null if invalid/expired. */
export async function verifyVerifyToken(token: string): Promise<VerifyPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret)
    if (payload.purpose !== 'email-verify') return null
    return { userId: Number(payload.userId), email: String(payload.email) }
  } catch {
    return null
  }
}
