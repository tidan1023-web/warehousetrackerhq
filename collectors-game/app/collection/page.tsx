import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Image from "next/image";

export const metadata = { title: "The Collection — The Collector's Game" };

const artefacts = [
  { id: "2026.1.1", name: "Largest Jar (Three Handles)", category: "Ladi Kwali Pottery", dims: "H: 14 cm · W: 29.5 cm · Mouth ⌀: 20 cm", description: "Among the very few Ladi Kwali pieces acquired from the workshop in the 1980s, when the woman on the 20 Naira note was still alive, when Abuja was still Suleja.", images: ["/images/art-2026-1-1a.jpeg", "/images/art-2026-1-1b.jpeg"] },
  { id: "2026.1.2", name: "Second Largest Jar", category: "Ladi Kwali Pottery", dims: "H: 9.5 cm · W: 22.5 cm · Mouth ⌀: 17.5 cm", description: "Glazed ceramic vessel from the Abuja Pottery Cooperative, bearing the distinctive Ladi Kwali mark.", images: ["/images/art-2026-1-2.jpeg"] },
  { id: "2026.1.3", name: "Third Largest Jar", category: "Ladi Kwali Pottery", dims: "H: 9 cm · W: 21 cm · Mouth ⌀: 17 cm", description: "Incised with the word ABUJA — a record of place made when the capital was still being imagined.", images: ["/images/art-2026-1-3a.jpeg", "/images/art-2026-1-3b.jpeg"] },
  { id: "2026.1.4", name: "Largest Bowl with Lid", category: "Ladi Kwali Pottery", dims: "H: 4 cm · W: 38.5 cm · Depth: 4 cm · Lid ⌀: 13 cm", description: "A broad, lidded serving bowl. The glaze catches light like gunmetal. NIGERIA inscribed on the lid.", images: ["/images/art-2026-1-4a.jpeg", "/images/art-2026-1-4b.jpeg"] },
  { id: "2026.1.5", name: "Second Largest Bowl with Lid", category: "Ladi Kwali Pottery", dims: "H: 5 cm · W: 34 cm · Depth: 4 cm", description: "Compact and purposeful. The lid a near-perfect fit, sealed with decades of careful storage.", images: ["/images/art-2026-1-5.jpeg", "/images/art-2026-1-5b.jpeg"] },
  { id: "2026.1.6", name: "Third Largest Bowl with Lid", category: "Ladi Kwali Pottery", dims: "H: 7 cm · W: 31 cm · Mouth ⌀: 25 cm · Lid ⌀: 23 cm", description: "The deepest bowl in the pottery series. NIGERIA incised boldly around the body.", images: ["/images/art-2026-1-6.jpeg"] },
  { id: "2026.1.7", name: "Ife FESTAC Masks", category: "Benin Bronzes", dims: "—", description: "Cast bronze. The FESTAC mask — emblem of the 1977 Festival of African Culture. A political object and an art object in equal measure.", images: ["/images/art-2026-1-7a.jpeg", "/images/art-2026-1-7b.jpeg"] },
  { id: "2026.1.8", name: "Bronze Sculpture of a Benin King", category: "Benin Bronzes", dims: "—", description: "A standing royal figure in full regalia. Manufactured argument about craft, political authority, and the sophistication of the West African metallurgical tradition.", images: ["/images/art-2026-1-8a.jpeg", "/images/art-2026-1-8b.jpeg", "/images/art-2026-1-8c.jpeg"] },
  { id: "2026.1.9", name: "Bronze Sculpture of a Royal Horse", category: "Benin Bronzes", dims: "—", description: "A horse in full ceremonial tack. Bridle, saddle cloth, and trappings rendered with the precision of the lost-wax method.", images: ["/images/art-2026-1-9.jpeg"] },
  { id: "2026.2.0", name: "Hausa Man Playing a Flute", category: "Bronze Sculptures", dims: "—", description: "A musician caught mid-breath. The robes etched with geometric Hausa embroidery patterns; the instrument lifts toward the air.", images: ["/images/art-2026-2-0a.jpeg", "/images/art-2026-2-0b.jpeg"] },
  { id: "2026.2.1", name: "Woman Winnowing Grains with Baby on her Back", category: "Bronze Sculptures", dims: "—", description: "Labour and tenderness rendered in bronze. The winnowing fan raised; the child carried against the body.", images: ["/images/art-2026-2-1a.jpeg", "/images/art-2026-2-1b.jpeg"] },
  { id: "2026.2.2", name: "Benin Plaque: Featuring Soldiers", category: "Benin Bronzes", dims: "—", description: "A court plaque of the type that once lined the palace of the Oba of Benin. Three warriors in formation — political authority cast in metal.", images: ["/images/art-2026-2-2.jpeg"] },
  { id: "2026.2.3", name: "Benin Plaque: Mounted Soldier", category: "Benin Bronzes", dims: "—", description: "A mounted soldier in high relief. The horse, rider, attendants, and weaponry captured in the moment of procession.", images: ["/images/art-2026-2-3.jpeg"] },
];

