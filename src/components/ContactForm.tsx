"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  BUDGETS,
  LIMITS,
  TIMELINES,
  TOPICS,
  validateEnquiry,
  type Budget,
  type FieldErrors,
  type Timeline,
  type Topic,
} from "@/lib/enquiry";
import { useEnquirySubmit } from "./useEnquirySubmit";

const initialTopic = (value: string | null): Topic =>
  value && Object.prototype.hasOwnProperty.call(TOPICS, value) ? (value as Topic) : "website";

type Fields = {
  name: string;
  email: string;
  topic: Topic;
  budget: Budget | "";
  timeline: Timeline | "";
  message: string;
  website: string;
};

function ChipGroup<K extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  error,
}: {
  name: string;
  legend: string;
  options: Record<K, string>;
  value: K | "";
  onChange: (v: K) => void;
  error?: string;
}) {
  return (
    <fieldset className="field chips" aria-describedby={error ? `contact-${name}-error` : undefined}>
      <legend>{legend}</legend>
      <div className="chips__options">
        {(Object.keys(options) as K[]).map((key) => (
          <label key={key} className="chip">
            <input
              type="radio"
              name={`contact-${name}`}
              id={key === Object.keys(options)[0] ? `contact-${name}` : undefined}
              value={key}
              checked={value === key}
              onChange={() => onChange(key)}
            />
            <span>{options[key]}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={`contact-${name}-error`} className="field-error">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function ContactForm() {
  const params = useSearchParams();
  const [fields, setFields] = useState<Fields>({
    name: "",
    email: "",
    topic: initialTopic(params.get("topic")),
    budget: "",
    timeline: "",
    message: "",
    website: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [startedAt] = useState(() => Date.now());
  const { state, submit } = useEnquirySubmit();

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => setFields((f) => ({ ...f, [key]: value }));

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const check = validateEnquiry(fields, { detailsRequired: true });
    if (!check.ok) {
      setErrors(check.errors);
      const first = (["budget", "timeline", "message", "name", "email"] as const).find((k) => check.errors[k]);
      event.currentTarget.querySelector<HTMLElement>(`#contact-${first}`)?.focus();
      return;
    }
    setErrors({});
    await submit({ kind: "contact", ...fields, startedAt });
  };

  if (state.status === "success") {
    return (
      <div className="form-status form-status--success" role="status">
        <strong>Thank you. Your enquiry has been sent.</strong>
        We&apos;ll reply to {fields.email} with next steps.
      </div>
    );
  }

  const allErrors = { ...(state.status === "error" ? state.fields : {}), ...errors };
  const describe = (key: keyof FieldErrors) => (allErrors[key] ? `contact-${key}-error` : undefined);

  return (
    <form className="form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="contact-topic">What do you need?</label>
        <select
          id="contact-topic"
          className="select"
          value={fields.topic}
          onChange={(e) => set("topic", e.target.value as Topic)}
        >
          {(Object.keys(TOPICS) as Topic[]).map((t) => (
            <option key={t} value={t}>
              {TOPICS[t]}
            </option>
          ))}
        </select>
      </div>

      <ChipGroup
        name="budget"
        legend="Budget"
        options={BUDGETS}
        value={fields.budget}
        onChange={(v) => set("budget", v)}
        error={allErrors.budget}
      />

      <ChipGroup
        name="timeline"
        legend="Timeline"
        options={TIMELINES}
        value={fields.timeline}
        onChange={(v) => set("timeline", v)}
        error={allErrors.timeline}
      />

      <div className="field">
        <label htmlFor="contact-message">What are your goals?</label>
        <textarea
          id="contact-message"
          className="textarea"
          rows={5}
          required
          maxLength={LIMITS.message}
          placeholder="For example: more enquiries from local customers, online bookings, or replacing a spreadsheet with proper software."
          value={fields.message}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={allErrors.message ? true : undefined}
          aria-describedby={describe("message")}
        />
        {allErrors.message && (
          <p id="contact-message-error" className="field-error">
            {allErrors.message}
          </p>
        )}
      </div>

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
            onChange={(e) => set("name", e.target.value)}
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
            onChange={(e) => set("email", e.target.value)}
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

      <div className="hp-field" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input
          id="contact-website"
          tabIndex={-1}
          autoComplete="off"
          value={fields.website}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>

      <div aria-live="polite">
        {(state.status === "error" || state.status === "not_configured") && (
          <p className="form-status form-status--error" role="alert">
            {state.status === "not_configured" && <strong>Your enquiry has not been sent.</strong>}
            {state.message}
          </p>
        )}
      </div>

      <p className="fine">
        We use your details only to reply to you. See our <Link href="/privacy">privacy notice</Link>.
      </p>
      <div className="btn-row">
        <button type="submit" className="btn btn--primary" disabled={state.status === "submitting"}>
          {state.status === "submitting" ? "Sending…" : fields.topic === "bespoke" ? "Build My SaaS" : "Start a Project"}
        </button>
      </div>
    </form>
  );
}
