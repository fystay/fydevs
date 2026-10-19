/** Decorative hero background: architectural curves and a small terracotta starburst. */
export function HeroArt() {
  const rays = Array.from({ length: 12 }, (_, i) => (i * 360) / 12);
  return (
    <div className="hx__art" aria-hidden="true">
      <svg className="hx__curves" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
        <circle cx="1180" cy="330" r="430" />
        <circle cx="1180" cy="330" r="560" />
        <path d="M-40 760C260 610 520 590 760 680S1220 860 1480 700" />
        <path className="hx__curve-accent" d="M860 120a320 320 0 0 1 320 320" />
      </svg>
      <svg className="hx__burst" viewBox="-20 -20 40 40">
        {rays.map((deg, i) => (
          <line key={deg} x1="0" y1={i % 2 ? -6 : -4} x2="0" y2={i % 2 ? -12 : -18} transform={`rotate(${deg})`} />
        ))}
      </svg>
    </div>
  );
}

const paths = {
  live: (
    <>
      <circle cx="10" cy="10" r="7.25" />
      <path d="M2.75 10h14.5M10 2.75c2 2.1 3 4.5 3 7.25s-1 5.15-3 7.25c-2-2.1-3-4.5-3-7.25s1-5.15 3-7.25Z" />
    </>
  ),
  price: (
    <>
      <path d="M3.5 3.5h6.2l7 7-6.2 6.2-7-7V3.5Z" />
      <circle cx="7" cy="7" r="1.1" />
    </>
  ),
  focus: (
    <>
      <path d="M3 16.5h14" />
      <path d="M5 13.5v-3M9 13.5V8M13 13.5V5" />
    </>
  ),
};

export function TrustIcon({ name }: { name: keyof typeof paths }) {
  return (
    <svg
      className="hx__icon"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
