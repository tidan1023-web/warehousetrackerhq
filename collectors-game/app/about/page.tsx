import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Image from "next/image";

export const metadata = {
  title: "FOTWRLD — The Collector's Game",
};

const outputs = [
  { name: "Smithing Heritage Magazine", desc: "Investment-facing research on Nigeria's artisanal metalworking sector." },
  { name: "Into The Archives 2026", desc: "Digital archiving initiative for West African cultural heritage." },
  { name: "Artisan Documentary", desc: "Film documentation of Kaduna's craft practitioners." },
  { name: "Gwan Gwan Research Report", desc: "Economic mapping of Nigeria's artisanal industries." },
];

const partners = [
  { name: "NCMM Kaduna", role: "Primary institutional partner & physical base" },
  { name: "ABU Zaria", role: "Academic partner — Departments of Archaeology, History, Literature" },
  { name: "Kaduna Enterprise Development Agency", role: "Business development support" },
  { name: "Ministry of Business & Innovation", role: "Government partner" },
];

export default function AboutPage() {
  return (
    <main>
      <Nav />

      {/* Header */}
      <section
        className="pt-40 pb-20 px-6"
        style={{ background: "linear-gradient(160deg, #111d35 0%, #1B2A4A 100%)" }}
      >
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--gold)", letterSpacing: "0.2em" }}>
            The Curatorial Team
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-6">
            Factories of
            <br />
            <span style={{ color: "var(--gold)" }}>The World</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl" style={{ fontFamily: "Georgia, serif" }}>
            FOTWRLD is an independent research and production platform based at the National Commission for
            Museums and Monuments in Kaduna.
          </p>
        </div>
      </section>

      {/* About FOTWRLD */}
      <section className="py-20 px-6" style={{ background: "var(--navy-dark)" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">What We Do</h2>
            <p className="text-gray-300 leading-relaxed mb-5" style={{ fontFamily: "Georgia, serif" }}>
              FOTWRLD&rsquo;s work sits between cultural heritage and economic documentation: it produces
              investment-facing research on Nigeria&rsquo;s artisanal sector, stages exhibitions that translate
              that research into public experience, and builds the institutional partnerships that give both the
              research and the exhibitions credibility they could not generate alone.
            </p>
            <p className="text-gray-300 leading-relaxed mb-5" style={{ fontFamily: "Georgia, serif" }}>
              It is not a gallery. It is not a consultancy. It is closer to what happens when a research
              methodology and a production sensibility operate out of the same room — which is what has made it
              capable of staging, in its first year of operation, the kind of exhibitions that larger,
              better-resourced institutions spend years trying to pull off.
            </p>
            <p className="text-gray-300 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
              The argument that museums are not just preservation sites but production sites — that heritage
              institutions generate more value when they are active rather than archival — is the argument
              FOTWRLD makes with every project it undertakes.
            </p>
          </div>

          <div className="space-y-8">
            {/* Lead researcher */}
            <div
              className="p-6 rounded"
              style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.25)" }}
            >
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--gold)", letterSpacing: "0.15em" }}>
                Lead Researcher
              </p>
              <p className="text-white font-bold text-xl">Halima Abdul (Sadia)</p>
              <p className="text-gray-400 text-sm mb-4">Operations Manager, FOTWRLD</p>
              <div className="space-y-1 text-sm text-gray-400">
                <p>fotwrldinfo@gmail.com</p>
                <p>www.fotwrld.com</p>
                <p className="text-gray-500 text-xs mt-3">NCMM, No. 33 Ali Akilu Road, Kaduna, Nigeria</p>
              </div>
            </div>

            {/* Institutional partners */}
            <div>
              <p className="text-xs uppercase tracking-widest mb-4 text-gray-500" style={{ letterSpacing: "0.15em" }}>
                Institutional Partners
              </p>
              <div className="space-y-3">
                {partners.map((p) => (
                  <div
                    key={p.name}
                    className="p-4 rounded flex gap-4 items-start"
                    style={{ background: "rgba(27,42,74,0.6)", border: "1px solid rgba(201,162,39,0.12)" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "var(--gold)" }} />
                    <div>
                      <p className="text-white text-sm font-semibold">{p.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{p.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we've built */}
      <section className="py-20 px-6" style={{ background: "var(--navy)" }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12">What We Have Already Built</h2>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <p className="text-gray-300 leading-relaxed mb-5" style={{ fontFamily: "Georgia, serif" }}>
                On 28 January 2026, FOTWRLD curated an interdisciplinary exhibition at the Kashim Ibrahim Library,
                Ahmadu Bello University, Zaria. The event brought together faculty and students from the Departments
                of English &amp; Literary Studies, Literature, Archaeology, and History around a display of original
                pottery by Dr. Ladi Kwali and Benin bronze sculptures from OBJ&rsquo;s private collection.
              </p>
              <p className="text-gray-300 leading-relaxed mb-5" style={{ fontFamily: "Georgia, serif" }}>
                Four university departments collaborated across a single event. The Head of Archaeology at ABU,
                the Kashim Ibrahim Library administration, and NCMM all provided formal endorsements.
              </p>
              <p className="text-gray-300 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                What it demonstrated: when artefacts from a private collection are placed in dialogue with the right
                institutional setting and curatorial framing, they generate a quality of engagement that neither the
                institution nor the objects could produce independently. That is the model The Collector&rsquo;s Game
                now extends to three venues and a national audience.
              </p>
            </div>

            <div className="relative h-72 rounded overflow-hidden">
              <Image
                src="/images/fotwrld-team.jpeg"
                alt="FOTWRLD team at NCMM"
                fill
                className="object-cover object-center"
                sizes="50vw"
              />
            </div>
          </div>

          {/* Key outputs */}
          <h3 className="text-sm uppercase tracking-widest mb-6 text-gray-400" style={{ letterSpacing: "0.15em" }}>
            Key Outputs
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {outputs.map((o) => (
              <div
                key={o.name}
                className="p-6 rounded"
                style={{ background: "rgba(17,29,53,0.7)", border: "1px solid rgba(201,162,39,0.15)" }}
              >
                <p className="text-white font-semibold text-sm mb-2">{o.name}</p>
                <p className="text-gray-400 text-xs leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                  {o.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NCMM Hub */}
      <section className="py-20 px-6" style={{ background: "var(--navy-dark)" }}>
        <div className="max-w-6xl mx-auto">
          <div
            className="p-10 rounded"
            style={{ background: "rgba(201,162,39,0.07)", border: "1px solid rgba(201,162,39,0.2)" }}
          >
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--gold)", letterSpacing: "0.15em" }}>
              The NCMM Incubation Hub
            </p>
            <p className="text-gray-300 leading-relaxed mb-4 max-w-3xl" style={{ fontFamily: "Georgia, serif" }}>
              FOTWRLD&rsquo;s Jewelry Incubation Hub, launched at the FOTWRLD Soft Opening at the National Museum
              Kaduna in October 2025, provides shared access to modern tools, training, exhibition space, and business
              development support for artisans in Kaduna&rsquo;s metalworking sector.
            </p>
            <p className="text-gray-300 leading-relaxed max-w-3xl" style={{ fontFamily: "Georgia, serif" }}>
              More than 100 guests attended the three-day Soft Opening. The NCMM partnership was formally established.
              Revenue streams — subscriptions, exhibition curation services, styling — were activated. What began as a
              research idea is now an operating institution with a track record.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
