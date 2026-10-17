import "server-only";

/**
 * Delivers enquiries to the business inbox through Resend's HTTP API.
 * Configuration lives in server-only environment variables (see .env.example).
 * Messages are sent as plain text, so visitor input is never rendered as HTML.
 */

type MailConfig = { apiKey: string; to: string; from: string };

export function mailConfig(): MailConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.ENQUIRY_TO_EMAIL?.trim();
  const from = process.env.ENQUIRY_FROM_EMAIL?.trim();
  return apiKey && to && from ? { apiKey, to, from } : null;
}

export async function sendEnquiryEmail(
  config: MailConfig,
  message: { subject: string; text: string; replyTo: string },
): Promise<boolean> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        reply_to: message.replyTo,
        subject: message.subject,
        text: message.text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      // Log status only: the response body may echo personal data.
      console.error(`Enquiry delivery failed with status ${res.status}`);
    }
    return res.ok;
  } catch (error) {
    console.error("Enquiry delivery failed:", error instanceof Error ? error.name : "unknown error");
    return false;
  }
}
