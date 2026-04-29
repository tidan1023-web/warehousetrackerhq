import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, FolderOpen, BookOpen, HardHat, Package,
  BarChart2, FileSpreadsheet, ShieldCheck, Users, ArrowRight,
  CheckCircle, Globe, Bell,
} from 'lucide-react';

const FEATURES = [
  {
    icon: FolderOpen,
    title: 'Project Management',
    desc: 'Track all your construction projects — clients, budgets, timelines, and status — in one place.',
    color: 'bg-blue-50 text-blue-700',
  },
  {
    icon: BookOpen,
    title: 'QS Pricing Library',
    desc: 'Maintain an internal database of rate items categorised by trade, with source references.',
    color: 'bg-purple-50 text-purple-700',
  },
  {
    icon: HardHat,
    title: 'Artisan Rate Tracking',
    desc: 'Record and compare labour rates by trade and location to keep cost estimates accurate.',
    color: 'bg-orange-50 text-orange-700',
  },
  {
    icon: Package,
    title: 'Material Price Library',
    desc: 'Log supplier prices with delivery fees so your estimates always reflect real market costs.',
    color: 'bg-green-50 text-green-700',
  },
  {
    icon: BarChart2,
    title: 'Pricing Intelligence',
    desc: 'Instantly calculate min, max, average, and recommended prices across all your data sources.',
    color: 'bg-cyan-50 text-cyan-700',
  },
  {
    icon: FileSpreadsheet,
    title: 'BOQ Builder',
    desc: 'Build detailed Bills of Quantities with automatic overhead, profit, and total cost calculations.',
    color: 'bg-indigo-50 text-indigo-700',
  },
  {
    icon: ShieldCheck,
    title: 'Role-Based Access',
    desc: 'Admin, QS, Project Manager, and Client roles ensure the right people see the right data.',
    color: 'bg-red-50 text-red-700',
  },
  {
    icon: Bell,
    title: 'Notifications',
    desc: 'In-app and push notifications keep your team informed of updates and approvals in real time.',
    color: 'bg-yellow-50 text-yellow-700',
  },
  {
    icon: Globe,
    title: 'Company Branding',
    desc: 'Upload your logo, signature, and stamp. Set bank details and payment instructions for documents.',
    color: 'bg-teal-50 text-teal-700',
  },
];

