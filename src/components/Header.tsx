"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { primaryNav, type NavLink, type NavMenu } from "@/lib/site";
import { ArrowRight } from "./Icons";
import { Logo } from "./Logo";

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

function Chevron({ dir = "down", size = 10 }: { dir?: "down" | "right" | "left"; size?: number }) {
  const rotate = { down: 0, right: -90, left: 90 }[dir];
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden="true" style={{ transform: `rotate(${rotate}deg)` }}>
      <path d="M1.5 3.25 5 6.75l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MenuLink({ link, className, onNavigate }: { link: NavLink; className?: string; onNavigate?: () => void }) {
  if (link.external) {
    return (
      <a href={link.href} className={className} target="_blank" rel="noopener noreferrer" onClick={onNavigate}>
        {link.label}
        <span className="visually-hidden"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={link.href} className={className} onClick={onNavigate}>
      {link.label}
    </Link>
  );
}

/** The contents of a menu: large primary links, then smaller groups. Shared by desktop and mobile. */
function MenuContents({ menu, variant, onNavigate }: { menu: NavMenu; variant: "flyout" | "mobile"; onNavigate: () => void }) {
  let i = 0;
  return (
    <div className={`menu menu--${variant}`}>
      <ul role="list" className="menu__primary">
        {menu.primary.map((link) => (
          <li key={link.label} style={{ "--i": i++ } as React.CSSProperties}>
            <MenuLink link={link} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
      {menu.groups.map((group) => (
        <div key={group.title} className="menu__group" style={{ "--i": i++ } as React.CSSProperties}>
          <p className="menu__title">{group.title}</p>
          <ul role="list">
            {group.links.map((link) => (
              <li key={link.label}>
                <MenuLink link={link} onNavigate={onNavigate} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // mobile menu
  const [sub, setSub] = useState<number | null>(null); // mobile submenu
  const [lastSub, setLastSub] = useState<number | null>(null);
  const [flyout, setFlyout] = useState<number | null>(null); // desktop flyout
  const [lastFlyout, setLastFlyout] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const subRef = useRef<number | null>(null);

  // Close everything whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
    setSub(null);
    setFlyout(null);
  }

  const closeAll = useCallback(() => {
    setOpen(false);
    setSub(null);
    setFlyout(null);
  }, []);

  const clearTimers = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    openTimer.current = closeTimer.current = null;
  };

  const showFlyout = (i: number | null) => {
    setFlyout(i);
    if (i !== null) setLastFlyout(i);
  };

  // Apple-style intent: a short delay before opening, instant switching once open.
  const hoverItem = (i: number | null) => {
    clearTimers();
    if (flyout !== null) return showFlyout(i);
    if (i === null) return;
    openTimer.current = window.setTimeout(() => showFlyout(i), 140);
  };

  const leaveHeader = () => {
    clearTimers();
    closeTimer.current = window.setTimeout(() => setFlyout(null), 160);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimers();
    };
  }, []);

  // Desktop flyout: Escape closes it and returns focus to its toggle.
  useEffect(() => {
    if (flyout === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const toggle = document.querySelector<HTMLButtonElement>(`[data-flyout-toggle="${flyout}"]`);
      setFlyout(null);
      toggle?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [flyout]);

  // Mobile menu: lock scroll, Escape steps back then closes, close on desktop resize.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (subRef.current !== null) {
        setSub(null);
      } else {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => window.matchMedia("(min-width: 64rem)").matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  useEffect(() => {
    subRef.current = sub;
  }, [sub]);

  // Move focus to the first item of whichever mobile view just appeared.
  useEffect(() => {
    if (!open) return;
    const selector = sub === null ? ".mm-pane--root a, .mm-pane--root button" : ".mm-pane--sub button";
    window.requestAnimationFrame(() => menuRef.current?.querySelector<HTMLElement>(selector)?.focus());
  }, [open, sub]);

  const openSub = (i: number) => {
    setSub(i);
    setLastSub(i);
  };

  const flyoutItem = lastFlyout !== null ? primaryNav[lastFlyout] : null;
  const subItem = lastSub !== null ? primaryNav[lastSub] : null;

  return (
    <>
      <header
        className="site-header"
        data-scrolled={scrolled || open || flyout !== null}
        data-open={open || flyout !== null}
        onMouseLeave={leaveHeader}
        onMouseEnter={() => closeTimer.current && window.clearTimeout(closeTimer.current)}
      >
        <div className="container container--wide site-header__inner">
          <Link href="/" className="brand" aria-label="FY Devs home" onMouseEnter={() => hoverItem(null)}>
            <Logo preload />
          </Link>

          <nav className="nav-desktop" aria-label="Main">
            <ul role="list">
              {primaryNav.map((item, i) => (
                <li key={item.href} className="nav-item" onMouseEnter={() => hoverItem(item.menu ? i : null)}>
                  <Link
                    href={item.href}
                    className="nav-link"
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    data-active={flyout === i || undefined}
                  >
                    {item.label}
                  </Link>
                  {item.menu && (
                    <button
                      type="button"
                      className="nav-chevron"
                      data-flyout-toggle={i}
                      aria-expanded={flyout === i}
                      aria-controls="nav-flyout"
                      aria-label={`${item.label} menu`}
                      onClick={() => {
                        clearTimers();
                        showFlyout(flyout === i ? null : i);
                        if (flyout !== i) {
                          window.requestAnimationFrame(() => flyoutRef.current?.querySelector<HTMLElement>("a")?.focus());
                        }
                      }}
                    >
                      <Chevron />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-cta" onMouseEnter={() => hoverItem(null)}>
            <Link href="/contact?topic=website" className="btn btn--primary btn--sm">
              Start a Project
            </Link>
          </div>

          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => {
              setOpen((v) => !v);
              setSub(null);
            }}
          >
            <span className="visually-hidden">{open ? "Close menu" : "Open menu"}</span>
            <span className="menu-toggle__bars" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>

        {/* Desktop flyout: inside the header so it drops from the bar. */}
        <div
          id="nav-flyout"
          ref={flyoutRef}
          className="flyout"
          data-open={flyout !== null}
          aria-hidden={flyout === null}
          inert={flyout === null}
        >
          <div className="flyout__clip">
            <div className="container container--wide flyout__inner" key={lastFlyout ?? "none"}>
              {flyoutItem?.menu && <MenuContents menu={flyoutItem.menu} variant="flyout" onNavigate={closeAll} />}
            </div>
          </div>
        </div>
      </header>

      {/* Blurs the page behind the desktop flyout. Outside <header> so Safari sizes it to the viewport. */}
      <div className="nav-backdrop" data-open={flyout !== null} aria-hidden="true" onMouseEnter={() => setFlyout(null)} />

      {/* Mobile menu, outside <header>: Safari sizes fixed children of a backdrop-filtered parent to that parent. */}
      <div id="mobile-menu" ref={menuRef} className="mobile-menu" hidden={!open} data-sub={sub !== null}>
        <nav aria-label="Main mobile" className="mm-pane mm-pane--root" inert={sub !== null}>
          <ul role="list">
            {primaryNav.map((item, i) => (
              <li key={item.href} style={{ "--i": i } as React.CSSProperties}>
                {item.menu ? (
                  <button type="button" className="mm-link" onClick={() => openSub(i)} aria-label={`${item.label}: more`}>
                    {item.label}
                    <Chevron dir="right" size={14} />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="mm-link"
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    onClick={closeAll}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <Link href="/contact?topic=website" className="btn btn--primary mm-cta" onClick={closeAll} style={{ "--i": primaryNav.length } as React.CSSProperties}>
            Start a Project
            <ArrowRight />
          </Link>
        </nav>

        <div className="mm-pane mm-pane--sub" inert={sub === null} aria-hidden={sub === null}>
          {subItem?.menu && (
            <div key={lastSub}>
              <button type="button" className="mm-back" onClick={() => setSub(null)}>
                <Chevron dir="left" size={14} />
                <span>Back</span>
              </button>
              <MenuContents menu={subItem.menu} variant="mobile" onNavigate={closeAll} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
