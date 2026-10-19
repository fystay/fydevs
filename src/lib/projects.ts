import type { StaticImageData } from "next/image";
import alexDesktop from "../../public/work/alex-desktop.webp";
import alexMobile from "../../public/work/alex-mobile.webp";
import alexPage from "../../public/work/alex-page.webp";
import boonmaDesktop from "../../public/work/boonma-desktop.webp";
import boonmaMobile from "../../public/work/boonma-mobile.webp";
import boonmaPage from "../../public/work/boonma-page.webp";
import evexecDesktop from "../../public/work/evexec-desktop.webp";
import evexecMobile from "../../public/work/evexec-mobile.webp";
import evexecPage from "../../public/work/evexec-page.webp";
import fystayDesktop from "../../public/work/fystay-desktop.webp";
import fystayMobile from "../../public/work/fystay-mobile.webp";
import fystayPage from "../../public/work/fystay-page.webp";

/**
 * Portfolio entries. Every project here was designed and built by FY Devs (confirmed
 * by the owner). Descriptions state only what the live site itself shows: no invented
 * outcomes, metrics or testimonials (README §5, §15). Screenshots are of the live sites.
 */
export type Project = {
  slug: string;
  name: string;
  /** "client" for work built for a business; "product" for platforms FY Devs runs. */
  kind: "client" | "product";
  sector: string;
  location: string;
  /** One line: what the business or product is. */
  summary: string;
  /** The need the project addressed, phrased from what the business does. No invented history. */
  challenge: string;
  /** Our approach, in a sentence or two. */
  solution: string;
  /** What we built, as visible on the live site. */
  built: string[];
  url: string;
  host: string;
  desktop: StaticImageData;
  mobile: StaticImageData;
  /** Full-page capture, used for hover-to-scroll previews. */
  page: StaticImageData;
  /** Short note on the visual identity, to show the range of bespoke work. */
  identity: string;
  /**
   * True only when the live site sends no X-Frame-Options or frame-ancestors header,
   * so it can be previewed in an iframe on request. Re-check if the site's headers change.
   */
  embeddable?: boolean;
};

export const projects: Project[] = [
  {
    slug: "ev-exec",
    name: "EV Exec",
    kind: "client",
    sector: "Executive airport transfers",
    location: "Blackpool & Fylde Coast",
    summary:
      "Fixed-price executive transfers to every UK airport in electric vehicles. The business our driver and operator software was developed for.",
    challenge:
      "Airport transfer customers want a fixed price and a booking they can trust before they travel, and every job needs capturing accurately, including flight details, extra stops and returns.",
    solution:
      "A calm, executive website built around a three-step booking flow, with published fixed prices for every UK airport and customer accounts, alongside driver and operator software developed for the business.",
    built: [
      "Three-step online booking with returns, extra stops and flight details",
      "Customer accounts and booking look-up by reference",
      "Published fixed airport prices and a quote request flow",
      "Area pages across the Fylde Coast",
    ],
    url: "https://www.evexec.co.uk",
    host: "evexec.co.uk",
    desktop: evexecDesktop,
    mobile: evexecMobile,
    page: evexecPage,
    identity: "Dark, executive and calm, with gold used sparingly for action.",
  },
  {
    slug: "boonma",
    name: "Boonma",
    kind: "client",
    sector: "Traditional Thai massage",
    location: "Wallasey, Wirral",
    summary: "An independent Thai massage studio, presented with the warmth and calm of the treatment room.",
    challenge:
      "A traditional Thai massage studio wanted its website to feel like the treatment room, and booking to be simple enough that customers never need to create an account.",
    solution:
      "A warm, editorial site with clear treatments and prices, a gallery and reviews, and a booking flow where customers simply pick a treatment and a time.",
    built: [
      "Treatments and a clear price list",
      "Online booking: pick a treatment and a time, no account needed",
      "Gallery, reviews and the studio's story",
      "Essential-only cookies, with no tracking or advertising",
    ],
    url: "https://boonma.vercel.app",
    host: "boonma.vercel.app",
    desktop: boonmaDesktop,
    mobile: boonmaMobile,
    page: boonmaPage,
    identity: "Warm editorial serif, soft ivory and a deep plum accent.",
    embeddable: true,
  },
  {
    slug: "fystay",
    name: "FYStay",
    kind: "product",
    sector: "Holiday stays platform",
    location: "Blackpool & the Fylde Coast",
    summary:
      "Our own platform for independent holiday homes, apartments and guest houses from local hosts, with the full price shown before you book.",
    challenge:
      "We wanted to give independent Fylde Coast hosts a local place to list their stays, with the full price shown to guests before they book.",
    solution:
      "Our own stays platform, with search by town, dates and guests, local guides for each town, airport transfers that can be added to a booking, and a dashboard for hosts.",
    built: [
      "Stay search by town, dates and guests",
      "Town-by-town local guides and experiences",
      "Airport transfers added to a confirmed booking",
      "Host listings and a host dashboard",
    ],
    url: "https://www.fystay.co.uk",
    host: "fystay.co.uk",
    desktop: fystayDesktop,
    mobile: fystayMobile,
    page: fystayPage,
    identity: "Seaside warmth: terracotta, sand and an app-like mobile tab bar.",
  },
  {
    slug: "alex-k-bells",
    name: "Alex K Bells",
    kind: "client",
    sector: "Kettlebell coaching",
    location: "Cumbernauld",
    summary: "A kettlebell coach offering group classes, one-to-one sessions and online coaching.",
    challenge:
      "A kettlebell coach offering group classes, one-to-one sessions and online coaching needed one place that explains each option and its price, and makes booking straightforward.",
    solution:
      "A bold, monochrome site led by training film, with clear pricing for three ways to train and a simple three-step booking explanation.",
    built: [
      "Three ways to train, each with clear pricing",
      "Full-bleed training video hero",
      "A simple three-step booking explanation",
      "Class times and location details",
    ],
    url: "https://alexkbells.vercel.app",
    host: "alexkbells.vercel.app",
    desktop: alexDesktop,
    mobile: alexMobile,
    page: alexPage,
    identity: "Heavy uppercase type and monochrome film, built for energy.",
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
