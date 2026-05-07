import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #111d35 0%, #1B2A4A 60%, #0d1826 100%)" }}
    >
      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Cover image strip — left side */}
      <div className="absolute left-0 top-0 h-full w-32 md:w-48 overflow-hidden opacity-20">
        <Image
          src="/images/editorial-pottery.jpeg"
          alt=""
          fill
          className="object-cover object-center"
          sizes="192px"
        />
      </div>
      {/* Cover image strip — right side */}
      <div className="absolute right-0 top-0 h-full w-32 md:w-48 overflow-hidden opacity-20">
        <Image
          src="/images/exhibition-crowd.jpeg"
          alt=""
          fill
          className="object-cover object-center"
          sizes="192px"
        />
      </div>

      {/* Top label */}
      <p
        className="relative z-10 text-xs tracking-widest uppercase mb-10 opacity-80"
        style={{ color: "var(--gold)", letterSpacing: "0.25em" }}
      >
        FOTWRLD × Basketball for Peace — A Travelling Exhibition
      </p>

      {/* Main title */}
      <div className="relative z-10 mb-8">
        <p className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white" style={{ lineHeight: 1 }}>
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

      <p className="relative z-10 italic text-base md:text-xl text-gray-300 mt-8 max-w-xl" style={{ fontFamily: "Georgia, serif" }}>
        Art, Basketball, and the Private Life of a Public Man
      </p>

      <div className="relative z-10 my-8 w-16 h-px" style={{ background: "var(--gold)" }} />

      <p className="relative z-10 italic text-sm md:text-base text-gray-400 max-w-lg leading-relaxed" style={{ fontFamily: "Georgia, serif" }}>
        &ldquo;The question is not whether this exhibition merits support.
        <br />
        The question is what you want to say about Nigerian culture in 2026.&rdquo;
      </p>

      {/* Venue pills */}
      <div className="relative z-10 mt-10 flex flex-wrap justify-center gap-x-8 gap-y-2">
        {["NCMM, Kaduna", "Obasanjo Library, Ogun"].map((v) => (
          <span key={v} className="text-xs tracking-widest uppercase text-gray-500" style={{ letterSpacing: "0.15em" }}>
            {v}
          </span>
        ))}
      </div>

      {/* CTA buttons */}
      <div className="relative z-10 mt-12 flex flex-wrap justify-center gap-4">
        <Link
          href="/exhibition"
          className="px-8 py-3 text-xs tracking-widest uppercase font-semibold transition-all hover:opacity-90"
          style={{ background: "var(--gold)", color: "#111d35", letterSpacing: "0.15em" }}
        >
          Explore the Exhibition
        </Link>
        <Link
          href="/collection"
          className="px-8 py-3 text-xs tracking-widest uppercase font-semibold border transition-all hover:bg-white hover:text-navy"
          style={{ borderColor: "rgba(255,255,255,0.3)", color: "#fff", letterSpacing: "0.15em" }}
        >
          View the Collection
        </Link>
      </div>

      {/* Scroll cue */}
      <a
        href="#partners"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 hover:opacity-100 transition-opacity"
        aria-label="Scroll to partners"
      >
        <span className="text-xs tracking-widest uppercase text-gray-400" style={{ letterSpacing: "0.2em" }}>Scroll</span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="animate-bounce">
          <path d="M8 0v20M1 13l7 7 7-7" stroke="#C9A227" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </a>
    </section>
  );
}
