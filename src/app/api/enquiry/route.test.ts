import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_ANSWERS } from "@/lib/pricing";
import { POST } from "./route";

let ipCounter = 0;
const post = (body: unknown) =>
  POST(
    new NextRequest("http://localhost/api/enquiry", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": `10.0.0.${++ipCounter}` },
      body: JSON.stringify(body),
    }),
  );

const contact = {
  kind: "contact",
  name: "Ada Lovelace",
  email: "ada@example.com",
  topic: "website",
  message: "We'd like a new website.",
  startedAt: Date.now() - 10_000,
};

describe("POST /api/enquiry", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("ENQUIRY_TO_EMAIL", "inbox@example.com");
    vi.stubEnv("ENQUIRY_FROM_EMAIL", "site@example.com");
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("reports honestly when email delivery isn't configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const res = await post(contact);
    expect(res.status).toBe(503);
    expect((await res.json()).code).toBe("not_configured");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends a valid contact enquiry as plain text with reply-to", async () => {
    const res = await post(contact);
    expect(res.status).toBe(200);
    const [, init] = fetchMock.mock.calls[0];
    const sent = JSON.parse(init.body);
    expect(sent.reply_to).toBe("ada@example.com");
    expect(sent.text).toContain("We'd like a new website.");
    expect(sent.html).toBeUndefined();
  });

  it("recalculates the estimate on the server for briefs", async () => {
    const res = await post({ ...contact, kind: "brief", message: "", answers: { ...DEFAULT_ANSWERS, pageBand: "6-12" } });
    expect(res.status).toBe(200);
    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.text).toContain("Recommended package: Professional");
    expect(sent.text).toContain("£3,800");
  });

  it("rejects invalid fields and unknown answers", async () => {
    expect((await post({ ...contact, email: "nope" })).status).toBe(422);
    expect((await post({ ...contact, kind: "brief", answers: { pageBand: "1000" } })).status).toBe(422);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("silently drops honeypot and too-fast submissions", async () => {
    expect((await post({ ...contact, website: "http://spam" })).status).toBe(200);
    expect((await post({ ...contact, startedAt: Date.now() })).status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("surfaces delivery failures instead of claiming success", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    fetchMock.mockResolvedValue(new Response("{}", { status: 500 }));
    expect((await post(contact)).status).toBe(502);
  });

  it("strips line breaks from the subject", async () => {
    await post({ ...contact, name: "Ada\nBcc: x@y.z" });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).subject).not.toMatch(/\n/);
  });
});
