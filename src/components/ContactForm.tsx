"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
import { ArrowLeft, ArrowRight } from "./Icons";
import { useEnquirySubmit } from "./useEnquirySubmit";

const isTopic = (value: unknown): value is Topic =>
  typeof value === "string" && Object.prototype.hasOwnProperty.call(TOPICS, value);

type Fields = {
  name: string;
  email: string;
  topic: Topic;
  budget: Budget | "";
  timeline: Timeline | "";
  message: string;
  website: string;
};

type FieldKey = keyof FieldErrors;

const STEPS: { title: string; short: string; fields: FieldKey[] }[] = [
  { title: "Your project", short: "Project", fields: ["topic", "message"] },
  { title: "Budget and timing", short: "Budget", fields: ["budget", "timeline"] },
  { title: "Your details", short: "Details", fields: ["name", "email"] },
  { title: "Review and send", short: "Review", fields: [] },
];
const REVIEW = STEPS.length - 1;

/** A prompt for the goals question that fits what the visitor needs. */
const GOAL_HINTS: Record<Topic, string> = {
  website: "Who are your customers, and what should the website help them do? For example: more local enquiries.",
  redesign: "What isn't working with your current site? Include its address if you can.",
  bespoke: "What should the software do, who will use it, and what do you use today?",
  "booking-software": "How do bookings work today, and what would you like the software to handle?",
  care: "Which site needs looking after, and where is it hosted now?",
  other: "Tell us what you have in mind.",
};

/*
 * Progress is kept for this browser tab only, so a refresh or a detour doesn't lose
 * it. Name and email are never stored; they stay in memory until the form is sent.
 */
const DRAFT_KEY = "fydevs-enquiry-draft";
const SENT_KEY = "fydevs-enquiry-sent";

type Draft = Pick<Fields, "topic" | "budget" | "timeline" | "message">;

function readSession<T>(key: string): T | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeSession(key: string, value: unknown) {
  try {
    if (value === null) window.sessionStorage.removeItem(key);
    else window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Storage unavailable (private mode, blocked). The form still works. */
  }
}

function initialFields(topicParam: string | null): Fields {
  const draft = readSession<Partial<Draft>>(DRAFT_KEY) ?? {};
  return {
    name: "",
    email: "",
    // A ?topic= link reflects what the visitor just chose, so it wins over an older draft.
    topic: isTopic(topicParam) ? topicParam : isTopic(draft.topic) ? draft.topic : "website",
    budget: typeof draft.budget === "string" && draft.budget in BUDGETS ? (draft.budget as Budget) : "",
    timeline: typeof draft.timeline === "string" && draft.timeline in TIMELINES ? (draft.timeline as Timeline) : "",
    message: typeof draft.message === "string" ? draft.message.slice(0, LIMITS.message) : "",
    website: "",
  };
}

