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

      {/* Nav strip */}
      <div className="px-4 sm:px-6 py-5" style={{ borderBottom: "1px solid rgba(201,162,39,0.15)" }}>
        <div className="max-w-6xl mx-auto flex flex-wrap gap-x-6 gap-y-3 justify-center md:justify-start">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href}
              className="text-white font-bold text-xs sm:text-sm uppercase tracking-widest hover:opacity-70 transition-opacity"
              style={{ letterSpacing: "0.12em" }}>
              {l.label}
            </Link>
          ))}
          <a href="#register"
            className="font-bold text-xs sm:text-sm uppercase tracking-widest hover:opacity-70 transition-opacity"
            style={{ letterSpacing: "0.12em", color: "var(--gold)" }}>
            Register
          </a>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 sm:px-6 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">

          <div className="sm:col-span-2 md:col-span-1">
            <p className="text-white font-bold text-lg sm:text-xl mb-1">The Collector&rsquo;s Game</p>
            <p className="text-white text-sm italic mb-4" style={{ fontFamily: "Georgia, serif" }}>
              Art, Basketball, and the Private Life of a Public Man
            </p>
            <p className="text-white text-xs leading-relaxed opacity-70">
              A travelling exhibition presented by FOTWRLD × Basketball for Peace.
              Produced by Halima Abdul (Sadia) / FOTWRLD.
            </p>
          </div>

          <div>
            <p className="text-white font-bold text-xs uppercase tracking-widest mb-4" style={{ letterSpacing: "0.2em" }}>Navigate</p>
            <ul className="space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white text-sm hover:opacity-70 transition-opacity">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white font-bold text-xs uppercase tracking-widest mb-4" style={{ letterSpacing: "0.2em" }}>Contact</p>
            <div className="space-y-2">
              <p className="text-white text-sm">fotwrldinfo@gmail.com</p>
              <p className="text-white text-sm">www.fotwrld.com</p>
              <p className="text-white text-xs mt-3 opacity-70">NCMM, No. 33 Ali Akilu Road<br />Kaduna, Nigeria</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="px-4 sm:px-6 py-5" style={{ borderTop: "1px solid rgba(201,162,39,0.15)" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-white text-xs opacity-60">&copy; 2026 FOTWRLD × Basketball for Peace. All rights reserved.</p>
          <p className="text-white text-xs italic opacity-80 leading-relaxed sm:text-right sm:max-w-xs" style={{ fontFamily: "Georgia, serif" }}>
            &ldquo;A living legend. His private collection. Two venues. One implementing partner.&rdquo;
          </p>
        </div>
      </div>
    </footer>
  );
}
