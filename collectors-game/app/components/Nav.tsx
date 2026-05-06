"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/exhibition", label: "The Exhibition" },
  { href: "/collector", label: "The Collector" },
  { href: "/collection", label: "The Collection" },
  { href: "/venues", label: "Venues" },
  { href: "/about", label: "FOTWRLD" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: "rgba(10,18,32,0.97)", borderBottom: "2px solid rgba(201,162,39,0.35)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo / Brand */}
        <Link href="/" className="flex flex-col leading-none">
          <span className="text-white font-black text-sm sm:text-base tracking-wide uppercase">
            The Collector&rsquo;s Game
          </span>
          <span className="text-xs tracking-widest uppercase hidden sm:block" style={{ color: "var(--gold)", letterSpacing: "0.15em", fontSize: "0.6rem" }}>
            FOTWRLD × Basketball for Peace
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors rounded"
                style={{
                  letterSpacing: "0.12em",
                  color: pathname === l.href ? "#111d35" : "#e5e7eb",
                  background: pathname === l.href ? "var(--gold)" : "transparent",
                }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 flex flex-col justify-center gap-1.5 w-10 h-10" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <span className={`block w-6 h-0.5 bg-white transition-all origin-center ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${open ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all origin-center ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-6 pt-2 flex flex-col gap-1" style={{ background: "rgba(10,18,32,0.99)", borderTop: "1px solid rgba(201,162,39,0.2)" }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 text-sm font-bold uppercase tracking-widest rounded"
              style={{
                letterSpacing: "0.12em",
                color: pathname === l.href ? "#111d35" : "#e5e7eb",
                background: pathname === l.href ? "var(--gold)" : "transparent",
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
