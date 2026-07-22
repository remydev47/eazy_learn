import 'server-only'
import nodemailer from 'nodemailer'

const GMAIL_USER = process.env.GMAIL_USER
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD

function transporter() {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    throw new Error('GMAIL_USER / GMAIL_APP_PASSWORD not configured')
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  })
}

const FROM = `KodeClass <${GMAIL_USER}>`

export async function sendVerificationEmail(to: string, firstName: string, verifyUrl: string) {
  const html = `
    <div style="font-family:system-ui,Arial,sans-serif;max-width:520px;margin:0 auto;color:#0f172a">
      <h2 style="color:#1A6EF5">Welcome to KodeClass, ${firstName}!</h2>
      <p>Confirm your email to activate your account and start learning.</p>
      <p style="margin:28px 0">
        <a href="${verifyUrl}" style="background:#1A6EF5;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;display:inline-block">
          Verify my email
        </a>
      </p>
      <p style="color:#64748b;font-size:13px">Or paste this link into your browser:<br>${verifyUrl}</p>
      <p style="color:#94a3b8;font-size:12px;margin-top:24px">This link expires in 24 hours. If you didn't sign up, ignore this email.</p>
    </div>`
  await transporter().sendMail({
    from: FROM,
    to,
    subject: 'Verify your KodeClass email',
    text: `Welcome to KodeClass, ${firstName}! Verify your email: ${verifyUrl}`,
    html,
  })
}

/** Deliver a contact-form submission to the KodeClass inbox. */
export async function sendContactEmail(params: {
  name: string
  email: string
  topic?: string
  message: string
}) {
  const to = process.env.CONTACT_EMAIL || GMAIL_USER
  await transporter().sendMail({
    from: FROM,
    to,
    replyTo: params.email,
    subject: `[KodeClass Contact] ${params.topic || 'Enquiry'} — ${params.name}`,
    text: `From: ${params.name} <${params.email}>\nTopic: ${params.topic || '-'}\n\n${params.message}`,
    html: `<p><strong>Name:</strong> ${params.name}</p><p><strong>Email:</strong> ${params.email}</p><p><strong>Topic:</strong> ${params.topic || '-'}</p><hr/><p>${params.message.replace(/\n/g, '<br>')}</p>`,
  })
}
