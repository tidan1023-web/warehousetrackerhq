const navLinks = [
  { href: "#exhibition", label: "The Exhibition" },
  { href: "#collector", label: "The Collector" },
  { href: "#collection", label: "The Collection" },
  { href: "#venues", label: "Venues" },
  { href: "#fotwrld", label: "FOTWRLD" },
];

export default function Footer() {
  return (
    <footer
      className="py-16 px-6"
      style={{
        background: "#0a1220",
        borderTop: "1px solid rgba(201,162,39,0.2)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
          {/* Brand */}
          <div className="max-w-sm">
            <p className="text-white font-bold text-lg mb-1">
              The Collector&rsquo;s Game
            </p>
            <p className="text-gray-500 text-sm italic mb-4" style={{ fontFamily: "Georgia, serif" }}>
              Art, Basketball, and the Private Life of a Public Man
            </p>
            <p className="text-gray-500 text-xs leading-relaxed">
              A travelling exhibition presented by FOTWRLD × Basketball for Peace.
              Submitted to Ecobank / EPAC Creative Studio, March 2026.
              Produced by Halima Abdul (Sadia) / FOTWRLD.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-4" style={{ letterSpacing: "0.15em" }}>
              Navigate
            </p>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-4" style={{ letterSpacing: "0.15em" }}>
              Contact
            </p>
            <p className="text-gray-400 text-sm mb-1">fotwrldinfo@gmail.com</p>
            <p className="text-gray-400 text-sm mb-4">www.fotwrld.com</p>
            <p className="text-gray-500 text-xs">
              NCMM, No. 33 Ali Akilu Road
              <br />
              Kaduna, Nigeria
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t mb-8" style={{ borderColor: "rgba(201,162,39,0.1)" }} />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">
            &copy; 2026 FOTWRLD × Basketball for Peace. All rights reserved.
          </p>
          <p className="text-gray-700 text-xs italic" style={{ fontFamily: "Georgia, serif" }}>
            &ldquo;There is no comparable event in Nigerian cultural history. A living legend. His private collection. Three venues. One implementing partner.&rdquo;
          </p>
        </div>
      </div>
    </footer>
  );
}
