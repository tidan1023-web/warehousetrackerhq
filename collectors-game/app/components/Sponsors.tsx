import Image from "next/image";

const partners = [
  {
    name: "FOTWRLD",
    role: "Curatorial Platform & Lead Producer",
    logo: "/logos/fotwrld.png",
    wide: true,
    bg: "#ffffff",
  },
  {
    name: "Basketball for Peace",
    role: "Founding Organisation",
    logo: "/logos/bb4p.svg",
    wide: false,
    bg: "transparent",
  },
  {
    name: "National Commission for Museums & Monuments",
    role: "Institutional Host — Kaduna",
    logo: "/logos/ncmm.jpg",
    wide: false,
    bg: "#ffffff",
  },
  {
    name: "Ahmadu Bello University",
    role: "Academic Partner — Zaria",
    logo: "/logos/abu.png",
    wide: false,
    bg: "#ffffff",
  },
  {
    name: "Olusegun Obasanjo Presidential Library",
    role: "Venue Host — Ogun State",
    logo: "/logos/oopl.jpg",
    wide: true,
    bg: "transparent",
  },
];

const tiers = [
  {
    tier: "Lead Cultural Partner",
    icon: "★★★",
    benefit:
      "Primary presenting credit across both venues. Branding on all physical installations, exhibition publications, digital content, and press materials. Direct engagement with the Basketball for Peace network and the NBA's African ecosystem.",
  },
  {
    tier: "Venue Partner",
    icon: "★★",
    benefit:
      "Named partner at one of two venues — Kaduna or Ogun State. Brand presence in that city's institutional, heritage, or presidential library audience.",
  },
  {
    tier: "Media & Documentation Partner",
    icon: "★",
    benefit:
      "Co-production credit on exhibition photography, catalogue publication, and social content across all venues. Shared access to exhibition archive and documentation.",
  },
];

export default function Sponsors() {
  return (
    <section id="partners" className="py-16 sm:py-20 px-4 sm:px-6" style={{ background: "#f9f7f4" }}>
      <div className="max-w-6xl mx-auto">

        {/* ── Call for Partners ── */}
        <div className="mb-16 sm:mb-20">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--gold)", letterSpacing: "0.2em" }}>
            Partnership Opportunity
          </p>
          <div className="section-divider" />

          <div className="grid md:grid-cols-2 gap-10 md:gap-16 mt-10 sm:mt-12">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6" style={{ color: "#1B2A4A" }}>
                We Are Calling
                <br />on Cultural Nigeria
                <br /><span style={{ color: "var(--gold)" }}>and the World</span>
              </h2>
              <p className="text-gray-700 leading-relaxed mb-5" style={{ fontFamily: "Georgia, serif" }}>
                The Collector&rsquo;s Game is an open invitation to every cultural institution, arts centre,
                museum, gallery, foundation, and heritage organisation — in Nigeria and across the globe —
                that believes the material history of West Africa deserves to be seen, documented, and debated.
              </p>
              <p className="text-gray-700 leading-relaxed mb-5" style={{ fontFamily: "Georgia, serif" }}>
                This is the first exhibition to bring a living basketball legend&rsquo;s private
                art collection into the public eye in Nigeria. It will draw the basketball community, the art world,
                heritage practitioners, and the diplomatic community simultaneously.
              </p>
              <p className="text-gray-700 leading-relaxed mb-8" style={{ fontFamily: "Georgia, serif" }}>
                Whether you are a national museum, a private cultural foundation, a civic arts centre, a university
                gallery, or a corporate cultural programme — if you care about how West African craft and contemporary
                sport tell the same story, this is the partnership for you.
              </p>

              <blockquote
                className="border-l-2 pl-5 italic text-gray-600 text-base sm:text-lg leading-relaxed mb-8"
                style={{ borderColor: "var(--gold)", fontFamily: "Georgia, serif" }}
              >
                &ldquo;People will come to see this because they have never had the chance before.
                And the partner will be the reason they had the chance at all.&rdquo;
              </blockquote>

              <a
                href="mailto:fotwrldinfo@gmail.com?subject=Partnership Enquiry — The Collector's Game"
                className="inline-block px-6 sm:px-8 py-3 text-xs tracking-widest uppercase font-bold transition-all hover:opacity-90 active:opacity-80"
                style={{ background: "var(--gold)", color: "#111d35", letterSpacing: "0.15em" }}
              >
                Enquire About Partnership
              </a>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {tiers.map((c) => (
                <div
                  key={c.tier}
                  className="p-5 rounded"
                  style={{ background: "#eeeae4", border: "1px solid rgba(201,162,39,0.25)" }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold uppercase tracking-wider" style={{ color: "#1B2A4A" }}>{c.tier}</p>
                    <span style={{ color: "var(--gold)", fontSize: "0.65rem" }}>{c.icon}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                    {c.benefit}
                  </p>
                </div>
              ))}

              <div
                className="p-5 rounded"
                style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.3)" }}
              >
                <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "var(--gold)", letterSpacing: "0.15em" }}>Get in Touch</p>
                <p className="text-sm font-semibold" style={{ color: "#1B2A4A" }}>fotwrldinfo@gmail.com</p>
                <p className="text-gray-500 text-xs mt-1">www.fotwrld.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Partners with Logos ── */}
        <div>
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--gold)", letterSpacing: "0.2em" }}>
            Partners &amp; Institutions
          </p>
          <div className="section-divider" />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mt-8 sm:mt-10">
            {partners.map((p) => (
              <div
                key={p.name}
                className="flex flex-col items-center gap-3 p-4 sm:p-5 rounded"
                style={{ background: "#ffffff", border: "1px solid rgba(201,162,39,0.2)" }}
              >
                <div
                  className="relative flex items-center justify-center w-full rounded overflow-hidden"
                  style={{ height: "80px", background: p.bg || "transparent" }}
                >
                  <Image
                    src={p.logo}
                    alt={p.name}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width:640px) 40vw, 180px"
                    quality={100}
                  />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-xs leading-snug mb-1" style={{ color: "#1B2A4A" }}>{p.name}</p>
                  <p className="text-gray-500 text-xs">{p.role}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-gray-400 text-xs text-center mt-6 italic" style={{ fontFamily: "Georgia, serif" }}>
            Interested in joining as a partner? Contact fotwrldinfo@gmail.com
          </p>
        </div>

      </div>
    </section>
  );
}
