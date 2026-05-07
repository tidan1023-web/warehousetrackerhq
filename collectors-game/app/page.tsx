import Link from "next/link";
import Image from "next/image";
import Nav from "./components/Nav";
import Sponsors from "./components/Sponsors";
import RegisterForm from "./components/RegisterForm";
import Footer from "./components/Footer";

const previewArtefacts = [
  { id: "2026.1.1", name: "Largest Jar (Three Handles)", category: "Ladi Kwali Pottery", img: "/images/art-2026-1-1a.jpeg" },
  { id: "2026.1.7", name: "Ife FESTAC Masks", category: "Benin Bronzes", img: "/images/art-2026-1-7a.jpeg" },
  { id: "2026.1.8", name: "Bronze Sculpture of a Benin King", category: "Benin Bronzes", img: "/images/art-2026-1-8b.jpeg" },
  { id: "2026.1.9", name: "Bronze Sculpture of a Royal Horse", category: "Benin Bronzes", img: "/images/art-2026-1-9.jpeg" },
  { id: "2026.2.0", name: "Hausa Man Playing a Flute", category: "Bronze Sculptures", img: "/images/art-2026-2-0b.jpeg" },
  { id: "2026.2.2", name: "Benin Plaque: Featuring Soldiers", category: "Benin Bronzes", img: "/images/art-2026-2-2.jpeg" },
];

