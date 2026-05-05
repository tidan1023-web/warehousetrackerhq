export default function Exhibition() {
  return (
    <section id="exhibition" className="py-28 px-6" style={{ background: "var(--navy-dark)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <p className="text-xs tracking-widest uppercase mb-4 text-gold" style={{ color: "var(--gold)", letterSpacing: "0.2em" }}>
          The Exhibition
        </p>
        <div className="section-divider" />

        <div className="grid md:grid-cols-2 gap-16 mt-12">
          {/* Left — headline + intro */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
              The Collector&rsquo;s Game
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6" style={{ fontFamily: "Georgia, serif" }}>
              Oliver Berdeen Johnson has spent his life around people who understand that objects carry meaning.
              In basketball, the object is simply a ball, a court, a rim. But what surrounds it is anything but.
              Trophies. Jerseys. Photographs. The material record of a career, a community, a country&rsquo;s athletic ambition.
            </p>
            <p className="text-gray-300 leading-relaxed mb-6" style={{ fontFamily: "Georgia, serif" }}>
              The private collection Johnson has assembled over 40 years reflects the same instinct applied to a different register.
              Ladi Kwali Pottery. Benin bronzes. Metalwork. Textile Art from across Nigeria. Objects that were made, in some cases,
              decades before the first basketball court was laid in Lagos — but which carry the same insistence on precision,
              on craft, on making something that outlasts the moment of its making.
            </p>
            <blockquote
              className="border-l-2 pl-6 my-8 italic text-gray-300 text-lg leading-relaxed"
              style={{ borderColor: "var(--gold)", fontFamily: "Georgia, serif" }}
            >
              &ldquo;What does a man keep?
              <br />
              And what does the keeping tell us about who he is?&rdquo;
            </blockquote>
          </div>

          {/* Right — what the exhibition does */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-6 uppercase tracking-widest text-sm" style={{ letterSpacing: "0.15em" }}>
              Four Cities, One Journey
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6" style={{ fontFamily: "Georgia, serif" }}>
              The Collector&rsquo;s Game puts Coach OBJ&rsquo;s record into rooms where other people can walk through it.
              Four rooms, in four cities, across the length of the country. Each venue was chosen not for convenience
              but for argument.
            </p>
            <p className="text-gray-300 leading-relaxed mb-8" style={{ fontFamily: "Georgia, serif" }}>
              The exhibition does not ask visitors to simply look. It asks them to think about what it means for a man
              whose life has been defined by sport to have also spent decades building a collection that speaks to the
              material history of West Africa. It asks what basketball and bronze have in common. And it invites a
              conversation about documentation — about what gets recorded, what gets displayed, and who gets to decide.
            </p>

            <div className="p-6 rounded" style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.2)" }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "var(--gold)", letterSpacing: "0.15em" }}>
                The Technology Thread
              </p>
              <p className="text-gray-300 text-sm leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
                One of the exhibition&rsquo;s intentions is to open a conversation about how Nigerian sport is documented —
                not just played. Visitors will be invited into a conversation about what it means to keep things
                and what gets lost when we do not.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
