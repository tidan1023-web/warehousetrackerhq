const artefacts = [
  {
    id: "2026.1.1",
    name: "Largest Jar (Three Handles)",
    category: "Ladi Kwali Pottery",
    dims: "H: 14 cm · W: 29.5 cm · Mouth ⌀: 20 cm",
    description:
      "Among the very few Ladi Kwali pieces acquired from the workshop in the 1980s, when the woman on the 20 Naira note was still alive, when Abuja was still Suleja.",
  },
  {
    id: "2026.1.2",
    name: "Second Largest Jar",
    category: "Ladi Kwali Pottery",
    dims: "H: 9.5 cm · W: 22.5 cm · Mouth ⌀: 17.5 cm",
    description: "Glazed ceramic vessel from the Abuja Pottery Cooperative, bearing the distinctive Ladi Kwali mark.",
  },
  {
    id: "2026.1.3",
    name: "Third Largest Jar",
    category: "Ladi Kwali Pottery",
    dims: "H: 9 cm · W: 21 cm · Mouth ⌀: 17 cm",
    description: "Incised with the word ABUJA — a record of place made when the capital was still being imagined.",
  },
  {
    id: "2026.1.4",
    name: "Largest Bowl with Lid",
    category: "Ladi Kwali Pottery",
    dims: "H: 4 cm · W: 38.5 cm · Lid ⌀: 13 cm",
    description: "A broad, lidded serving bowl. The glaze catches light like gunmetal. Nigeria inscribed on the lid.",
  },
  {
    id: "2026.1.5",
    name: "Second Largest Bowl with Lid",
    category: "Ladi Kwali Pottery",
    dims: "H: 5 cm · W: 34 cm",
    description: "Compact and purposeful. The lid a near-perfect fit, sealed with decades of careful storage.",
  },
  {
    id: "2026.1.6",
    name: "Third Largest Bowl with Lid",
    category: "Ladi Kwali Pottery",
    dims: "H: 7 cm · W: 31 cm · Mouth ⌀: 25 cm · Lid ⌀: 23 cm",
    description: "The deepest bowl in the pottery series. NIGERIA incised boldly around the body.",
  },
  {
    id: "2026.1.7",
    name: "Ife FESTAC Masks",
    category: "Benin Bronzes",
    dims: "—",
    description:
      "Cast bronze. The FESTAC mask — used as the emblem of the 1977 Festival of African Culture — rendered in miniature. A political object and an art object in equal measure.",
  },
  {
    id: "2026.1.8",
    name: "Bronze Sculpture of a Benin King",
    category: "Benin Bronzes",
    dims: "—",
    description:
      "A standing royal figure in full regalia. The West African metallurgical tradition made visible. Manufactured argument about craft, political authority, and sophistication.",
  },
  {
    id: "2026.1.9",
    name: "Bronze Sculpture of a Royal Horse",
    category: "Benin Bronzes",
    dims: "—",
    description: "A horse in full ceremonial tack. Bridle, saddle cloth, and trappings rendered with the precision of the lost-wax method.",
  },
  {
    id: "2026.2.0",
    name: "Hausa Man Playing a Flute",
    category: "Bronze Sculptures",
    dims: "—",
    description: "A musician caught mid-breath. The robes are etched with geometric Hausa embroidery patterns; the instrument lifts toward the air.",
  },
  {
    id: "2026.2.1",
    name: "Woman Winnowing Grains with a Baby on her Back",
    category: "Bronze Sculptures",
    dims: "—",
    description:
      "Labour and tenderness rendered in bronze. The winnowing fan raised above the head; the child carried against the body. A record of domestic life.",
  },
  {
    id: "2026.2.2",
    name: "Benin Plaque: Featuring Soldiers",
    category: "Benin Bronzes",
    dims: "—",
    description:
      "A court plaque of the type that once lined the palace of the Oba of Benin. Three warriors in formation — armour, shields, weapons — political authority cast in metal.",
  },
];

const categories = ["All", "Ladi Kwali Pottery", "Benin Bronzes", "Bronze Sculptures"];

export default function Collection() {
  return (
    <section id="collection" className="py-28 px-6" style={{ background: "var(--navy-dark)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--gold)", letterSpacing: "0.2em" }}>
          The Collection
        </p>
        <div className="section-divider" />

        <div className="flex flex-col md:flex-row md:items-end justify-between mt-12 mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Objects That Outlast
              <br />
              Their Makers
            </h2>
            <p className="text-gray-300 max-w-xl leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
              40 years of deliberate acquisition. Ladi Kwali Pottery. Benin bronzes.
              Metalwork. Textiles. Each object a manufactured argument about craft, culture, and the material history of West Africa.
            </p>
          </div>
          <p className="text-gray-500 text-sm font-mono whitespace-nowrap">
            {artefacts.length} artefacts catalogued
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map((c) => (
            <span
              key={c}
              className="px-4 py-1.5 text-xs tracking-widest uppercase rounded-full border"
              style={{
                borderColor: c === "All" ? "var(--gold)" : "rgba(201,162,39,0.3)",
                color: c === "All" ? "var(--gold)" : "#9ca3af",
                letterSpacing: "0.12em",
              }}
            >
              {c}
            </span>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artefacts.map((a) => (
            <div
              key={a.id}
              className="rounded p-6 flex flex-col gap-3 group hover:border-gold transition-colors"
              style={{
                background: "rgba(27,42,74,0.6)",
                border: "1px solid rgba(201,162,39,0.15)",
              }}
            >
              {/* Placeholder art area */}
              <div
                className="w-full aspect-square rounded flex items-center justify-center mb-2"
                style={{ background: "rgba(201,162,39,0.06)" }}
              >
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="opacity-20">
                  <rect x="8" y="8" width="32" height="32" rx="2" stroke="#C9A227" strokeWidth="1.5" />
                  <circle cx="24" cy="24" r="8" stroke="#C9A227" strokeWidth="1.5" />
                </svg>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-mono" style={{ color: "var(--gold)" }}>
                  Artefact {a.id}
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(201,162,39,0.1)", color: "var(--gold)" }}
                >
                  {a.category}
                </span>
              </div>
              <h3 className="text-white font-semibold leading-snug">{a.name}</h3>
              {a.dims !== "—" && (
                <p className="text-xs text-gray-500 font-mono">{a.dims}</p>
              )}
              <p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                {a.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-16 pt-10 border-t" style={{ borderColor: "rgba(201,162,39,0.2)" }}>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl italic" style={{ fontFamily: "Georgia, serif" }}>
            These are not passive acquisitions. Collecting at this level requires the same deliberate attention that
            competitive sport demands. You have to know what you&rsquo;re looking for, what you are looking at.
            You have to be willing to wait. And you have to understand that what you&rsquo;re building is not just
            a personal treasury: it is a record.
          </p>
        </div>
      </div>
    </section>
  );
}
