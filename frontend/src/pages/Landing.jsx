import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, Calculator, Database, FileText, ArrowRight,
  CheckCircle, TrendingUp, Shield, Clock, ChevronRight,
} from 'lucide-react';

const HOW_IT_WORKS = [
  {
    n: '01',
    title: 'Add Your Past Projects',
    desc: 'Enter completed residential projects — size, condition, tier, and final cost. Each project becomes a data point that improves your estimates.',
  },
  {
    n: '02',
    title: 'Enter the New Project',
    desc: 'Input the project size in m², select the current condition of the property, and choose the desired finish tier.',
  },
  {
    n: '03',
    title: 'The Engine Calculates',
    desc: 'The system normalises past projects, removes outliers, adjusts for inflation and size, and produces a reliable ballpark cost.',
  },
  {
    n: '04',
    title: 'Review, Adjust & Send PDF',
    desc: 'Review the three-tier breakdown, edit client details and scope notes, then download a professional PDF on company letterhead.',
  },
];

const CONDITIONS = [
  { label: 'Carcass',          desc: 'Structure only — full interior scope ahead' },
  { label: 'Advanced Carcass', desc: 'External shell done — internal scope ahead' },
  { label: 'Semi-Finished',    desc: 'MEP rough-in done — finishes and fit-out ahead' },
  { label: 'Finished',         desc: 'Complete house needing a facelift' },
];

const TIERS = [
  { label: 'Basic',     color: 'bg-gray-100 text-gray-700',   desc: 'Functional and clean' },
  { label: 'Mid-Range', color: 'bg-blue-100 text-blue-700',   desc: 'Smart and polished' },
  { label: 'Premium',   color: 'bg-purple-100 text-purple-700', desc: 'High-end and bespoke' },
];