function ChipGroup<K extends string>({
  name,
  legend,
  hint,
  options,
  value,
  onChange,
  error,
}: {
  name: string;
  legend: string;
  hint?: string;
  options: Record<K, string>;
  value: K | "";
  onChange: (v: K) => void;
  error?: string;
}) {
  const describedBy = [hint && `contact-${name}-hint`, error && `contact-${name}-error`].filter(Boolean).join(" ");
  return (
    <fieldset className="field chips" aria-describedby={describedBy || undefined}>
      <legend>{legend}</legend>
      {hint && (
        <p id={`contact-${name}-hint`} className="field-hint">
          {hint}
        </p>
      )}
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

/**
 * The enquiry journey: three short steps and a review, then a confirmation with
 * a reference and next steps. Validation matches the server, which has the final say.
 */
export function ContactForm() {
  const params = useSearchParams();
  const [fields, setFields] = useState<Fields>(() => initialFields(params.get("topic")));
  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [startedAt] = useState(() => Date.now());
  const [previous, setPrevious] = useState(() => readSession<{ reference?: string }>(SENT_KEY));
  const { state, submit, reset } = useEnquirySubmit();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    const { topic, budget, timeline, message } = fields;
    writeSession(DRAFT_KEY, { topic, budget, timeline, message });
  }, [fields]);

  // Move focus to the new step's heading, but not on first load.
  useEffect(() => {
    if (moved.current) headingRef.current?.focus();
  }, [step, state.status]);

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key as FieldKey]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const goTo = (next: number) => {
    moved.current = true;
    setStep(next);
    setFurthest((f) => Math.max(f, next));
  };

  const errorsFor = (from: number, to: number) => {
    const check = validateEnquiry(fields, { detailsRequired: true });
    if (check.ok) return {};
    const keys = STEPS.slice(from, to + 1).flatMap((s) => s.fields);
    return Object.fromEntries(Object.entries(check.errors).filter(([k]) => keys.includes(k as FieldKey))) as FieldErrors;
  };

  const focusFirstError = (found: FieldErrors, form: HTMLFormElement) => {
    const first = STEPS[step].fields.find((k) => found[k]);
    if (first) window.requestAnimationFrame(() => form.querySelector<HTMLElement>(`#contact-${first}`)?.focus());
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (step < REVIEW) {
      const found = errorsFor(step, step);
      setErrors(found);
      if (Object.keys(found).length) return focusFirstError(found, form);
      return goTo(step + 1);
    }

    // Review: check everything once more, and send the visitor back to anything missing.
    const all = errorsFor(0, REVIEW);
    if (Object.keys(all).length) {
      setErrors(all);
      return goTo(STEPS.findIndex((s) => s.fields.some((k) => all[k])));
    }
    const result = await submit({ kind: "contact", ...fields, startedAt });
    if (result?.status === "success") {
      writeSession(DRAFT_KEY, null);
      writeSession(SENT_KEY, { reference: result.reference });
      moved.current = true;
    } else if (result?.status === "error" && result.fields) {
      setErrors(result.fields);
      const bad = STEPS.findIndex((s) => s.fields.some((k) => result.fields?.[k]));
      if (bad >= 0) goTo(bad);
    }
  };

  const startAnother = () => {
    writeSession(SENT_KEY, null);
    setPrevious(null);
    setFields((f) => ({ ...f, budget: "", timeline: "", message: "" }));
    setErrors({});
    setStep(0);
    setFurthest(0);
    reset();
  };

  // Confirmation after sending.
  if (state.status === "success") {
    return (
      <div className="onboard-done" role="status">
        <p className="onboard-done__mark" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="m4.5 10.5 3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </p>
        <h2 ref={headingRef} tabIndex={-1} className="h3">
          Thank you. Your enquiry has been sent.
        </h2>
        <p className="muted">
          We&apos;ll reply to <strong>{fields.email}</strong>.
          {state.reference && (
            <>
              {" "}
              Your reference is <strong className="mono">{state.reference}</strong>; quote it if you get in touch about
              this enquiry.
            </>
          )}
        </p>
        <p>
          Next, we&apos;ll review it and reply by email with questions, advice or a suggested next step. If it&apos;s a
          good fit, we&apos;ll arrange a short discovery call, then send you a written scope and fixed price to approve.
          There&apos;s nothing to pay until you do.
        </p>
        <p className="muted small">
          Need to add something? Reply to our email when it arrives, or send another enquiry and mention your
          reference.
        </p>
        <div className="btn-row">
          <Link href="/work" className="btn btn--secondary">
            See our work
          </Link>
          <button type="button" className="btn btn--secondary" onClick={startAnother}>
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  // A returning visitor who already sent an enquiry in this tab.
  if (previous && state.status === "idle") {
    return (
      <div className="onboard-done" role="status">
        <h2 className="h3">You&apos;ve already sent us an enquiry.</h2>
        <p className="muted">
          {previous.reference ? (
            <>
              Your reference is <strong className="mono">{previous.reference}</strong>.{" "}
            </>
          ) : null}
          We&apos;ll reply by email. If there&apos;s something new, you can send another.
        </p>
        <div className="btn-row">
          <button type="button" className="btn btn--primary" onClick={startAnother}>
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  const allErrors = { ...(state.status === "error" ? state.fields : {}), ...errors };
  const describe = (key: FieldKey, hint?: boolean) =>
    [hint && `contact-${key}-hint`, allErrors[key] && `contact-${key}-error`].filter(Boolean).join(" ") || undefined;
  const sending = state.status === "submitting";

  const review: [string, string, number][] = [
    ["What you need", TOPICS[fields.topic], 0],
    ["Your goals", fields.message, 0],
    ["Budget", fields.budget ? BUDGETS[fields.budget] : "", 1],
    ["Timeline", fields.timeline ? TIMELINES[fields.timeline] : "", 1],
    ["Name", fields.name, 2],
    ["Email", fields.email, 2],
  ];

  return (
    <form className="form" onSubmit={onSubmit} noValidate aria-labelledby="onboard-step-title">
      <ol role="list" className="onboard-steps" aria-label="Progress">
        {STEPS.map((s, i) => (
          <li key={s.title} aria-current={i === step ? "step" : undefined} data-done={i < step || undefined}>
            {i <= furthest && i !== step && !sending ? (
              <button type="button" onClick={() => goTo(i)}>
                <span className="onboard-steps__num" aria-hidden="true">
                  {i + 1}
                </span>
                <span>{s.short}</span>
                <span className="visually-hidden">, step {i + 1}: go back to {s.title.toLowerCase()}</span>
              </button>
            ) : (
              <span>
                <span className="onboard-steps__num" aria-hidden="true">
                  {i + 1}
                </span>
                <span>{s.short}</span>
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="onboard-head">
        <p className="onboard-head__count">
          Step {step + 1} of {STEPS.length}
        </p>
        <h2 id="onboard-step-title" ref={headingRef} tabIndex={-1} className="h3">
          {STEPS[step].title}
        </h2>
      </div>

      {step === 0 && (
        <>
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

          <div className="field">
            <label htmlFor="contact-message">What are your goals?</label>
            <p id="contact-message-hint" className="field-hint">
              A few sentences is plenty. This is how we work out whether, and how, we can help.
            </p>
            <textarea
              id="contact-message"
              className="textarea"
              rows={5}
              required
              maxLength={LIMITS.message}
              placeholder={GOAL_HINTS[fields.topic]}
              value={fields.message}
              onChange={(e) => set("message", e.target.value)}
              aria-invalid={allErrors.message ? true : undefined}
              aria-describedby={describe("message", true)}
            />
            {allErrors.message && (
              <p id="contact-message-error" className="field-error">
                {allErrors.message}
              </p>
            )}
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <ChipGroup
            name="budget"
            legend="Budget"
            hint="A rough range helps us suggest the right approach. “Not sure yet” is fine."
            options={BUDGETS}
            value={fields.budget}
            onChange={(v) => set("budget", v)}
            error={allErrors.budget}
          />
          <ChipGroup
            name="timeline"
            legend="Timeline"
            hint="When would you like this to be live?"
            options={TIMELINES}
            value={fields.timeline}
            onChange={(v) => set("timeline", v)}
            error={allErrors.timeline}
          />
        </>
      )}

      {step === 2 && (
        <>
          <p className="field-hint">We only use these to reply to you.</p>
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
                inputMode="email"
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
        </>
      )}

      {step === REVIEW && (
        <>
          <p className="field-hint">Check everything looks right. You can change anything before sending.</p>
          <dl className="review-list">
            {review.map(([label, value, target]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value || <span className="muted">Not given</span>}</dd>
                <button
                  type="button"
                  className="review-list__edit"
                  onClick={() => goTo(target)}
                  disabled={sending}
                  aria-label={`Change ${label.toLowerCase()}`}
                >
                  Change
                </button>
              </div>
            ))}
          </dl>
          <p className="fine">
            We use your details only to reply to you. See our <Link href="/privacy">privacy notice</Link>.
          </p>
        </>
      )}

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

      <div className="onboard-nav">
        {step > 0 && (
          <button type="button" className="btn btn--secondary" onClick={() => goTo(step - 1)} disabled={sending}>
            <ArrowLeft />
            Back
          </button>
        )}
        <button type="submit" className="btn btn--primary" disabled={sending} aria-busy={sending || undefined}>
          {step < REVIEW ? (
            <>
              Continue
              <ArrowRight />
            </>
          ) : sending ? (
            "Sending…"
          ) : (
            "Send enquiry"
          )}
        </button>
      </div>
    </form>
  );
}
