"use client";

import { useCallback, useState } from "react";
import type { FieldErrors } from "@/lib/enquiry";

export type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "not_configured"; message: string }
  | { status: "error"; message: string; fields?: FieldErrors };

/** Posts to /api/enquiry and reports what actually happened; success is only shown on a 2xx. */
export function useEnquirySubmit() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });

  const submit = useCallback(async (payload: Record<string, unknown>) => {
    setState({ status: "submitting" });
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        code?: string;
        fields?: FieldErrors;
      };
      if (res.ok) {
        setState({ status: "success" });
      } else if (data.code === "not_configured") {
        setState({ status: "not_configured", message: data.error ?? "Online enquiries aren't connected yet." });
      } else {
        setState({
          status: "error",
          message: data.error ?? "Something went wrong. Please try again.",
          fields: data.fields,
        });
      }
    } catch {
      setState({ status: "error", message: "We couldn't reach the server. Check your connection and try again." });
    }
  }, []);

  return { state, submit, reset: () => setState({ status: "idle" }) };
}
