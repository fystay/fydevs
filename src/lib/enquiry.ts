/**
 * Shared shape and validation for enquiries (contact form and project briefs).
 * The client uses the same rules for inline feedback; the server is authoritative.
 */

export const TOPICS = {
  website: "A new website",
  "booking-software": "Booking software",
  bespoke: "A bespoke system",
  care: "Hosting or maintenance",
  other: "Something else",
} as const;
export type Topic = keyof typeof TOPICS;

export const LIMITS = {
  name: 100,
  email: 254,
  company: 120,
  message: 5000,
  launchDate: 60,
} as const;

/** Submissions faster than this after the form renders are treated as automated. */
export const MIN_FILL_MS = 2500;

export type EnquiryFields = {
  name: string;
  email: string;
  company: string;
  topic: Topic;
  message: string;
};

export type FieldErrors = Partial<Record<keyof EnquiryFields, string>>;

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

/** Removes control characters (keeps newlines and tabs) and trims. */
export function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
}

export function validateEnquiry(
  input: Record<string, unknown>,
  opts: { messageRequired?: boolean } = {},
): { ok: true; data: EnquiryFields } | { ok: false; errors: FieldErrors } {
  const messageRequired = opts.messageRequired ?? true;
  const data: EnquiryFields = {
    name: clean(input.name, LIMITS.name),
    email: clean(input.email, LIMITS.email).toLowerCase(),
    company: clean(input.company, LIMITS.company),
    topic: (typeof input.topic === "string" && Object.prototype.hasOwnProperty.call(TOPICS, input.topic) ? input.topic : "other") as Topic,
    message: clean(input.message, LIMITS.message),
  };
  const errors: FieldErrors = {};
  if (data.name.length < 2) errors.name = "Please tell us your name.";
  if (!EMAIL_RE.test(data.email)) errors.email = "Please enter a valid email address.";
  if (messageRequired && data.message.length < 10) {
    errors.message = "Please add a little more detail (at least 10 characters).";
  }
  if (typeof input.message === "string" && input.message.length > LIMITS.message) {
    errors.message = `Please keep your message under ${LIMITS.message.toLocaleString("en-GB")} characters.`;
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
