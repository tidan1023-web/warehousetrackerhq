const venues = [
  {
    city: "Kaduna",
    number: "01",
    institution: "National Commission for Museums and Monuments",
    description:
      "Nigeria's foremost heritage institution. NCMM is where FOTWRLD is anchored; it is where Into The Archives 2026 was developed. Kaduna audiences — including students, practitioners, and the northern Nigerian cultural community — will encounter the collection in a space that knows how to hold objects carefully.",
    significance: "Nigeria's formal heritage infrastructure",
  },
  {
    city: "Abuja",
    number: "02",
    institution: "Open Art Expo Gallery",
    description:
      "The collection meets Nigeria's contemporary art world. Abuja's gallery community draws collectors, diplomats, cultural attachés, and the professional class that follows the intersection of visual art and institutional life. This is where the conversation about private collecting, cultural stewardship, and the relationship between basketball and art in Nigeria reaches its most commercially and diplomatically engaged audience.",
    significance: "Administrative centre — culture and policy intersect",
  },
  {
    city: "Lagos",
    number: "03",
    institution: "EPAC Creative Studio, Ecobank Headquarters",
    description:
      "Lagos is the NBA's most important city outside of North America. The city does not go to basketball events because they are fashionable. They go because the sport is woven into the social fabric in a way that football gets all the credit for — but basketball, quietly, has always matched. The Collector's Game lands here.",
    significance: "The NBA's most important African city",
  },
  {
    city: "Ogun State",
    number: "04",
    institution: "Olusegun Obasanjo Presidential Library",
    description:
      "An institution built around the life of a man who defined an era of Nigerian public history. The resonance is not incidental. OBJ has lived a life of comparable public consequence in his own field, and placing his collection in a space designed for legacy and documentation is a deliberate editorial choice.",
    significance: "A site accustomed to holding Nigerian history",
  },
];

export default function Venues() {
  return (
    <section id="venues" className="py-28 px-6" style={{ background: "var(--navy)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--gold)", letterSpacing: "0.2em" }}>
          The Venues
        </p>
        <div className="section-divider" />

        <div className="flex flex-col md:flex-row md:items-end justify-between mt-12 mb-16 gap-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Four Cities,
            <br />
            One Journey
          </h2>
          <p className="text-gray-400 max-w-sm text-sm leading-relaxed italic" style={{ fontFamily: "Georgia, serif" }}>
            Each venue was chosen not for convenience but for argument.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {venues.map((v) => (
            <div
              key={v.city}
              className="relative p-8 rounded overflow-hidden group"
              style={{
                background: "rgba(17,29,53,0.6)",
                border: "1px solid rgba(201,162,39,0.2)",
              }}
            >
              {/* Large number watermark */}
              <span
                className="absolute top-4 right-6 text-8xl font-black opacity-5 select-none"
                style={{ color: "var(--gold)", lineHeight: 1 }}
              >
                {v.number}
              </span>

              <div className="relative z-10">
                <p className="text-xs font-mono mb-2" style={{ color: "var(--gold)" }}>
                  Venue {v.number}
                </p>
                <h3 className="text-2xl font-bold text-white mb-1">{v.city}</h3>
                <p className="text-sm text-gray-400 mb-1 italic" style={{ fontFamily: "Georgia, serif" }}>
                  {v.institution}
                </p>
                <p
                  className="text-xs uppercase tracking-widest mb-5"
                  style={{ color: "var(--gold)", letterSpacing: "0.12em", opacity: 0.7 }}
                >
                  {v.significance}
                </p>
                <div className="w-8 h-px mb-5" style={{ background: "var(--gold)" }} />
                <p className="text-gray-300 text-sm leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                  {v.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