export default function Home() {
  return (
    <main>
      <Nav />

      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 overflow-hidden"
        style={{ background: "linear-gradient(160deg, #111d35 0%, #1B2A4A 60%, #0d1826 100%)" }}
      >
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }} />

        {/* Side image strips — hidden on small screens */}
        <div className="absolute left-0 top-0 h-full w-20 md:w-40 overflow-hidden opacity-20 hidden sm:block">
          <Image src="/images/editorial-pottery.jpeg" alt="" fill className="object-cover object-center" sizes="160px" quality={100} />
        </div>
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 overflow-hidden opacity-20 hidden sm:block">
          <Image src="/images/exhibition-crowd.jpeg" alt="" fill className="object-cover object-center" sizes="160px" quality={100} />
        </div>

        <p className="relative z-10 text-xs tracking-widest uppercase mb-8 opacity-80" style={{ color: "var(--gold)", letterSpacing: "0.2em" }}>
          FOTWRLD × Basketball for Peace — A Travelling Exhibition
        </p>

        <div className="relative z-10 mb-6">
          <p className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white" style={{ lineHeight: 1 }}>THE</p>
          <p className="text-5xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black leading-none" style={{ color: "var(--gold)", letterSpacing: "-0.02em", lineHeight: 0.85 }}>COLLECTORS</p>
          <p className="text-5xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black leading-none text-white" style={{ letterSpacing: "-0.02em", lineHeight: 0.85 }}>GAME</p>
        </div>

        <p className="relative z-10 italic text-base sm:text-xl text-gray-300 mt-6 max-w-xl px-4" style={{ fontFamily: "Georgia, serif" }}>
          Art, Basketball, and the Private Life of a Public Man
        </p>

        <div className="relative z-10 my-6 w-16 h-px" style={{ background: "var(--gold)" }} />

        <p className="relative z-10 italic text-sm text-gray-400 max-w-lg leading-relaxed px-4" style={{ fontFamily: "Georgia, serif" }}>
          &ldquo;The question is not whether this exhibition merits support.
          The question is what you want to say about Nigerian culture in 2026.&rdquo;
        </p>

        <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-3 px-4">
          {["NCMM, Kaduna", "Open Art Expo, Abuja", "EPAC, Lagos", "Obasanjo Library, Ogun"].map((v) => (
            <a key={v} href="#register" className="text-xs tracking-widest uppercase px-3 py-1 rounded-full border transition-all hover:border-yellow-600 hover:text-yellow-600" style={{ letterSpacing: "0.12em", color: "#9ca3af", borderColor: "rgba(255,255,255,0.15)" }}>{v}</a>
          ))}
        </div>

        <div className="relative z-10 mt-10 flex flex-col sm:flex-row gap-4 px-4 w-full sm:w-auto justify-center">
          <Link href="/exhibition" className="px-8 py-3 text-xs tracking-widest uppercase font-bold text-center transition-all hover:opacity-90 active:opacity-80" style={{ background: "var(--gold)", color: "#111d35", letterSpacing: "0.15em" }}>
            Explore the Exhibition
          </Link>
          <Link href="/collection" className="px-8 py-3 text-xs tracking-widest uppercase font-bold border text-center transition-all hover:bg-white hover:text-navy" style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff", letterSpacing: "0.15em" }}>
            View the Collection
          </Link>
        </div>

        <a href="#collector" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-opacity" aria-label="Scroll down">
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="animate-bounce">
            <path d="M8 0v20M1 13l7 7 7-7" stroke="#C9A227" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </a>
      </section>

      {/* ── THE COLLECTOR (OBJ image + intro) ── */}
      <section id="collector" className="py-20 px-4 sm:px-6" style={{ background: "#f9f7f4" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="relative h-80 sm:h-[500px] rounded overflow-hidden order-2 md:order-1">
              <Image src="/images/obj-portrait.jpeg" alt="Coach Oliver Berdeen Johnson" fill className="object-cover object-top" sizes="(max-width:768px) 100vw, 50vw" quality={100} />
              <p className="absolute bottom-4 left-4 right-4 text-white text-xs italic" style={{ fontFamily: "Georgia, serif" }}>
                Coach Oliver Berdeen Johnson — Chairman, Basketball for Peace
              </p>
            </div>
            <div className="order-1 md:order-2">
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "var(--gold)", letterSpacing: "0.2em" }}>The Collector</p>
              <div className="section-divider" />
              <h2 className="text-3xl sm:text-4xl font-bold mt-6 mb-5 leading-tight" style={{ color: "#1B2A4A" }}>The Man Who Kept Everything</h2>
              <p className="text-gray-700 leading-relaxed mb-5" style={{ fontFamily: "Georgia, serif" }}>
                On the 11th of December 1969, Oliver Berdeen Johnson stepped off a plane in Lagos on a 21-day visitor&rsquo;s permit. He has not left since.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6" style={{ fontFamily: "Georgia, serif" }}>
                He coached Nigeria&rsquo;s first national basketball team, spotted Hakeem Olajuwon as a teenager, mentored a young Masai Ujiri in Zaria, and spent 40 years quietly assembling one of Nigeria&rsquo;s most significant private collections of West African art.
              </p>
              <blockquote className="border-l-2 pl-5 italic text-gray-700 text-lg mb-8" style={{ borderColor: "var(--gold)", fontFamily: "Georgia, serif" }}>
                &ldquo;You cannot talk about basketball in Nigeria without him.&rdquo;
                <cite className="block text-gray-500 text-xs not-italic mt-2">— Col. Sam Ahmedu, FIBA Africa Zone 3 President</cite>
              </blockquote>
              <Link href="/collector" className="inline-block text-xs tracking-widest uppercase font-bold border-b pb-0.5 transition-opacity hover:opacity-70" style={{ color: "var(--gold)", borderColor: "var(--gold)", letterSpacing: "0.15em" }}>
                Read the full story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE COLLECTION PREVIEW ── */}
      <section className="py-20 px-4 sm:px-6" style={{ background: "#eeeae4" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "var(--gold)", letterSpacing: "0.2em" }}>The Collection</p>
              <div className="section-divider" />
              <h2 className="text-3xl sm:text-4xl font-bold mt-6 leading-tight" style={{ color: "#1B2A4A" }}>
                Objects That Outlast<br className="hidden sm:block" /> Their Makers
              </h2>
            </div>
            <Link href="/collection" className="text-xs tracking-widest uppercase font-bold border-b pb-0.5 whitespace-nowrap transition-opacity hover:opacity-70" style={{ color: "var(--gold)", borderColor: "var(--gold)", letterSpacing: "0.12em" }}>
              View full collection →
            </Link>
          </div>

          <p className="text-gray-700 leading-relaxed max-w-2xl mb-12" style={{ fontFamily: "Georgia, serif" }}>
            Ladi Kwali Pottery. Benin bronzes. Bronze sculptures. 40 years of deliberate acquisition across 13 catalogued artefacts — each a manufactured argument about craft, culture, and the material history of West Africa.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {previewArtefacts.map((a) => (
              <Link key={a.id} href="/collection" className="group relative aspect-square rounded overflow-hidden block">
                <Image src={a.img} alt={a.name} fill className="object-contain group-hover:scale-105 transition-transform duration-500" style={{ background: "#f9f7f4" }} sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 16vw" quality={100} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2" style={{ background: "linear-gradient(to top, rgba(17,29,53,0.9) 0%, transparent 60%)" }}>
                  <p className="text-white text-xs leading-tight">{a.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── REGISTER / PARTNER INTEREST ── */}
      <RegisterForm />

      {/* ── SPONSORS / PARTNERS ── */}
      <Sponsors />

      <Footer />
    </main>
  );
}
