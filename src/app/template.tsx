import { ViewTransition, type ReactNode } from "react";

/**
 * Re-mounts on every navigation, so pages reached from the header menu can
 * cross-fade: the old page fades out quickly, the new one settles in. Other
 * navigations (in-page links, browser back) swap instantly as before.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ "nav-menu": "page-in", default: "none" }}
      exit={{ "nav-menu": "page-out", default: "none" }}
      default="none"
    >
      <div>{children}</div>
    </ViewTransition>
  );
}
