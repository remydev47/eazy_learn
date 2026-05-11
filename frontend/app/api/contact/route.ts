import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, topic, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "contact@eazytech.com",
          to: process.env.CONTACT_EMAIL ?? "admin@eazytech.com",
          subject: `[EazyTech Contact] ${topic || "Enquiry"} from ${name}`,
          html: `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Topic:</strong> ${topic}</p>
            <hr />
            <p>${message.replace(/\n/g, "<br>")}</p>
          `,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
