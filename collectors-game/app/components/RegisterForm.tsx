"use client";
import { useState } from "react";

const locations = [
  { value: "ncmm-kaduna", label: "NCMM, Kaduna" },
  { value: "open-art-abuja", label: "Open Art Expo, Abuja" },
  { value: "epac-lagos", label: "EPAC, Lagos" },
  { value: "obasanjo-ogun", label: "Obasanjo Library, Ogun State" },
  { value: "all", label: "All Venues — I'll attend wherever I can" },
];

const partnerTypes = [
  "Gallery or Exhibition Space",
  "Cultural Foundation or NGO",
  "University or Research Institution",
  "Basketball Club or Sports Organisation",
  "Community Organisation",
  "Corporate Cultural Programme",
  "Media or Documentation Partner",
  "Other",
];

type Tab = "attend" | "partner";
type Status = "idle" | "submitting" | "success" | "error";

export default function RegisterForm() {
  const [tab, setTab] = useState<Tab>("attend");
  const [attendStatus, setAttendStatus] = useState<Status>("idle");
  const [partnerStatus, setPartnerStatus] = useState<Status>("idle");

  async function handleAttend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAttendStatus("submitting");
    const form = e.currentTarget;
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString(),
      });
      setAttendStatus("success");
      form.reset();
    } catch {
      setAttendStatus("error");
    }
  }

  async function handlePartner(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPartnerStatus("submitting");
    const form = e.currentTarget;
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString(),
      });
      setPartnerStatus("success");
      form.reset();
    } catch {
      setPartnerStatus("error");
    }
  }

  return (
    <section id="register" className="py-20 px-4 sm:px-6" style={{ background: "#111d35" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--gold)", letterSpacing: "0.2em" }}>
          Get Involved
        </p>
        <div className="section-divider" />
        <div className="grid md:grid-cols-2 gap-6 mt-8 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Register to Attend<br />
            <span style={{ color: "var(--gold)" }}>or Partner With Us</span>
          </h2>
          <p className="text-gray-400 leading-relaxed self-end" style={{ fontFamily: "Georgia, serif" }}>
            Whether you want to attend the exhibition in your city, or you represent a gallery, club,
            or community that wants to be part of this — we want to hear from you.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-0 mb-10 border-b" style={{ borderColor: "rgba(201,162,39,0.2)" }}>
          <button
            onClick={() => setTab("attend")}
            className="px-6 py-3 text-xs tracking-widest uppercase font-bold transition-all"
            style={{
              letterSpacing: "0.15em",
              color: tab === "attend" ? "var(--gold)" : "#6b7280",
              borderBottom: tab === "attend" ? "2px solid var(--gold)" : "2px solid transparent",
              marginBottom: "-1px",
              background: "none",
              cursor: "pointer",
            }}
          >
            Register to Attend
          </button>
          <button
            onClick={() => setTab("partner")}
            className="px-6 py-3 text-xs tracking-widest uppercase font-bold transition-all"
            style={{
              letterSpacing: "0.15em",
              color: tab === "partner" ? "var(--gold)" : "#6b7280",
              borderBottom: tab === "partner" ? "2px solid var(--gold)" : "2px solid transparent",
              marginBottom: "-1px",
              background: "none",
              cursor: "pointer",
            }}
          >
            Partner With Us
          </button>
        </div>

        {/* ── ATTEND FORM ── */}
        {tab === "attend" && (
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Reserve Your Place</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6" style={{ fontFamily: "Georgia, serif" }}>
                The exhibition is free and open to the public. Register to let us know you&rsquo;re coming —
                we&rsquo;ll send you dates, times, and any updates as they are confirmed for your city.
              </p>
              <div className="space-y-3 text-sm">
                {locations.slice(0, 4).map((l) => (
                  <div key={l.value} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--gold)" }} />
                    <span className="text-gray-300">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {attendStatus === "success" ? (
              <div className="p-8 rounded text-center" style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.3)" }}>
                <p className="text-2xl mb-3" aria-hidden>✓</p>
                <p className="text-white font-bold mb-2">You&rsquo;re registered.</p>
                <p className="text-gray-400 text-sm" style={{ fontFamily: "Georgia, serif" }}>
                  We&rsquo;ll be in touch with details for your chosen venue.
                </p>
              </div>
            ) : (
              <form
                name="register-attend"
                method="POST"
                onSubmit={handleAttend}
                className="space-y-4"
              >
                <input type="hidden" name="form-name" value="register-attend" />

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2 text-gray-400" style={{ letterSpacing: "0.12em" }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your name"
                    className="w-full px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-600 transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,162,39,0.2)" }}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2 text-gray-400" style={{ letterSpacing: "0.12em" }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-600 transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,162,39,0.2)" }}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2 text-gray-400" style={{ letterSpacing: "0.12em" }}>
                    Which Venue? *
                  </label>
                  <select
                    name="location"
                    required
                    className="w-full px-4 py-3 text-sm text-white outline-none focus:border-yellow-600 transition-colors appearance-none"
                    style={{ background: "#1a2d4a", border: "1px solid rgba(201,162,39,0.2)" }}
                  >
                    <option value="" disabled selected>Select a location…</option>
                    {locations.map((l) => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2 text-gray-400" style={{ letterSpacing: "0.12em" }}>
                    Anything you&rsquo;d like to tell us? (optional)
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="School group, press, accessibility needs, or just a note…"
                    className="w-full px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-yellow-600 transition-colors resize-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,162,39,0.2)" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={attendStatus === "submitting"}
                  className="w-full py-3 text-xs tracking-widest uppercase font-bold transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: "var(--gold)", color: "#111d35", letterSpacing: "0.15em", cursor: attendStatus === "submitting" ? "wait" : "pointer" }}
                >
                  {attendStatus === "submitting" ? "Sending…" : "Register My Place"}
                </button>
                {attendStatus === "error" && (
                  <p className="text-red-400 text-xs text-center">Something went wrong. Please email fotwrldinfo@gmail.com directly.</p>
                )}
              </form>
            )}
          </div>
        )}

        {/* ── PARTNER FORM ── */}
        {tab === "partner" && (
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">We Are Looking for Partners</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6" style={{ fontFamily: "Georgia, serif" }}>
                We are actively seeking galleries, cultural clubs, community organisations,
                and institutions in all four cities who want to co-present, host satellite events,
                or be formally associated with The Collector&rsquo;s Game.
              </p>
              <div className="space-y-4">
                {[
                  { type: "Galleries & Exhibition Spaces", desc: "Co-present the exhibition or host a satellite programme in your space." },
                  { type: "Basketball Clubs & Sports Orgs", desc: "Bring your community through the doors. Help us reach the sport's audience." },
                  { type: "Cultural & Community Groups", desc: "Partner on outreach, education, or public programming around the exhibition." },
                ].map((item) => (
                  <div key={item.type} className="flex gap-3">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: "var(--gold)" }} />
                    <div>
                      <p className="text-white text-sm font-semibold">{item.type}</p>
                      <p className="text-gray-500 text-xs mt-0.5" style={{ fontFamily: "Georgia, serif" }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {partnerStatus === "success" ? (
              <div className="p-8 rounded text-center" style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.3)" }}>
                <p className="text-2xl mb-3" aria-hidden>✓</p>
                <p className="text-white font-bold mb-2">We&rsquo;ve received your interest.</p>
                <p className="text-gray-400 text-sm" style={{ fontFamily: "Georgia, serif" }}>
                  Someone from the FOTWRLD team will be in touch within a few days.
                </p>
              </div>
            ) : (
              <form
                name="partner-interest"
                method="POST"
                onSubmit={handlePartner}
                className="space-y-4"
              >
                <input type="hidden" name="form-name" value="partner-interest" />

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2 text-gray-400" style={{ letterSpacing: "0.12em" }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your name"
                    className="w-full px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,162,39,0.2)" }}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2 text-gray-400" style={{ letterSpacing: "0.12em" }}>
                    Organisation *
                  </label>
                  <input
                    type="text"
                    name="organisation"
                    required
                    placeholder="Gallery, club, foundation, institution…"
                    className="w-full px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,162,39,0.2)" }}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2 text-gray-400" style={{ letterSpacing: "0.12em" }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,162,39,0.2)" }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2 text-gray-400" style={{ letterSpacing: "0.12em" }}>
                      City / Venue *
                    </label>
                    <select
                      name="location"
                      required
                      className="w-full px-4 py-3 text-sm text-white outline-none transition-colors appearance-none"
                      style={{ background: "#1a2d4a", border: "1px solid rgba(201,162,39,0.2)" }}
                    >
                      <option value="" disabled selected>Select…</option>
                      <option value="kaduna">Kaduna</option>
                      <option value="abuja">Abuja</option>
                      <option value="lagos">Lagos</option>
                      <option value="ogun">Ogun State</option>
                      <option value="multiple">Multiple cities</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2 text-gray-400" style={{ letterSpacing: "0.12em" }}>
                      Type of Partner *
                    </label>
                    <select
                      name="partner-type"
                      required
                      className="w-full px-4 py-3 text-sm text-white outline-none transition-colors appearance-none"
                      style={{ background: "#1a2d4a", border: "1px solid rgba(201,162,39,0.2)" }}
                    >
                      <option value="" disabled selected>Select…</option>
                      {partnerTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2 text-gray-400" style={{ letterSpacing: "0.12em" }}>
                    Tell us about your interest *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    placeholder="What kind of partnership are you interested in? What does your organisation do? How do you see the collaboration working?"
                    className="w-full px-4 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors resize-none"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,162,39,0.2)" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={partnerStatus === "submitting"}
                  className="w-full py-3 text-xs tracking-widest uppercase font-bold transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: "var(--gold)", color: "#111d35", letterSpacing: "0.15em", cursor: partnerStatus === "submitting" ? "wait" : "pointer" }}
                >
                  {partnerStatus === "submitting" ? "Sending…" : "Submit Partnership Interest"}
                </button>
                {partnerStatus === "error" && (
                  <p className="text-red-400 text-xs text-center">Something went wrong. Please email fotwrldinfo@gmail.com directly.</p>
                )}
              </form>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
