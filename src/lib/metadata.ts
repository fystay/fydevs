import type { Metadata } from "next";
import { site, siteUrl } from "./site";

/** Per-page metadata. Canonical URLs are emitted only once the production domain is configured. */
export function pageMetadata(path: string, title: string, description: string): Metadata {
  const hasDomain = Boolean(siteUrl());
  return {
    title,
    description,
    ...(hasDomain && { alternates: { canonical: path } }),
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: site.locale,
      title: `${title} | ${site.name}`,
      description,
      ...(hasDomain && { url: path }),
    },
  };
}