export default function CollectionPage() {
  return (
    <main>
      <Nav />

      <section className="pt-32 sm:pt-40 pb-16 px-4 sm:px-6" style={{ background: "linear-gradient(160deg, #111d35 0%, #1B2A4A 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--gold)", letterSpacing: "0.2em" }}>The Collection</p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-none mb-6">
            Objects That Outlast<br />Their Makers
          </h1>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl" style={{ fontFamily: "Georgia, serif" }}>
            40 years of deliberate acquisition. {artefacts.length} catalogued artefacts — each a manufactured argument about craft, culture, and the material history of West Africa.
          </p>
        </div>
      </section>

      <div className="relative w-full h-48 sm:h-64 md:h-80">
        <Image src="/images/editorial-pottery.jpeg" alt="Ladi Kwali pottery collection editorial" fill className="object-cover object-top" sizes="100vw" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #1B2A4A 0%, transparent 30%, transparent 70%, #111d35 100%)" }} />
      </div>

      <section className="py-8 px-4 sm:px-6 sticky top-[65px] z-40" style={{ background: "rgba(17,29,53,0.97)", borderBottom: "1px solid rgba(201,162,39,0.15)" }}>
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2">
          {["All", "Ladi Kwali Pottery", "Benin Bronzes", "Bronze Sculptures"].map((c) => (
            <span key={c} className="px-3 py-1 text-xs tracking-widest uppercase rounded-full border" style={{ borderColor: c === "All" ? "var(--gold)" : "rgba(201,162,39,0.3)", color: c === "All" ? "var(--gold)" : "#9ca3af", letterSpacing: "0.1em" }}>
              {c}
            </span>
          ))}
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4 sm:px-6" style={{ background: "var(--navy-dark)" }}>
        <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24">
          {artefacts.map((a, idx) => (
            <div key={a.id} className={`flex flex-col ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 md:gap-14 items-center`}>

              {/* Images */}
              <div className="w-full md:w-1/2 flex gap-2 sm:gap-3">
                {a.images.map((src, i) => (
                  <div key={src} className={`relative rounded overflow-hidden ${a.images.length > 1 ? (i === 0 ? "flex-[2]" : "flex-1") : "flex-1"}`} style={{ minHeight: "260px" }}>
                    <Image src={src} alt={`${a.name} — view ${i + 1}`} fill className="object-contain" style={{ background: "rgba(201,162,39,0.04)" }} sizes="(max-width:768px) 80vw, 40vw" />
                  </div>
                ))}
              </div>

              {/* Text */}
              <div className="w-full md:w-1/2">
                <p className="text-xs font-mono mb-2" style={{ color: "var(--gold)" }}>Artefact {a.id}</p>
                <span className="text-xs px-2 py-0.5 rounded-full inline-block mb-3" style={{ background: "rgba(201,162,39,0.1)", color: "var(--gold)" }}>{a.category}</span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-2 mb-3 leading-snug">{a.name}</h2>
                {a.dims !== "—" && <p className="text-xs text-gray-500 font-mono mb-4">{a.dims}</p>}
                <div className="w-8 h-px mb-4" style={{ background: "var(--gold)" }} />
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base" style={{ fontFamily: "Georgia, serif" }}>{a.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto mt-20 pt-10 border-t" style={{ borderColor: "rgba(201,162,39,0.2)" }}>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl italic" style={{ fontFamily: "Georgia, serif" }}>
            These are not passive acquisitions. Collecting at this level requires the same deliberate attention that competitive sport demands. You have to know what you&rsquo;re looking for. You have to be willing to wait. What you&rsquo;re building is not just a personal treasury: it is a record.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