const ROLES = [
  { role: 'Admin', perks: ['Full system access', 'Company settings', 'User management', 'Delete records'] },
  { role: 'Quantity Surveyor', perks: ['Manage pricing libraries', 'Build BOQ documents', 'View all projects', 'Pricing intelligence'] },
  { role: 'Project Manager', perks: ['Create & edit projects', 'Build BOQ documents', 'View pricing data', 'Dashboard access'] },
  { role: 'Client', perks: ['View assigned projects', 'Dashboard overview', 'Read-only access'] },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Set Up Your Company', desc: 'Add your branding, bank details, and team members.' },
  { step: '02', title: 'Build Pricing Libraries', desc: 'Enter QS rates, artisan costs, and material prices from your market data.' },
  { step: '03', title: 'Create Projects', desc: 'Add client projects with budgets, timelines, and team assignments.' },
  { step: '04', title: 'Generate BOQs', desc: 'Use the BOQ Builder to produce accurate cost documents with automatic calculations.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-900 rounded-xl flex items-center justify-center">
              <Building2 size={18} className="text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-primary-900">Pico Bello Projekte Limited</p>
              <p className="text-xs text-gray-400">BOQ Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary-900 transition-colors">
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
      <section className="bg-primary-900 text-white pt-24 pb-32 px-6 relative overflow-hidden">
        {/* Subtle background shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-400" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-blue-300" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
            Construction BOQ Management
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
            Smarter BOQ Estimates<br />
            <span className="text-blue-300">Built for QS Professionals</span>
          </h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            Pico Bello Projekte is a full-stack BOQ management platform for construction firms.
            Manage pricing libraries, build accurate Bills of Quantities, and track projects — all in one system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"
              className="flex items-center justify-center gap-2 bg-white text-primary-900 font-semibold px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
              Start for Free <ArrowRight size={18} />
            </Link>
            <Link to="/login"
              className="flex items-center justify-center gap-2 border border-blue-400/40 text-white font-medium px-7 py-3.5 rounded-xl hover:bg-primary-800 transition-colors">
              Sign In
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6 justify-center mt-12 text-blue-300 text-sm">
            {['JWT Secured', 'Role-Based Access', 'Cloudinary Storage', 'Real-Time Notifications'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-blue-400" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything You Need</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              From pricing libraries to BOQ generation — all the tools a Quantity Surveyor needs, in one platform.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`inline-flex p-3 rounded-xl ${color} mb-4`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500">Get up and running in four simple steps.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {HOW_IT_WORKS.map(({ step, title, desc }) => (
              <div key={step} className="flex gap-5">
                <div className="text-4xl font-black text-primary-100 leading-none shrink-0 w-12">{step}</div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOQ CALCULATION SHOWCASE */}
      <section className="py-24 px-6 bg-primary-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Automatic BOQ Calculations</h2>
            <p className="text-blue-300">No spreadsheets. Enter your figures and let the system do the maths.</p>
          </div>
          <div className="bg-primary-800 rounded-2xl p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-blue-300 text-xs uppercase tracking-wide">
                  <th className="text-left pb-3">Item</th>
                  <th className="text-right pb-3">Base Cost</th>
                  <th className="text-right pb-3">OH %</th>
                  <th className="text-right pb-3">Profit %</th>
                  <th className="text-right pb-3">Unit Price</th>
                  <th className="text-right pb-3">Qty</th>
                  <th className="text-right pb-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-700">
                {[
                  { item: 'Excavation', base: 12500, oh: 15, pr: 10, qty: 45 },
                  { item: 'Concrete (C25)', base: 85000, oh: 15, pr: 10, qty: 12 },
                  { item: 'Brickwork', base: 35000, oh: 15, pr: 10, qty: 120 },
                ].map(({ item, base, oh, pr, qty }) => {
                  const unit = parseFloat((base * (1 + oh / 100) * (1 + pr / 100)).toFixed(2));
                  const total = parseFloat((unit * qty).toFixed(2));
                  return (
                    <tr key={item} className="text-blue-100">
                      <td className="py-3 font-medium text-white">{item}</td>
                      <td className="py-3 text-right">₦{base.toLocaleString()}</td>
                      <td className="py-3 text-right">{oh}%</td>
                      <td className="py-3 text-right">{pr}%</td>
                      <td className="py-3 text-right">₦{unit.toLocaleString()}</td>
                      <td className="py-3 text-right">{qty}</td>
                      <td className="py-3 text-right font-bold text-white">₦{total.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={6} className="pt-4 text-right text-blue-300 font-semibold text-xs uppercase tracking-wide">Grand Total</td>
                  <td className="pt-4 text-right text-xl font-black text-white">₦{(
                    [{ base: 12500, oh: 15, pr: 10, qty: 45 }, { base: 85000, oh: 15, pr: 10, qty: 12 }, { base: 35000, oh: 15, pr: 10, qty: 120 }]
                      .reduce((sum, r) => sum + r.base * (1 + r.oh / 100) * (1 + r.pr / 100) * r.qty, 0)
                  ).toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="text-center text-blue-400 text-xs mt-4">
            Formula: Unit Price = Base Cost × (1 + Overhead%) × (1 + Profit%) · Total = Unit Price × Quantity
          </p>
        </div>
      </section>

      {/* USER ROLES */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Built for Your Whole Team</h2>
            <p className="text-gray-500">Each role gets exactly the access they need — nothing more, nothing less.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ROLES.map(({ role, perks }) => (
              <div key={role} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary-900 rounded-lg flex items-center justify-center">
                    <Users size={15} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm leading-tight">{role}</h3>
                </div>
                <ul className="space-y-2">
                  {perks.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle size={13} className="text-green-500 mt-0.5 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-500 mb-8">
            Create your account in seconds and start building accurate BOQs today.
            No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"
              className="flex items-center justify-center gap-2 bg-primary-900 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-primary-800 transition-colors shadow-md">
              Create Free Account <ArrowRight size={18} />
            </Link>
            <Link to="/login"
              className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-8 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
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
