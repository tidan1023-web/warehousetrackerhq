import Nav from "../components/Nav";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "Venues — The Collector's Game" };

const confirmedVenues = [
  {
    number: "01", city: "Kaduna", region: "North Nigeria",
    institution: "National Commission for Museums and Monuments",
    address: "No. 33 Ali Akilu Road, Kaduna",
    img: "/images/exhibition-audience.jpeg",
    imgCaption: "Audience at ABU Zaria — the academic community that gives this exhibition its intellectual foundation",
    argument: "Kaduna carries Nigeria's northern heritage and the authority of the National Commission for Museums and Monuments.",
    description: "Nigeria's foremost heritage institution. NCMM is where FOTWRLD is anchored; it is where Into The Archives 2026 was developed; and it is the institution that gives this kind of exhibition its cultural authority.",
    audience: "Students, practitioners, and the northern Nigerian cultural community will encounter the collection in a space that knows how to hold objects carefully.",
  },
  {
    number: "02", city: "Abuja", region: "FCT",
    institution: "Open Art Expo Exhibition Pavilion",
    address: "Abuja, Federal Capital Territory",
    img: "/images/collection-display.jpeg",
    imgCaption: "Young visitors engaging with art and cultural objects",
    argument: "Abuja is the administrative centre where culture and policy intersect.",
    description: "The collection meets Nigeria's contemporary art world. Abuja's gallery community draws collectors, diplomats, cultural attachés, and the professional class that follows the intersection of visual art and institutional life.",
    audience: "This is where the conversation about private collecting, cultural stewardship, and the relationship between basketball and art reaches its most commercially and diplomatically engaged audience.",
  },
  {
    number: "03", city: "Ogun State", region: "Southwest Nigeria",
    institution: "Olusegun Obasanjo Presidential Library",
    address: "Abeokuta, Ogun State",
    img: "/images/oopl-building.jpg",
    imgCaption: "Olusegun Obasanjo Presidential Library, Abeokuta — an institution designed for legacy and documentation",
    argument: "Ogun State is a site already accustomed to holding Nigerian history at the level it deserves.",
    description: "An institution built around the life of a man who defined an era of Nigerian public history. OBJ has lived a life of comparable public consequence in his own field.",
    audience: "Placing his collection in a space designed for legacy and documentation is a deliberate editorial choice.",
  },
];

const seekingVenues = [
  {
    city: "Lagos",
    region: "Southwest Nigeria",
    pitch: "Lagos is the NBA's most important city outside of North America. The basketball community here is enormous — and so is the art audience. We are looking for a gallery, cultural space, or community institution in Lagos that wants to co-present The Collector's Game.",
    looking: ["Gallery or exhibition space", "Cultural foundation or arts centre", "Basketball club or community space", "Corporate cultural programme"],
  },
];

