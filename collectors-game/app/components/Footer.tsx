import Link from "next/link";

const navLinks = [
  { href: "/exhibition", label: "The Exhibition" },
  { href: "/collector", label: "The Collector" },
  { href: "/collection", label: "The Collection" },
  { href: "/venues", label: "Venues" },
  { href: "/about", label: "FOTWRLD" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#0a1220", borderTop: "1px solid rgba(201,162,39,0.25)" }}>

      {/* Navigation bar at top of footer — bold */}
      <div
        className="px-6 py-6"
        style={{ borderBottom: "1px solid rgba(201,162,39,0.15)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-wrap gap-x-10 gap-y-3 justify-center md:justify-start">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-white font-bold text-sm uppercase tracking-widest hover:opacity-70 transition-opacity"
              style={{ letterSpacing: "0.15em" }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="#partners"
            className="text-white font-bold text-sm uppercase tracking-widest hover:opacity-70 transition-opacity"
            style={{ letterSpacing: "0.15em", color: "var(--gold)" }}
          >
            Contact
          </a>
        </div>
      </div>

      {/* Main footer body */}
      <div className="px-6 py-14">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-12">

          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <p className="text-white font-bold text-xl mb-1">
              The Collector&rsquo;s Game
            </p>
            <p className="text-white text-sm italic mb-5" style={{ fontFamily: "Georgia, serif" }}>
              Art, Basketball, and the Private Life of a Public Man
            </p>
            <p className="text-white text-xs leading-relaxed opacity-70">
              A travelling exhibition presented by FOTWRLD × Basketball for Peace.
              Submitted to Ecobank / EPAC Creative Studio, March 2026.
              Produced by Halima Abdul (Sadia) / FOTWRLD.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <p className="text-white font-bold text-xs uppercase tracking-widest mb-5" style={{ letterSpacing: "0.2em" }}>
              Navigate
            </p>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white text-sm hover:opacity-70 transition-opacity">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-white font-bold text-xs uppercase tracking-widest mb-5" style={{ letterSpacing: "0.2em" }}>
              Contact
            </p>
            <div className="space-y-2">
              <p className="text-white text-sm">fotwrldinfo@gmail.com</p>
              <p className="text-white text-sm">www.fotwrld.com</p>
              <p className="text-white text-xs mt-4 opacity-70">
                NCMM, No. 33 Ali Akilu Road<br />Kaduna, Nigeria
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="px-6 py-6"
        style={{ borderTop: "1px solid rgba(201,162,39,0.15)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-white text-xs opacity-60">
            &copy; 2026 FOTWRLD × Basketball for Peace. All rights reserved.
          </p>
          <p
            className="text-white text-xs italic max-w-md opacity-80 leading-relaxed"
            style={{ fontFamily: "Georgia, serif" }}
          >
            &ldquo;There is no comparable event in Nigerian cultural history. A living legend.
            His private collection. Three venues. One implementing partner.&rdquo;
          </p>
        </div>
      </div>
    </footer>
  );
}
