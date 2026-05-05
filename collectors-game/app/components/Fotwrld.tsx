const outputs = [
  "Smithing Heritage Magazine",
  "Into The Archives 2026",
  "Artisan Documentary",
  "Gwan Gwan Research Report",
];

const partners = [
  "NCMM Kaduna",
  "ABU Zaria",
  "Kaduna Enterprise Development Agency",
  "Ministry of Business & Innovation",
];

export default function Fotwrld() {
  return (
    <section id="fotwrld" className="py-28 px-6" style={{ background: "var(--navy-dark)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--gold)", letterSpacing: "0.2em" }}>
          The Curatorial Team
        </p>
        <div className="section-divider" />

        <div className="grid md:grid-cols-2 gap-16 mt-12">
          {/* Left */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
              Factories of The World
              <br />
              <span style={{ color: "var(--gold)" }}>FOTWRLD</span>
            </h2>
            <p className="text-gray-300 leading-relaxed mb-5" style={{ fontFamily: "Georgia, serif" }}>
              FOTWRLD is an independent research and production platform based at the National Commission for
              Museums and Monuments in Kaduna. Its work sits between cultural heritage and economic documentation:
              it produces investment-facing research on Nigeria&rsquo;s artisanal sector, stages exhibitions that
              translate that research into public experience, and builds the institutional partnerships that give
              both the research and the exhibitions credibility they could not generate alone.
            </p>
            <p className="text-gray-300 leading-relaxed mb-5" style={{ fontFamily: "Georgia, serif" }}>
              It is not a gallery. It is not a consultancy. It is closer to what happens when a research methodology
              and a production sensibility operate out of the same room.
            </p>
            <p className="text-gray-300 leading-relaxed mb-8" style={{ fontFamily: "Georgia, serif" }}>
              On 28 January 2026, FOTWRLD curated an interdisciplinary exhibition at the Kashim Ibrahim Library,
              Ahmadu Bello University, Zaria — bringing together four university departments around original Ladi Kwali
              pottery and Benin bronze sculptures from OBJ&rsquo;s private collection. That is the model
              The Collector&rsquo;s Game now extends to a national audience.
            </p>

            {/* Lead researcher */}
            <div
              className="p-6 rounded"
              style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.2)" }}
            >
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--gold)", letterSpacing: "0.15em" }}>
                Lead Researcher
              </p>
              <p className="text-white font-semibold text-lg">Halima Abdul (Sadia)</p>
              <p className="text-gray-400 text-sm">Operations Manager, FOTWRLD</p>
              <div className="mt-4 flex gap-4 text-xs text-gray-400">
                <span>fotwrldinfo@gmail.com</span>
                <span>www.fotwrld.com</span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-10">
            {/* Location */}
            <div>
              <p className="text-xs uppercase tracking-widest mb-3 text-gray-500" style={{ letterSpacing: "0.15em" }}>
                Location
              </p>
              <p className="text-white">NCMM, No. 33 Ali Akilu Road, Kaduna, Nigeria</p>
            </div>

            {/* Institutional Partners */}
            <div>
              <p className="text-xs uppercase tracking-widest mb-3 text-gray-500" style={{ letterSpacing: "0.15em" }}>
                Institutional Partners
              </p>
              <ul className="space-y-2">
                {partners.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-gray-300 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--gold)" }} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Outputs */}
            <div>
              <p className="text-xs uppercase tracking-widest mb-3 text-gray-500" style={{ letterSpacing: "0.15em" }}>
                Key Outputs
              </p>
              <ul className="space-y-2">
                {outputs.map((o) => (
                  <li key={o} className="flex items-center gap-3 text-gray-300 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--gold)" }} />
                    {o}
                  </li>
                ))}
              </ul>
            </div>

            {/* NCMM Hub note */}
            <div
              className="p-6 rounded"
              style={{ background: "rgba(27,42,74,0.8)", border: "1px solid rgba(201,162,39,0.15)" }}
            >
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--gold)", letterSpacing: "0.15em" }}>
                The NCMM Incubation Hub
              </p>
              <p className="text-gray-300 text-sm leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                FOTWRLD&rsquo;s Jewelry Incubation Hub provides shared access to modern tools, training, exhibition
                space, and business development support for artisans in Kaduna&rsquo;s metalworking sector —
                the physical expression of the argument that museums are not just preservation sites but
                production sites.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
