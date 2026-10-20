"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * A look inside the laptop: a short clip of the site being browsed (a cursor visiting real
 * buttons, clicking and scrolling through the sections), rendered from the full-page capture.
 * Muted and inline, so it can start on its own on phones. It fills the progress bar it is
 * given as it plays, and reports when it has finished.
 */
export function LivePreview({
  mp4,
  webm,
  poster,
  name,
  paused,
  progress,
  onEnded,
}: {
  mp4: string;
  webm: string;
  poster: string;
  name: string;
  paused: boolean;
  progress: RefObject<HTMLSpanElement | null>;
  onEnded: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (paused) video.pause();
    else video.play().catch(() => {});
  }, [paused]);

  // Keep the tab's progress bar in step with the clip.
  useEffect(() => {
    const bar = progress.current;
    let frame = 0;
    const tick = () => {
      const video = ref.current;
      if (video && bar && video.duration) {
        bar.style.transform = `scaleX(${(video.currentTime / video.duration).toFixed(4)})`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      if (bar) bar.style.transform = "";
    };
  }, [progress]);

  return (
    <video
      ref={ref}
      className="live"
      poster={poster}
      muted
      playsInline
      autoPlay={!paused}
      preload="auto"
      onEnded={onEnded}
      aria-label={`A walkthrough of the ${name} website`}
    >
      {/* H.264 for Safari and most browsers; VP9 for browsers without it. */}
      <source src={mp4} type="video/mp4" />
      <source src={webm} type="video/webm" />
    </video>
  );
}
