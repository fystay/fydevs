"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { LIMITS, TOPICS, validateEnquiry, type FieldErrors, type Topic } from "@/lib/enquiry";
import { useEnquirySubmit } from "./useEnquirySubmit";

const initialTopic = (value: string | null): Topic =>
  value && Object.prototype.hasOwnProperty.call(TOPICS, value) ? (value as Topic) : "website";

export function ContactForm() {
  const params = useSearchParams();
  const [fields, setFields] = useState({
    name: "",
    email: "",
    company: "",
    topic: initialTopic(params.get("topic")),
    message: "",
    website: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [startedAt] = useState(() => Date.now());
  const { state, submit } = useEnquirySubmit();

  const update = (key: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const check = validateEnquiry(fields);
    if (!check.ok) {
      setErrors(check.errors);
      const first = Object.keys(check.errors)[0];
      event.currentTarget.querySelector<HTMLElement>(`#contact-${first}`)?.focus();
      return;
    }
    setErrors({});
    await submit({ kind: "contact", ...fields, startedAt });
  };

  if (state.status === "success") {
    return (
      <div className="form-status form-status--success" role="status">
        <strong>Thank you. Your message has been sent.</strong>
        We&apos;ll reply to {fields.email} as soon as we can.
      </div>
    );
  }

  const allErrors = { ...(state.status === "error" ? state.fields : {}), ...errors };
  const describe = (key: keyof FieldErrors) => (allErrors[key] ? `contact-${key}-error` : undefined);

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="form-row">
        <div className="field">
          <label htmlFor="contact-name">Your name</label>
          <input
            id="contact-name"
            className="input"
            autoComplete="name"
            required
            maxLength={LIMITS.name}
            value={fields.name}
            onChange={update("name")}
            aria-invalid={allErrors.name ? true : undefined}
            aria-describedby={describe("name")}
          />
          {allErrors.name && (
            <p id="contact-name-error" className="field-error">
              {allErrors.name}
            </p>
          )}
        </div>
        <div className="field">
          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            className="input"
            type="email"
            autoComplete="email"
            required
            maxLength={LIMITS.email}
            value={fields.email}
            onChange={update("email")}
            aria-invalid={allErrors.email ? true : undefined}
            aria-describedby={describe("email")}
          />
          {allErrors.email && (
            <p id="contact-email-error" className="field-error">
              {allErrors.email}
            </p>
          )}
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="contact-company">
            Business name <span className="optional">(optional)</span>
          </label>
          <input
            id="contact-company"
            className="input"
            autoComplete="organization"
            maxLength={LIMITS.company}
            value={fields.company}
            onChange={update("company")}
          />
        </div>
        <div className="field">
          <label htmlFor="contact-topic">What&apos;s it about?</label>
          <select id="contact-topic" className="select" value={fields.topic} onChange={update("topic")}>
            {(Object.keys(TOPICS) as Topic[]).map((t) => (
              <option key={t} value={t}>
                {TOPICS[t]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          className="textarea"
          rows={6}
          required
          maxLength={LIMITS.message}
          value={fields.message}
          onChange={update("message")}
          aria-invalid={allErrors.message ? true : undefined}
          aria-describedby={describe("message")}
        />
        {allErrors.message && (
          <p id="contact-message-error" className="field-error">
            {allErrors.message}
          </p>
        )}
      </div>
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" tabIndex={-1} autoComplete="off" value={fields.website} onChange={update("website")} />
      </div>

      <div aria-live="polite">
        {(state.status === "error" || state.status === "not_configured") && (
          <p className="form-status form-status--error" role="alert">
            {state.status === "not_configured" && <strong>Your message has not been sent.</strong>}
            {state.message}
          </p>
        )}
      </div>

      <p className="fine">
        We use your details only to reply to you. See our <Link href="/privacy">privacy notice</Link>.
      </p>
      <div className="btn-row">
        <button type="submit" className="btn btn--primary" disabled={state.status === "submitting"}>
          {state.status === "submitting" ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
