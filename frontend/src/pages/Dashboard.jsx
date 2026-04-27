import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderOpen,
  Activity,
  Clock,
  CheckCircle,
  FileText,
  Bell,
  XCircle,
} from 'lucide-react';
import api from '../services/api';

const STATUS_COLORS = {
  planning: 'bg-yellow-100 text-yellow-700',
  active: 'bg-green-100 text-green-700',
  on_hold: 'bg-orange-100 text-orange-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/dashboard/summary')
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
    {
      label: 'Total Projects',
      value: stats.total ?? 0,
      icon: FolderOpen,
      bg: 'bg-blue-50',
      text: 'text-blue-700',
    },
    {
      label: 'Active',
      value: stats.active ?? 0,
      icon: Activity,
      bg: 'bg-green-50',
      text: 'text-green-700',
    },
    {
      label: 'In Planning',
      value: stats.planning ?? 0,
      icon: Clock,
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
    },
    {
      label: 'Completed',
      value: stats.completed ?? 0,
      icon: CheckCircle,
      bg: 'bg-purple-50',
      text: 'text-purple-700',
    },
    {
      label: 'On Hold',
      value: stats.onHold ?? 0,
      icon: Clock,
      bg: 'bg-orange-50',
      text: 'text-orange-700',
    },
    {
      label: 'Cancelled',
      value: stats.cancelled ?? 0,
      icon: XCircle,
      bg: 'bg-red-50',
      text: 'text-red-700',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {STAT_CARDS.map(({ label, value, icon: Icon, bg, text }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2"
          >
            <div className={`inline-flex p-2 rounded-lg ${bg} ${text} w-fit`}>
              <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-xs text-gray-500 leading-tight">{label}</p>
          </div>
        ))}
      </div>

      {/* Placeholder cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <FileText size={18} className="text-primary-900" />
            <h3 className="font-semibold text-gray-800">Invoice Summary</h3>
            <span className="ml-auto text-xs bg-primary-50 text-primary-700 border border-primary-200 px-2 py-0.5 rounded-full font-medium">
              Phase 2
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-6">Coming in the next phase</p>
          <div className="flex justify-around text-center py-4 border border-dashed border-gray-200 rounded-lg">
            {['Total', 'Pending', 'Paid'].map((label) => (
              <div key={label}>
                <p className="text-xl font-bold text-gray-300">0</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Bell size={18} className="text-primary-900" />
            <h3 className="font-semibold text-gray-800">Pending Approvals</h3>
            <span className="ml-auto text-xs bg-primary-50 text-primary-700 border border-primary-200 px-2 py-0.5 rounded-full font-medium">
              Phase 2
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-6">Approval workflow coming soon</p>
          <div className="flex items-center justify-center py-4 border border-dashed border-gray-200 rounded-lg">
            <p className="text-sm text-gray-300">No pending approvals</p>
          </div>
        </div>
      </div>

      {/* Recent projects */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Recent Projects</h3>
          <button
            onClick={() => navigate('/projects')}
            className="text-sm text-primary-900 hover:underline font-medium"
          >
            View all →
          </button>
        </div>

        {recentProjects.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FolderOpen size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="text-gray-500 text-sm">No projects yet.</p>
            <button
              onClick={() => navigate('/projects')}
              className="mt-2 text-primary-900 font-medium hover:underline text-sm"
            >
              Create your first project
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentProjects.map((p) => (
              <div key={p._id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{p.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {p.client}
                    {p.location ? ` · ${p.location}` : ''}
                  </p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[p.status] ?? 'bg-gray-100 text-gray-700'}`}
                >
                  {p.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
