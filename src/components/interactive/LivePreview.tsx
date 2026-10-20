"use client";

import { useEffect, useRef } from "react";

/**
 * A look inside the laptop: a short clip of the site being browsed (a cursor visiting real
 * buttons, clicking and scrolling through the sections), rendered from the full-page capture.
 * Started by a tap, so it plays inline on phones; it loops until tapped again.
 */
export function LivePreview({ mp4, webm, poster, name }: { mp4: string; webm: string; poster: string; name: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Started by the visitor's tap, so playback is allowed; muted keeps it inline on iOS.
    ref.current?.play().catch(() => {});
  }, [mp4]);

  return (
    <video
      ref={ref}
      className="live"
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      aria-label={`A walkthrough of the ${name} website`}
    >
      {/* H.264 for Safari and most browsers; VP9 for browsers without it. */}
      <source src={mp4} type="video/mp4" />
      <source src={webm} type="video/webm" />
    </video>
  );
}