export default function VenuesPage() {
  return (
    <main style={{ background: "#f9f7f4" }}>
      <Nav />

      {/* Hero */}
      <section className="pt-32 sm:pt-40 pb-16 px-4 sm:px-6" style={{ background: "linear-gradient(160deg, #111d35 0%, #1B2A4A 100%)" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--gold)", letterSpacing: "0.2em" }}>The Venues</p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-none mb-6">
            Four Cities,<br />One Journey
          </h1>
          <p className="text-base sm:text-lg italic text-gray-300 max-w-2xl" style={{ fontFamily: "Georgia, serif" }}>
            Three venues confirmed. Lagos still open — we are calling on galleries and institutions to join us.
          </p>
        </div>
      </section>

      {/* Confirmed venues */}
      <section className="py-16 px-4 sm:px-6" style={{ background: "#f9f7f4" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--gold)", letterSpacing: "0.2em" }}>Confirmed Venues</p>
          <div className="section-divider mb-12" />

          <div className="space-y-20">
            {confirmedVenues.map((v, i) => (
              <div key={v.city} className={`grid md:grid-cols-2 gap-8 md:gap-14 items-start ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}>

                <div className={`relative h-64 sm:h-80 md:h-[420px] rounded overflow-hidden shadow-md ${i % 2 === 1 ? "[direction:ltr]" : ""}`}>
                  <Image src={v.img} alt={v.institution} fill className="object-cover object-center" sizes="(max-width:768px) 100vw, 50vw" quality={100} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(17,29,53,0.85) 0%, transparent 55%)" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <span className="text-xs font-mono block mb-1" style={{ color: "var(--gold)" }}>Venue {v.number}</span>
                    <p className="text-white font-black text-2xl sm:text-3xl leading-none">{v.city}</p>
                    <p className="text-gray-300 text-xs mt-1">{v.region}</p>
                  </div>
                </div>

                <div className={i % 2 === 1 ? "[direction:ltr]" : ""}>
                  <span className="text-xs px-3 py-1 rounded-full inline-block mb-4" style={{ background: "rgba(201,162,39,0.12)", color: "#8b6914" }}>{v.region}</span>
                  <h2 className="text-xl sm:text-2xl font-bold mb-1" style={{ color: "#1B2A4A" }}>{v.institution}</h2>
                  <p className="text-gray-500 text-xs mb-5">{v.address}</p>
                  <div className="w-8 h-px mb-6" style={{ background: "var(--gold)" }} />
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs uppercase tracking-widest mb-2 text-gray-500" style={{ letterSpacing: "0.12em" }}>The Argument</p>
                      <p className="text-gray-700 text-sm leading-relaxed italic" style={{ fontFamily: "Georgia, serif" }}>&ldquo;{v.argument}&rdquo;</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest mb-2 text-gray-500" style={{ letterSpacing: "0.12em" }}>The Venue</p>
                      <p className="text-gray-700 text-sm leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>{v.description}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest mb-2 text-gray-500" style={{ letterSpacing: "0.12em" }}>The Audience</p>
                      <p className="text-gray-700 text-sm leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>{v.audience}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-5 italic" style={{ fontFamily: "Georgia, serif" }}>{v.imgCaption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seeking venue partners */}
      <section className="py-16 px-4 sm:px-6" style={{ background: "#eeeae4" }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--gold)", letterSpacing: "0.2em" }}>Seeking Venue Partners</p>
          <div className="section-divider mb-4" />
          <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mb-12 mt-6" style={{ fontFamily: "Georgia, serif" }}>
            We are actively looking for galleries, cultural institutions, and community spaces in Lagos and Abuja
            to co-present The Collector&rsquo;s Game. If your space or organisation is the right fit, we want to hear from you.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {seekingVenues.map((v) => (
              <div key={v.city} className="p-7 sm:p-8 rounded" style={{ background: "#ffffff", border: "1px solid rgba(201,162,39,0.25)" }}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs font-mono mb-1" style={{ color: "var(--gold)" }}>Venue Open</p>
                    <h2 className="text-2xl sm:text-3xl font-black" style={{ color: "#1B2A4A" }}>{v.city}</h2>
                    <p className="text-gray-500 text-xs mt-1">{v.region}</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full mt-1" style={{ background: "rgba(201,162,39,0.1)", color: "#8b6914", whiteSpace: "nowrap" }}>
                    Partner Sought
                  </span>
                </div>

                <div className="w-8 h-px my-5" style={{ background: "var(--gold)" }} />

                <p className="text-gray-700 text-sm leading-relaxed mb-6" style={{ fontFamily: "Georgia, serif" }}>{v.pitch}</p>

                <div className="mb-6">
                  <p className="text-xs uppercase tracking-widest mb-3 text-gray-500" style={{ letterSpacing: "0.12em" }}>We Are Looking For</p>
                  <ul className="space-y-2">
                    {v.looking.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--gold)" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/#register"
                  className="inline-block px-6 py-2.5 text-xs tracking-widest uppercase font-bold transition-all hover:opacity-90"
                  style={{ background: "var(--gold)", color: "#111d35", letterSpacing: "0.15em" }}
                >
                  Express Interest →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
