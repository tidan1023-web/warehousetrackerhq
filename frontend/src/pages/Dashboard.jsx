import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen, Activity, Clock, CheckCircle, FileText,
  Bell, XCircle, ChevronDown, ChevronUp,
} from 'lucide-react';
import api from '../services/api';

const STATUS_COLORS = {
  planning: 'bg-yellow-100 text-yellow-700',
  active: 'bg-green-100 text-green-700',
  on_hold: 'bg-orange-100 text-orange-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
};

function Section({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-800 text-sm">{title}</span>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && <div className="border-t border-gray-100">{children}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/dashboard/summary')
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-900" />
      </div>
    );
  }

  const { stats = {}, recentProjects = [] } = data ?? {};

  const STAT_CARDS = [
    { label: 'Total Projects', value: stats.total ?? 0, icon: FolderOpen, bg: 'bg-blue-50', text: 'text-blue-700' },
    { label: 'Active', value: stats.active ?? 0, icon: Activity, bg: 'bg-green-50', text: 'text-green-700' },
    { label: 'In Planning', value: stats.planning ?? 0, icon: Clock, bg: 'bg-yellow-50', text: 'text-yellow-700' },
    { label: 'Completed', value: stats.completed ?? 0, icon: CheckCircle, bg: 'bg-purple-50', text: 'text-purple-700' },
    { label: 'On Hold', value: stats.onHold ?? 0, icon: Clock, bg: 'bg-orange-50', text: 'text-orange-700' },
    { label: 'Cancelled', value: stats.cancelled ?? 0, icon: XCircle, bg: 'bg-red-50', text: 'text-red-700' },
  ];

  return (
    <div className="space-y-4">

      {/* Project Stats */}
      <Section title="Project Overview">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 p-4">
          {STAT_CARDS.map(({ label, value, icon: Icon, bg, text }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-4 flex flex-col gap-2">
              <div className={`inline-flex p-2 rounded-lg ${bg} ${text} w-fit`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
              <p className="text-xs text-gray-500 leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Invoice & Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title="Invoice Summary" defaultOpen={true}>
          <div className="p-5">
            <div className="flex justify-around text-center py-4 border border-dashed border-gray-200 rounded-lg">
              {['Total', 'Pending', 'Paid'].map((label) => (
                <div key={label}>
                  <p className="text-xl font-bold text-gray-300">0</p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Pending Approvals" defaultOpen={true}>
          <div className="p-5">
            <div className="flex items-center justify-center py-4 border border-dashed border-gray-200 rounded-lg">
              <p className="text-sm text-gray-300">No pending approvals</p>
            </div>
          </div>
        </Section>
      </div>

      {/* Recent Projects */}
      <Section title="Recent Projects" defaultOpen={true}>
        {recentProjects.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <FolderOpen size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="text-gray-500 text-sm">No projects yet.</p>
            <button
              onClick={() => navigate('/app/projects')}
              className="mt-2 text-primary-900 font-medium hover:underline text-sm"
            >
              Create your first project
            </button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-50">
              {recentProjects.map((p) => (
                <div key={p._id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{p.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {p.client}{p.location ? ` · ${p.location}` : ''}
                    </p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize shrink-0 ${STATUS_COLORS[p.status] ?? 'bg-gray-100 text-gray-700'}`}>
                    {p.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-gray-100">
              <button
                onClick={() => navigate('/app/projects')}
                className="text-sm text-primary-900 hover:underline font-medium"
              >
                View all projects →
              </button>
            </div>
          </>
        )}
      </Section>

    </div>
  );
}
