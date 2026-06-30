import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data" },
        { status: 400 }
      );
    }

    const { fullName, email, phone, projectLocation, renovationType, message } = parsed.data;

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      console.error("WEB3FORMS_ACCESS_KEY is not set");
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    const payload = {
      access_key: accessKey,
      subject: `New Enquiry from ${fullName} – ${renovationType}`,
      from_name: "Mahaveer Papers Website",
      // Reply-to goes to the person who filled the form
      replyto: email,
      name: fullName,
      email,
      phone: phone || "—",
      location: projectLocation,
      category: renovationType,
      message,
    };

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    if (!result.success) {
      console.error("Web3Forms error:", result);
      return NextResponse.json({ error: "Failed to send" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
