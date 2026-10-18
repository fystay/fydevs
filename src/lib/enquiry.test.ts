import { describe, expect, it } from "vitest";
import { clean, validateEnquiry } from "./enquiry";

const valid = { name: "Ada Lovelace", email: "Ada@Example.co.uk", topic: "website", message: "We need a new website." };

describe("validateEnquiry", () => {
  it("accepts and normalises a valid enquiry", () => {
    const r = validateEnquiry(valid);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.email).toBe("ada@example.co.uk");
  });
  it("reports field errors", () => {
    const r = validateEnquiry({ name: "", email: "nope", message: "short" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["email", "message", "name"]);
  });
  it("allows an empty message when not required", () => {
    expect(validateEnquiry({ ...valid, message: "" }, { messageRequired: false }).ok).toBe(true);
  });
  it("falls back to 'other' for unknown topics, including prototype keys", () => {
    for (const topic of ["nonsense", "constructor", 42]) {
      const r = validateEnquiry({ ...valid, topic });
      expect(r.ok && r.data.topic).toBe("other");
    }
  });
  it("requires budget and timeline only when asked to", () => {
    const r = validateEnquiry({ ...valid, budget: "lots" }, { detailsRequired: true });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errors).sort()).toEqual(["budget", "timeline"]);
    const ok = validateEnquiry({ ...valid, budget: "unsure", timeline: "flexible" }, { detailsRequired: true });
    expect(ok.ok && [ok.data.budget, ok.data.timeline]).toEqual(["unsure", "flexible"]);
    expect(validateEnquiry(valid).ok).toBe(true);
  });

  it("rejects over-long messages", () => {
    expect(validateEnquiry({ ...valid, message: "x".repeat(5001) }).ok).toBe(false);
  });
});

describe("clean", () => {
  it("strips control characters but keeps line breaks", () => {
    expect(clean("  a\u0000b\nc\u0007  ", 100)).toBe("ab\nc");
  });
  it("ignores non-strings", () => {
    expect(clean({}, 10)).toBe("");
  });
});
