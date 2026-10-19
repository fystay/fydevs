import Link from "next/link";

export const SERVICES = [
  { id: "web", label: "Web design", href: "/" },
  { id: "saas", label: "SaaS development", href: "/bespoke-systems" },
  { id: "booking", label: "Booking software", href: "/booking-software" },
] as const;

export type Service = (typeof SERVICES)[number]["id"];

/**
 * Switches between our three services, each with its own page and accent colour.
 * The line above the current service is a shared view-transition element: when
 * you pick another service, the new page loads and the line glides across to it
 * (and changes colour) while the page content slides the same way underneath.
 */
export function ServiceSwitcher({ current }: { current: Service }) {
  // Content slides in the direction of travel: left going forward, right going back.
  const index = SERVICES.findIndex((s) => s.id === current);
  return (
    <nav className="svc" aria-label="Our services" data-current={current}>
      <ul role="list" className="svc__list" style={{ viewTransitionName: "svc-labels" }}>
        {SERVICES.map((s, i) => (
          <li key={s.id} className="svc__item">
            <Link
              href={s.href}
              className="svc__link"
              data-service={s.id}
              aria-current={s.id === current ? "page" : undefined}
              transitionTypes={[i > index ? "svc-next" : "svc-prev"]}
              scroll
            >
              {s.id === current && (
                <span className="svc__line" aria-hidden="true" style={{ viewTransitionName: "svc-line" }} />
              )}
              {s.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
