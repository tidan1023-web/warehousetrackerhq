import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Image from "next/image";

export const metadata = { title: "The Exhibition — The Collector's Game" };

export default function ExhibitionPage() {
  return (
    <main style={{ background: "#f9f7f4" }}>
      <Nav />

      {/* Hero — keep dark for visual drama */}
      <section className="pt-32 sm:pt-40 pb-16 px-4 sm:px-6 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #111d35 0%, #1B2A4A 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--gold)", letterSpacing: "0.2em" }}>The Exhibition</p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-none mb-5">
            The Collector&rsquo;s Game
          </h1>
          <p className="text-base sm:text-xl italic text-gray-300 max-w-xl" style={{ fontFamily: "Georgia, serif" }}>
            Art, Basketball, and the Private Life of a Public Man
          </p>
        </div>
      </section>

      <div className="relative w-full h-56 sm:h-80 md:h-[480px]">
        <Image src="/images/exhibition-audience.jpeg" alt="Exhibition audience at Kashim Ibrahim Library, ABU Zaria" fill className="object-cover object-center" sizes="100vw" quality={100} priority />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #1B2A4A 0%, transparent 30%, transparent 70%, #f9f7f4 100%)" }} />
        <p className="absolute bottom-4 left-4 right-4 text-center text-xs text-gray-500 tracking-wide">
          Exhibition audience — Kashim Ibrahim Library, ABU Zaria, January 2026
        </p>
      </div>

      <section className="py-16 sm:py-20 px-4 sm:px-6" style={{ background: "#f9f7f4" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6" style={{ color: "#1B2A4A" }}>The Exhibition</h2>
            <p className="leading-relaxed mb-5 text-gray-700" style={{ fontFamily: "Georgia, serif" }}>
              Oliver Berdeen Johnson has spent his life around people who understand that objects carry meaning. In basketball, the object is simply a ball, a court, a rim. But what surrounds it is anything but. Trophies. Jerseys. Photographs. The material record of a career, a community, a country&rsquo;s athletic ambition.
            </p>
            <p className="leading-relaxed mb-5 text-gray-700" style={{ fontFamily: "Georgia, serif" }}>
              The Collector&rsquo;s Game puts Coach OBJ&rsquo;s record into rooms where other people can walk through it. Four rooms, in four cities, across the length of the country.
            </p>
            <p className="leading-relaxed text-gray-700" style={{ fontFamily: "Georgia, serif" }}>
              The exhibition does not ask visitors to simply look. It asks them to think about what it means for a man whose life has been defined by sport to have also spent decades building a collection that speaks to the material history of West Africa.
            </p>
            <blockquote className="border-l-2 pl-5 italic my-8 text-gray-600 text-base sm:text-lg leading-relaxed" style={{ borderColor: "var(--gold)", fontFamily: "Georgia, serif" }}>
              &ldquo;What does a man keep? And what does the keeping tell us about who he is?&rdquo;
            </blockquote>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6" style={{ color: "#1B2A4A" }}>What the Exhibition Does</h2>
            <p className="leading-relaxed mb-5 text-gray-700" style={{ fontFamily: "Georgia, serif" }}>
              Basketball histories in Nigeria tend to be written through statistics, fixtures, and institutional milestones. Art collections tend to be understood through auction values and provenance debates. What the exhibition asks is a simpler question: what does a man collect, and why?
            </p>
            <p className="leading-relaxed mb-8 text-gray-700" style={{ fontFamily: "Georgia, serif" }}>
              Visitors will not just see objects. They will be invited into a conversation about what it means to keep things and what gets lost when we do not.
            </p>
            <div className="p-5 sm:p-6 rounded" style={{ background: "rgba(201,162,39,0.07)", border: "1px solid rgba(201,162,39,0.25)" }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--gold)", letterSpacing: "0.15em" }}>The Technology Thread</p>
              <p className="text-gray-700 text-sm leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                One of the exhibition&rsquo;s intentions is to open a conversation about how Nigerian sport is documented — not just played. The question of how to archive that history and how sport and art can share an archival logic is one the exhibition will pose directly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-16" style={{ background: "#f9f7f4" }}>
        <div className="max-w-6xl mx-auto">
          <div className="relative w-full h-56 sm:h-80 md:h-96 rounded overflow-hidden shadow-lg">
            <Image src="/images/collection-display.jpeg" alt="Visitors engaging with exhibition materials" fill className="object-cover object-top" sizes="100vw" quality={100} />
          </div>
          <p className="text-xs text-gray-500 text-center mt-3 tracking-wide">Visitors engaging with the exhibition — ABU Zaria, January 2026</p>
        </div>
      </section>

      <section className="py-16 sm:py-20 px-4 sm:px-6" style={{ background: "#eeeae4" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-12 items-center">
          <div className="relative h-72 sm:h-[500px] rounded overflow-hidden shadow-lg">
            <Image src="/images/editorial-pottery.jpeg" alt="Binshi Musa-Bentley with Ladi Kwali pottery" fill className="object-cover object-top" sizes="(max-width:768px) 100vw, 50vw" quality={100} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--gold)", letterSpacing: "0.15em" }}>The Ladi Kwali Collection</p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-5" style={{ color: "#1B2A4A" }}>Objects Built to Outlast Their Makers</h2>
            <p className="text-gray-700 leading-relaxed mb-4" style={{ fontFamily: "Georgia, serif" }}>
              The Ladi Kwali Pottery in this collection are some of the very few acquired from the workshop in the 1980s, when the woman on the 20 Naira note was still alive, when Abuja was still Suleja.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4" style={{ fontFamily: "Georgia, serif" }}>
              The Benin bronzes are not decorative objects. They are manufactured arguments about craft, about political authority, about the sophistication of the West African metallurgical tradition.
            </p>
            <p className="text-gray-700 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
              The textiles are not just fabric — they are evidence of the cherished art of Batik Design unique to Nigerian Yoruba culture.
            </p>
            <p className="text-xs text-gray-500 mt-6 italic">Binshi Musa-Bentley with original artefacts from the Ladi Kwali Pottery Collection, Kashim Ibrahim Library, ABU Zaria. Photographed by Akin.</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
