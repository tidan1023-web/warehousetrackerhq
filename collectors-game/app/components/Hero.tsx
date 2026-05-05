export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #111d35 0%, #1B2A4A 60%, #0d1826 100%)" }}
    >
      {/* Decorative grid lines */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Top label */}
      <p
        className="text-xs tracking-widest uppercase mb-10 opacity-70"
        style={{ color: "var(--gold)", letterSpacing: "0.25em" }}
      >
        FOTWRLD × Basketball for Peace — A Travelling Exhibition
      </p>

      {/* Main title */}
      <div className="relative z-10 mb-8">
        <p
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white"
          style={{ letterSpacing: "-0.01em", lineHeight: 1 }}
        >
          THE
        </p>
        <p
          className="text-6xl md:text-9xl lg:text-[11rem] font-black tracking-tight leading-none"
          style={{ color: "var(--gold)", letterSpacing: "-0.02em", lineHeight: 0.85 }}
        >
          COLLECTORS
        </p>
        <p
          className="text-6xl md:text-9xl lg:text-[11rem] font-black tracking-tight leading-none text-white"
          style={{ letterSpacing: "-0.02em", lineHeight: 0.85 }}
        >
          GAME
        </p>
      </div>

      {/* Subtitle */}
      <p
        className="italic text-base md:text-xl text-gray-300 mt-8 max-w-xl"
        style={{ fontFamily: "Georgia, serif" }}
      >
        Art, Basketball, and the Private Life of a Public Man
      </p>

      {/* Divider */}
      <div className="my-8 w-16 h-px" style={{ background: "var(--gold)" }} />

      {/* Pull quote */}
      <p
        className="italic text-sm md:text-base text-gray-400 max-w-lg leading-relaxed"
        style={{ fontFamily: "Georgia, serif" }}
      >
        &ldquo;The question is not whether this exhibition merits Ecobank&rsquo;s support.
        <br />
        The question is what Ecobank wants to say about Nigerian culture in 2026.&rdquo;
      </p>

      {/* Venues strip */}
      <div className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-2">
        {[
          "NCMM, Kaduna",
          "Open Art Expo, Abuja",
          "EPAC Creative Studio, Lagos",
          "Obasanjo Presidential Library, Ogun",
        ].map((v) => (
          <span key={v} className="text-xs tracking-widest uppercase text-gray-500" style={{ letterSpacing: "0.15em" }}>
            {v}
          </span>
        ))}
      </div>

      {/* Scroll cue */}
      <a
        href="#exhibition"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity"
        aria-label="Scroll down"
      >
        <span className="text-xs tracking-widest uppercase text-gray-400" style={{ letterSpacing: "0.2em" }}>
          Explore
        </span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="animate-bounce">
          <path d="M8 0v20M1 13l7 7 7-7" stroke="#C9A227" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </a>
    </section>
  );
}
