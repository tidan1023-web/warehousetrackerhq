import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Image from "next/image";

export const metadata = { title: "The Collector — The Collector's Game" };

const milestones = [
  { year: "1940", label: "Born in Washington D.C., 7 April" },
  { year: "1967", label: "Posted to Kenya with the American Peace Corps" },
  { year: "1969", label: "Arrived in Lagos on a 21-day visitor's permit. Has not left since." },
  { year: "1971", label: "Appointed Nigeria's first full-time National Coach of Basketball" },
  { year: "1971", label: "Hosted Kareem Abdul-Jabbar & Oscar Robinson coaching clinic at UNILAG" },
  { year: "1972", label: "Established women's basketball in Nigeria; led first international tour" },
  { year: "1978", label: "Moved to Ahmadu Bello University, Zaria — mentored a young Masai Ujiri" },
  { year: "2003", label: "Founded Basketball for Peace, now in 16 states across 30+ LGAs" },
  { year: "2015", label: "FIBA Africa Career Achievement Award. Nigeria wins Afro Basketball Gold." },
];

export default function CollectorPage() {
  return (
    <main style={{ background: "#f9f7f4" }}>
      <Nav />

      {/* Hero — dark */}
      <section className="relative pt-32 sm:pt-40 pb-0 overflow-hidden" style={{ background: "linear-gradient(160deg, #111d35 0%, #1B2A4A 100%)" }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--gold)", letterSpacing: "0.2em" }}>The Collector</p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-none mb-5">
            The Man Who<br />Kept Everything
          </h1>
          <p className="text-base sm:text-lg italic text-gray-300 max-w-2xl" style={{ fontFamily: "Georgia, serif" }}>
            The man who built Nigerian basketball, trained Hakeem Olajuwon and Masai Ujiri, and spent five decades collecting the objects that tell a deeper story.
          </p>
        </div>
        <div className="relative w-full h-[50vh] sm:h-[65vh] md:h-[80vh]">
          <Image src="/images/obj-portrait.jpeg" alt="Coach Oliver Berdeen Johnson" fill className="object-cover object-top" sizes="100vw" quality={100} priority />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, #f9f7f4 100%)" }} />
        </div>
      </section>

      {/* Bio */}
      <section className="py-16 sm:py-20 px-4 sm:px-6" style={{ background: "#f9f7f4" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6" style={{ color: "#1B2A4A" }}>A Life in Nigeria</h2>
            <p className="text-gray-700 leading-relaxed mb-5" style={{ fontFamily: "Georgia, serif" }}>
              On the 11th of December 1969, Oliver Berdeen Johnson stepped off a plane in Lagos on a 21-day visitor&rsquo;s permit. He has not left since. Born in Washington D.C. on 7 April 1940, he served in the US Army, studied at Pacific Lutheran University, joined the American Peace Corps and was posted to Kenya in 1967.
            </p>
            <p className="text-gray-700 leading-relaxed mb-5" style={{ fontFamily: "Georgia, serif" }}>
              By January 1971 he was Nigeria&rsquo;s National Coach of Basketball — the first person ever to hold that title on a full-time paid basis. He drove across the country in a Volkswagen Beetle painted in Nigeria&rsquo;s national colours, carrying basketballs, nets, and spare jerseys in the boot. People called it his &ldquo;moving gym.&rdquo;
            </p>
            <blockquote className="border-l-2 pl-5 italic my-8 text-gray-700 text-lg leading-relaxed" style={{ borderColor: "var(--gold)", fontFamily: "Georgia, serif" }}>
              &ldquo;You cannot talk about basketball in Nigeria without him.&rdquo;
              <cite className="block text-gray-500 text-xs not-italic mt-2">— Col. Sam Ahmedu, FIBA Africa Zone 3 President</cite>
            </blockquote>
            <p className="text-gray-700 leading-relaxed mb-5" style={{ fontFamily: "Georgia, serif" }}>
              He spotted a tall teenager named Hakeem Olajuwon in Lagos. The boy&rsquo;s parents did not want him playing basketball. Olajuwon asked OBJ not to tell them. OBJ didn&rsquo;t. He sent him to the University of Houston. Hakeem Olajuwon went on to be named one of the fifty greatest players in NBA history.
            </p>
            <p className="text-gray-700 leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
              On the courts of Ahmadu Bello University, a young Masai Ujiri came of age under OBJ&rsquo;s guidance. Ujiri is now President of the Toronto Raptors — NBA champions. The line runs direct: from a basketball court in Zaria to a front office in Toronto.
            </p>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-widest mb-8 text-gray-500" style={{ letterSpacing: "0.15em" }}>A Life&rsquo;s Record</h3>
            <div className="relative pl-7 border-l" style={{ borderColor: "rgba(201,162,39,0.4)" }}>
              {milestones.map((m, i) => (
                <div key={i} className="mb-7 relative">
                  <div className="absolute -left-[1.9rem] top-1 w-3 h-3 rounded-full border-2" style={{ background: "#f9f7f4", borderColor: "var(--gold)" }} />
                  <p className="text-xs mb-1 font-mono" style={{ color: "var(--gold)" }}>{m.year}</p>
                  <p className="text-gray-700 text-sm leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Photo grid */}
      <section className="py-16 sm:py-20 px-4 sm:px-6" style={{ background: "#eeeae4" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-widest mb-8 text-gray-500 text-center" style={{ letterSpacing: "0.15em" }}>
            Coach OBJ — Five Decades of Nigerian Basketball
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              { src: "/images/obj-bwob.jpeg", caption: "Basketball Without Borders Africa" },
              { src: "/images/obj-smile.jpeg", caption: "Coach OBJ" },
              { src: "/images/obj-green.jpeg", caption: "ABU Zaria courts" },
              { src: "/images/obj-trophy.jpeg", caption: "With trophy" },
              { src: "/images/obj-court.jpeg", caption: "On court" },
              { src: "/images/fotwrld-team.jpeg", caption: "FOTWRLD & Basketball for Peace team" },
            ].map((img) => (
              <div key={img.src} className="relative aspect-square rounded overflow-hidden group shadow-sm">
                <Image src={img.src} alt={img.caption} fill className="object-cover object-center group-hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 50vw, 33vw" quality={100} />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3" style={{ background: "linear-gradient(to top, rgba(17,29,53,0.85) 0%, transparent 60%)" }}>
                  <p className="text-white text-xs">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Basketball for Peace */}
      <section className="py-16 sm:py-20 px-4 sm:px-6" style={{ background: "#f9f7f4" }}>
        <div className="max-w-6xl mx-auto">
          <div className="p-8 sm:p-10 rounded" style={{ background: "rgba(201,162,39,0.07)", border: "1px solid rgba(201,162,39,0.25)" }}>
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "var(--gold)", letterSpacing: "0.15em" }}>Basketball for Peace</p>
            <p className="text-gray-700 leading-relaxed mb-5 max-w-3xl" style={{ fontFamily: "Georgia, serif" }}>
              He is now 86 years old. He is still in Zaria. He runs Basketball for Peace, founded in 2003 — now in sixteen states across thirty local government areas, with over fifty peace zones across Nigeria. The model is simple: basketball as a framework for coexistence. Rules on the court as a model for rules in society.
            </p>
            <blockquote className="border-l-2 pl-5 italic text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl" style={{ borderColor: "var(--gold)", fontFamily: "Georgia, serif" }}>
              &ldquo;No foreigner has contributed to the development of basketball in Nigeria as much as he has done.&rdquo;
              <cite className="block text-gray-500 text-xs not-italic mt-2">— Sam Ahmedu, FIBA Africa Zone 3 President</cite>
            </blockquote>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
