import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Image from "next/image";

export const metadata = { title: "Venues — The Collector's Game" };

const venues = [
  {
    number: "01", city: "Kaduna", region: "North Nigeria",
    institution: "National Commission for Museums and Monuments",
    address: "No. 33 Ali Akilu Road, Kaduna",
    significance: "Nigeria's formal heritage infrastructure",
    img: "/images/exhibition-audience.jpeg",
    imgCaption: "Audience at ABU Zaria — the academic community that gives this exhibition its intellectual foundation",
    argument: "Kaduna carries Nigeria's northern heritage and the authority of the National Commission for Museums and Monuments.",
    description: "Nigeria's foremost heritage institution. NCMM is where FOTWRLD is anchored; it is where Into The Archives 2026 was developed; and it is the institution that gives this kind of exhibition its cultural authority.",
    audience: "Students, practitioners, and the northern Nigerian cultural community will encounter the collection in a space that knows how to hold objects carefully.",
  },
  {
    number: "02", city: "Abuja", region: "FCT",
    institution: "Open Art Expo Gallery",
    address: "Abuja, Federal Capital Territory",
    significance: "Where culture and policy intersect",
    img: "/images/collection-display.jpeg",
    imgCaption: "Young visitors engaging with art and cultural objects",
    argument: "Abuja is the administrative centre where culture and policy intersect.",
    description: "The collection meets Nigeria's contemporary art world. Abuja's gallery community draws collectors, diplomats, cultural attachés, and the professional class that follows the intersection of visual art and institutional life.",
    audience: "This is where the conversation about private collecting, cultural stewardship, and the relationship between basketball and art in Nigeria reaches its most commercially and diplomatically engaged audience.",
  },
  {
    number: "03", city: "Lagos", region: "Southwest Nigeria",
    institution: "EPAC Creative Studio, Ecobank Headquarters",
    address: "Ecobank Headquarters, Lagos State",
    significance: "The NBA's most important African city",
    img: "/images/obj-bwob.jpeg",
    imgCaption: "Basketball Without Borders Africa — the sporting culture that underpins Lagos's relationship with the game",
    argument: "Lagos is raving about basketball. The NBA has been saying it for years.",
    description: "Lagos is the NBA's most important city outside of North America. People here do not go to basketball events because they are fashionable — they go because the sport is woven into the social fabric of the city.",
    audience: "The city's basketball community, art audiences, and the broad Lagos cultural public that turned out for NBA Africa events.",
  },
  {
    number: "04", city: "Ogun State", region: "Southwest Nigeria",
    institution: "Olusegun Obasanjo Presidential Library",
    address: "Olusegun Obasanjo Presidential Library, Abeokuta",
    significance: "A site designed for legacy and documentation",
    img: "/images/editorial-pottery.jpeg",
    imgCaption: "The material objects of OBJ's collection — placed now in an institution designed for national legacy",
    argument: "Ogun State is a site already accustomed to holding Nigerian history at the level it deserves.",
    description: "An institution built around the life of a man who defined an era of Nigerian public history. OBJ has lived a life of comparable public consequence in his own field.",
    audience: "Placing his collection in a space designed for legacy and documentation is a deliberate editorial choice.",
  },
];

export default function VenuesPage() {
  return (
    <main>
      <Nav />

      <section className="pt-32 sm:pt-40 pb-16 px-4 sm:px-6" style={{ background: "linear-gradient(160deg, #111d35 0%, #1B2A4A 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--gold)", letterSpacing: "0.2em" }}>The Venues</p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-none mb-6">
            Four Cities,<br />One Journey
          </h1>
          <p className="text-base sm:text-lg italic text-gray-300 max-w-2xl" style={{ fontFamily: "Georgia, serif" }}>
            Each venue was chosen not for convenience but for argument.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6" style={{ background: "var(--navy-dark)" }}>
        <div className="max-w-6xl mx-auto space-y-20">
          {venues.map((v, i) => (
            <div key={v.city} className={`grid md:grid-cols-2 gap-8 md:gap-14 items-start ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}>

              {/* Image */}
              <div className={`relative h-64 sm:h-80 md:h-[420px] rounded overflow-hidden ${i % 2 === 1 ? "[direction:ltr]" : ""}`}>
                <Image src={v.img} alt={v.institution} fill className="object-cover object-center" sizes="(max-width:768px) 100vw, 50vw" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(17,29,53,0.85) 0%, transparent 55%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <span className="text-xs font-mono block mb-1" style={{ color: "var(--gold)" }}>Venue {v.number}</span>
                  <p className="text-white font-black text-2xl sm:text-3xl leading-none">{v.city}</p>
                  <p className="text-gray-300 text-xs mt-1">{v.region}</p>
                </div>
              </div>

              {/* Text */}
              <div className={i % 2 === 1 ? "[direction:ltr]" : ""}>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(201,162,39,0.15)", color: "var(--gold)" }}>
                    {v.region}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">{v.institution}</h2>
                <p className="text-gray-500 text-xs mb-5">{v.address}</p>

                <div className="w-8 h-px mb-6" style={{ background: "var(--gold)" }} />

                <div className="space-y-5">
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-2 text-gray-500" style={{ letterSpacing: "0.12em" }}>The Argument</p>
                    <p className="text-gray-200 text-sm leading-relaxed italic" style={{ fontFamily: "Georgia, serif" }}>
                      &ldquo;{v.argument}&rdquo;
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-2 text-gray-500" style={{ letterSpacing: "0.12em" }}>The Venue</p>
                    <p className="text-gray-300 text-sm leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>{v.description}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-2 text-gray-500" style={{ letterSpacing: "0.12em" }}>The Audience</p>
                    <p className="text-gray-300 text-sm leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>{v.audience}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mt-5 italic" style={{ fontFamily: "Georgia, serif" }}>{v.imgCaption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