const FEATURES = [
  {
    icon: Database,
    color: 'bg-indigo-50 text-indigo-600',
    title: 'Learns from Your History',
    desc: 'Every completed project you add makes the next estimate more accurate. The engine uses your own data, not industry averages.',
  },
  {
    icon: TrendingUp,
    color: 'bg-green-50 text-green-600',
    title: 'Outlier Removal',
    desc: 'Unusual projects — too cheap or too expensive — are automatically detected and excluded so they don\'t skew your figures.',
  },
  {
    icon: Calculator,
    color: 'bg-blue-50 text-blue-600',
    title: 'Transparent Breakdown',
    desc: 'Every estimate shows exactly how the number was reached: base rate, condition adjustment, tier adjustment, and size scaling.',
  },
  {
    icon: FileText,
    color: 'bg-orange-50 text-orange-600',
    title: 'PDF on Letterhead',
    desc: 'Download a clean, professional preliminary estimate on your company letterhead with your logo, signature, and disclaimer.',
  },
  {
    icon: Clock,
    color: 'bg-yellow-50 text-yellow-600',
    title: 'Estimate History',
    desc: 'Every estimate is saved — who it was sent to, what assumptions were used, what rate was applied, and its current status.',
  },
  {
    icon: Shield,
    color: 'bg-red-50 text-red-600',
    title: 'Economies of Scale',
    desc: 'Larger projects automatically get a lower rate per m². Smaller projects get a higher rate. The size adjustment is baked in.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-900 rounded-xl flex items-center justify-center shrink-0">
              <Building2 size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-primary-900 leading-tight">Pico Bello Projekte</p>
              <p className="text-xs text-gray-400 hidden sm:block">Residential Estimator</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary-900 transition-colors px-2 py-1">
              Sign In
            </Link>
            <Link to="/register"
              className="bg-primary-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-800 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="bg-primary-900 text-white pt-20 pb-28 px-5 sm:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-400" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-blue-300" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-widest uppercase">
            Residential Construction · Abuja
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Ballpark Estimates<br />
            <span className="text-blue-300">Based on Your Own Projects</span>
          </h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            Before a full BOQ, you need a fast, credible number to share with a client.
            This tool uses your completed project history to produce a realistic cost estimate —
            adjusted for condition, finish tier, size, and inflation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"
              className="flex items-center justify-center gap-2 bg-white text-primary-900 font-semibold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
              Start Estimating <ArrowRight size={18} />
            </Link>
            <Link to="/login"
              className="flex items-center justify-center gap-2 border border-blue-400/40 text-white font-medium px-7 py-3.5 rounded-xl hover:bg-primary-800 transition-colors">
              Sign In
            </Link>
          </div>
          <div className="flex flex-wrap gap-6 justify-center mt-12 text-blue-300 text-sm">
            {['Experience-based', 'Outlier-resistant', 'PDF on letterhead', 'Full audit trail'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-blue-400" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-5 sm:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">From opening the tool to sending a PDF — in under two minutes.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {HOW_IT_WORKS.map(({ n, title, desc }) => (
              <div key={n} className="flex gap-5">
                <div className="text-5xl font-black text-primary-100 leading-none shrink-0 w-12 select-none">{n}</div>
                <div className="pt-1">
                  <h3 className="font-semibold text-gray-800 mb-1.5">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONDITION + TIER GRID */}
      <section className="py-24 px-5 sm:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Four Conditions, Three Tiers</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Select where the property starts and the quality of finish the client wants.
              The engine handles the rest.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {/* Conditions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Starting Condition</p>
              <div className="space-y-3">
                {CONDITIONS.map(({ label, desc }) => (
                  <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                    <ChevronRight size={15} className="text-primary-900 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Tiers */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Finish Tier</p>
              <div className="space-y-3">
                {TIERS.map(({ label, color, desc }) => (
                  <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${color}`}>{label}</span>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                ))}
                <div className="mt-4 p-4 bg-primary-50 rounded-xl border border-primary-100">
                  <p className="text-xs text-primary-700 font-medium leading-relaxed">
                    The tool calculates all three tiers simultaneously, so you can present the client with options in a single document.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SAMPLE ESTIMATE */}
      <section className="py-24 px-5 sm:px-8 bg-primary-900 text-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Sample Output</h2>
            <p className="text-blue-300">250m² · Semi-Finished condition · Based on 8 historical projects</p>
          </div>
          <div className="bg-primary-800 rounded-2xl p-6 space-y-4">
            {/* 3-tier cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { tier: 'Basic',     rate: '₦78,400', total: '₦19,600,000', selected: false },
                { tier: 'Mid-Range', rate: '₦113,700', total: '₦28,420,000', selected: true  },
                { tier: 'Premium',   rate: '₦164,600', total: '₦41,160,000', selected: false },
              ].map(({ tier, rate, total, selected }) => (
                <div key={tier} className={`rounded-xl p-4 ${selected ? 'bg-blue-600 ring-2 ring-blue-400' : 'bg-primary-700'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold">{tier}</p>
                    {selected && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Selected</span>}
                  </div>
                  <p className="text-xl font-black">{total}</p>
                  <p className="text-xs text-blue-300 mt-0.5">{rate} / m²</p>
                </div>
              ))}
            </div>
            {/* Breakdown */}
            <div className="bg-primary-700 rounded-xl p-4 space-y-2 text-sm">
              <p className="text-xs text-blue-300 font-semibold uppercase tracking-wide mb-3">Breakdown</p>
              {[
                ['Historical projects used',        '8 of 11 (3 outliers removed)'],
                ['Base rate (carcass, basic, 150m²)', '₦96,200 /m²'],
                ['Condition adjustment (semi-finished)', '× 0.55'],
                ['Tier adjustment (mid-range)',      '× 1.45'],
                ['Size adjustment (250m²)',          '× 0.930'],
                ['Final rate per m²',               '₦113,700 /m²'],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between gap-4 text-blue-200">
                  <span className="text-xs">{l}</span>
                  <span className="text-xs font-semibold text-white whitespace-nowrap">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 px-5 sm:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything Built In</h2>
            <p className="text-gray-500 max-w-xl mx-auto">No spreadsheets, no manual calculations. The system does the heavy lifting.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-primary-200 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} mb-4`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-5 sm:px-8 bg-gray-50 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Run Your First Estimate?</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Create your account, add a few past projects, and you'll have a credible ballpark in your client's inbox within minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"
              className="flex items-center justify-center gap-2 bg-primary-900 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-primary-800 transition-colors shadow-md">
              Create Account <ArrowRight size={18} />
            </Link>
            <Link to="/login"
              className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium px-8 py-3.5 rounded-xl hover:bg-white transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-8 px-5 sm:px-8 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary-900 rounded-lg flex items-center justify-center">
              <Building2 size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Pico Bello Projekte Limited</span>
          </div>
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Pico Bello Projekte. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
