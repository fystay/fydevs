import type { CSSProperties } from "react";

/*
 * A short line that types itself in once, in CSS alone: every letter is in the page from
 * the start (laid out, so nothing moves) and appears on its own delay, with the caret
 * riding along. Screen readers and search engines get the plain text; reduced motion,
 * or scrolling on before it finishes, shows it whole.
 */
export function TypedLine({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      <span className="visually-hidden">{text}</span>
      <span className="typed" aria-hidden="true" style={{ "--start": `${start}ms` } as CSSProperties}>
        {[...text].map((ch, i) => (
          <span key={i} style={{ "--n": i } as CSSProperties}>
            {ch}
          </span>
        ))}
      </span>
    </>
  );
}
