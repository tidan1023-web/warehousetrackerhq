const milestones = [
  { year: "1940", label: "Born in Washington D.C., 7 April" },
  { year: "1967", label: "Posted to Kenya with the American Peace Corps" },
  { year: "1969", label: "Arrived in Lagos on a 21-day visitor's permit. Has not left since." },
  { year: "1971", label: "Appointed Nigeria's first full-time National Coach of Basketball" },
  { year: "1972", label: "Established women's basketball in Nigeria; first international tour" },
  { year: "1971", label: "Hosted Kareem Abdul-Jabbar & Oscar Robinson coaching clinic at UNILAG" },
  { year: "1978", label: "Moved to Ahmadu Bello University, Zaria — mentored Masai Ujiri" },
  { year: "2003", label: "Founded Basketball for Peace, now in 16 states across 30+ LGAs" },
  { year: "2015", label: "FIBA Africa Career Achievement Award, Tunis. Nigeria wins Afro Basketball Gold." },
];

const quotes = [
  {
    text: "You cannot talk about basketball in Nigeria without him.",
    attribution: "Col. Sam Ahmedu, FIBA Africa Zone 3 President",
  },
  {
    text: "No foreigner has contributed to the development of basketball in Nigeria as much as he has done.",
    attribution: "Basketball in Nigeria: Yesterday Today Tomorrow",
  },
];

export default function Collector() {
  return (
    <section id="collector" className="py-28 px-6" style={{ background: "var(--navy)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--gold)", letterSpacing: "0.2em" }}>
          The Collector
        </p>
        <div className="section-divider" />

        <div className="grid md:grid-cols-2 gap-16 mt-12">
          {/* Left — story */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              The Man Who Kept Everything
            </h2>
            <p className="text-sm italic text-gray-400 mb-8" style={{ fontFamily: "Georgia, serif" }}>
              On Coach OBJ — the man who built Nigerian basketball, trained Hakeem Olajuwon and Masai Ujiri,
              and spent five decades collecting the objects that tell a deeper story.
            </p>

            <p className="text-gray-300 leading-relaxed mb-5" style={{ fontFamily: "Georgia, serif" }}>
              On the 11th of December 1969, Oliver Berdeen Johnson stepped off a plane in Lagos on a 21-day
              visitor&rsquo;s permit. He has not left since.
            </p>
            <p className="text-gray-300 leading-relaxed mb-5" style={{ fontFamily: "Georgia, serif" }}>
              He was born in Washington D.C. on 7 April 1940. He served in the US Army, studied health and
              physical education at Pacific Lutheran University, joined the American Peace Corps and was posted to
              Kenya in 1967. He travelled the continent. He met Nigerians at parties in Nairobi — they were always
              the liveliest people in the room — and when he finally landed in Lagos, he knew within a week. This was home.
            </p>
            <p className="text-gray-300 leading-relaxed mb-5" style={{ fontFamily: "Georgia, serif" }}>
              By January 1971, he was Nigeria&rsquo;s National Coach of Basketball — the first person ever to hold
              that title on a full-time paid basis. He drove across the country in a Volkswagen Beetle painted in
              Nigeria&rsquo;s national colours, carrying basketballs, nets, and spare jerseys in the boot.
              People called it his &ldquo;moving gym.&rdquo;
            </p>
            <p className="text-gray-300 leading-relaxed mb-5" style={{ fontFamily: "Georgia, serif" }}>
              He spotted a tall teenager named Hakeem Olajuwon in Lagos. The boy&rsquo;s parents did not want him
              playing basketball; they wanted him studying. Olajuwon asked OBJ not to tell them. OBJ didn&rsquo;t.
              He sent him to the University of Houston instead. Hakeem Olajuwon went on to be named one of the
              fifty greatest players in NBA history.
            </p>
            <p className="text-gray-300 leading-relaxed mb-8" style={{ fontFamily: "Georgia, serif" }}>
              He is now 86 years old. He is still in Zaria. He coaches. He organises. He runs Basketball for Peace,
              which he founded in 2003 — now operating in sixteen states across thirty local government areas, with
              over fifty peace zones established across Nigeria. The model is simple and powerful: basketball as a
              framework for coexistence.
            </p>

            {/* Quotes */}
            <div className="space-y-6">
              {quotes.map((q) => (
                <blockquote
                  key={q.attribution}
                  className="border-l-2 pl-6 italic"
                  style={{ borderColor: "var(--gold)", fontFamily: "Georgia, serif" }}
                >
                  <p className="text-white text-lg leading-relaxed mb-2">&ldquo;{q.text}&rdquo;</p>
                  <cite className="text-gray-400 text-xs not-italic tracking-wide">— {q.attribution}</cite>
                </blockquote>
              ))}
            </div>
          </div>

          {/* Right — timeline */}
          <div>
            <h3 className="text-sm uppercase tracking-widest mb-8 text-gray-400" style={{ letterSpacing: "0.15em" }}>
              A Life&rsquo;s Record
            </h3>
            <div className="relative pl-8 border-l" style={{ borderColor: "rgba(201,162,39,0.3)" }}>
              {milestones.map((m, i) => (
                <div key={i} className="mb-8 relative">
                  <div
                    className="absolute -left-[2.15rem] top-1 w-3 h-3 rounded-full border-2"
                    style={{ background: "var(--navy)", borderColor: "var(--gold)" }}
                  />
                  <p className="text-xs mb-1 font-mono" style={{ color: "var(--gold)" }}>{m.year}</p>
                  <p className="text-gray-300 text-sm leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                    {m.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Citizenship note */}
            <div className="mt-10 p-6 rounded" style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.2)" }}>
              <p className="text-gray-300 text-sm leading-relaxed italic" style={{ fontFamily: "Georgia, serif" }}>
                He became a Nigerian citizen — one of the first Black Americans to do so by that route.
                Acquaintances changed the middle initial of his name, &lsquo;B&rsquo;, to mean something different
                in each region: Babatunde in the West, Bala in the North, Bassey in the East.
                He was not trying to blend in. He belonged.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
