/**
 * Portfolio entries. Add a project only with the client's permission and with
 * outcomes that can be verified (README §5, §15). Images go in /public/work.
 */
export type Project = {
  slug: string;
  name: string;
  sector: string;
  summary: string;
  problem: string;
  solution: string;
  /** Verified outcomes only. Leave empty rather than estimate. */
  outcomes: string[];
  image?: { src: string; alt: string; width: number; height: number };
  url?: string;
};

export const projects: Project[] = [];
