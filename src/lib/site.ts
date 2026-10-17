/**
 * Site-wide facts. Only confirmed information belongs here: anything unknown
 * (contact email, social profiles, company registration) is deliberately absent
 * rather than invented. See README §15 "Open Decisions".
 */
export const site = {
  name: "FY Devs",
  shortName: "FYDevs",
  tagline: "Bespoke websites and practical booking software.",
  description:
    "FY Devs designs and builds bespoke websites and booking software for businesses that want considered design, clear pricing and technology that fits how they work.",
  locale: "en_GB",
  themeColor: "#F7F5EF",
} as const;

/**
 * Production origin, e.g. https://example.com. Unset until the domain is confirmed.
 * On Vercel, the project's production URL is used as a fallback.
 */
export function siteUrl(): string | undefined {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || (vercel ? `https://${vercel}` : undefined);
  if (!raw) return undefined;
  try {
    return new URL(raw).origin;
  } catch {
    return undefined;
  }
}

export type NavLink = { href: string; label: string };

export const primaryNav: NavLink[] = [
  { href: "/websites", label: "Websites" },
  { href: "/booking-software", label: "Booking software" },
  { href: "/bespoke-systems", label: "Bespoke systems" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Websites",
    links: [
      { href: "/websites", label: "Services & packages" },
      { href: "/build", label: "Build your website" },
      { href: "/websites#care", label: "Hosting & care" },
      { href: "/work", label: "Our work" },
    ],
  },
  {
    title: "Software",
    links: [
      { href: "/booking-software", label: "Booking software" },
      { href: "/bespoke-systems", label: "Bespoke systems" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
];
