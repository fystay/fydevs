import type { MetadataRoute } from "next";
import { publicRoutes } from "@/lib/routes";
import { siteUrl } from "@/lib/site";

// Absolute URLs need a confirmed domain; until NEXT_PUBLIC_SITE_URL is set the sitemap is empty.
export default function sitemap(): MetadataRoute.Sitemap {
  const url = siteUrl();
  if (!url) return [];
  return publicRoutes.map((path) => ({ url: `${url}${path === "/" ? "" : path}` }));
}
