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

export type NavLink = { href: string; label: string; external?: boolean };

export type NavMenu = {
  /** Large links, shown first. */
  primary: NavLink[];
  /** Smaller grouped links beside (desktop) or below (mobile) the primary links. */
  groups: { title: string; links: NavLink[] }[];
};

export type NavItem = NavLink & { menu?: NavMenu };

export const primaryNav: NavItem[] = [
  {
    href: "/work",
    label: "Work",
    menu: {
      primary: [
        { href: "/work", label: "All work" },
        { href: "/work#ev-exec", label: "EV Exec" },
        { href: "/work#boonma", label: "Boonma" },
        { href: "/work#fystay", label: "FYStay" },
        { href: "/work#alex-k-bells", label: "Alex K Bells" },
      ],
      groups: [
        {
          title: "Visit the live sites",
          links: [
            { href: "https://www.evexec.co.uk", label: "evexec.co.uk", external: true },
            { href: "https://boonma.vercel.app", label: "boonma.vercel.app", external: true },
            { href: "https://www.fystay.co.uk", label: "fystay.co.uk", external: true },
            { href: "https://alexkbells.vercel.app", label: "alexkbells.vercel.app", external: true },
          ],
        },
      ],
    },
  },
  {
    href: "/websites",
    label: "Websites",
    menu: {
      primary: [
        { href: "/websites", label: "Explore websites" },
        { href: "/build", label: "Build your website" },
        { href: "/websites#packages", label: "Packages" },
        { href: "/websites#care", label: "Hosting & care" },
      ],
      groups: [
        {
          title: "Packages",
          links: [
            { href: "/websites#packages", label: "Essential" },
            { href: "/websites#packages", label: "Professional" },
            { href: "/websites#packages", label: "Premium" },
          ],
        },
        {
          title: "Get started",
          links: [
            { href: "/build", label: "Instant estimate" },
            { href: "/contact?topic=website", label: "Ask a question" },
          ],
        },
      ],
    },
  },
  {
    href: "/booking-software",
    label: "Booking software",
    menu: {
      primary: [
        { href: "/booking-software", label: "Explore booking software" },
        { href: "/contact?topic=booking-software", label: "Request a demo" },
      ],
      groups: [
        {
          title: "Learn more",
          links: [
            { href: "/booking-software#fit", label: "Is it right for you?" },
            { href: "/booking-software#demo", label: "What a demo covers" },
            { href: "/work#ev-exec", label: "Built for EV Exec" },
          ],
        },
      ],
    },
  },
  {
    href: "/bespoke-systems",
    label: "Bespoke systems",
    menu: {
      primary: [
        { href: "/bespoke-systems", label: "Explore bespoke systems" },
        { href: "/contact?topic=bespoke", label: "Discuss a project" },
      ],
      groups: [
        {
          title: "From our work",
          links: [
            { href: "/bespoke-systems#examples", label: "Examples" },
            { href: "/work#ev-exec", label: "EV Exec booking" },
            { href: "/work#fystay", label: "FYStay platform" },
          ],
        },
      ],
    },
  },
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
