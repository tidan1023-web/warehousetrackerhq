import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Eye, Download, Trash2, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_STYLES = {
  draft: 'bg-gray-100 text-gray-600',
  sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-400',
};

const STATUS_ICONS = {
  draft: Clock,
  sent: AlertCircle,
  paid: CheckCircle,
  overdue: AlertCircle,
  cancelled: XCircle,
};

function fmt(n) {
  return Number(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function CreateModal({ projects, boqVersions, onClose, onSaved }) {
  const [form, setForm] = useState({ projectId: '', boqVersionId: '', vatPercent: 0, dueDate: '', notes: '' });
  const [loadingVersions, setLoadingVersions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadVersions = async (projectId) => {
    if (!projectId) return;
    setLoadingVersions(true);
    try {
      const { data } = await api.get('/boq', { params: { projectId } });
      boqVersions.length = 0;
      (data.versions || []).forEach((v) => boqVersions.push(v));
    } finally {
      setLoadingVersions(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name === 'projectId') { loadVersions(value); setForm((f) => ({ ...f, projectId: value, boqVersionId: '' })); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post('/invoices', form);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create invoice');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/30';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Create Invoice</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Project *</label>
            <select name="projectId" value={form.projectId} onChange={handleChange} required className={inputCls}>
              <option value="">Select project…</option>
              {projects.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">BOQ Version *</label>
            <select name="boqVersionId" value={form.boqVersionId} onChange={handleChange} required className={inputCls} disabled={loadingVersions || !form.projectId}>
              <option value="">{loadingVersions ? 'Loading…' : 'Select version…'}</option>
              {boqVersions.map((v) => <option key={v._id} value={v._id}>{v.name} ({v.status})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">VAT %</label>
              <input type="number" name="vatPercent" value={form.vatPercent} onChange={handleChange} min={0} max={100} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Due Date</label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={2} className={inputCls} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 bg-primary-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-primary-800 disabled:opacity-60">
              {saving ? 'Creating…' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Invoices() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [boqVersions, setBoqVersions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);
  const canManage = ['admin', 'qs', 'project_manager'].includes(user?.role);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const [invRes, projRes] = await Promise.all([
        api.get('/invoices', { params }),
        canManage ? api.get('/projects') : Promise.resolve({ data: { projects: [] } }),
      ]);
      setInvoices(invRes.data.invoices || []);
      setProjects(projRes.data.projects || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [statusFilter]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this invoice?')) return;
    await api.delete(`/invoices/${id}`);
    load();
  };

  const openPDF = (id) => {
    const base = (import.meta.env.VITE_API_URL || '/api').replace(/\/api\/?$/, '');
    window.open(`${base}/api/invoices/${id}/pdf`, '_blank');
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-900/30">
            <option value="">All Statuses</option>
            {['draft', 'sent', 'paid', 'overdue', 'cancelled'].map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
        {canManage && (
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-primary-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-800">
            <Plus size={16} /> New Invoice
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading invoices…</div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <FileText size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No invoices yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                <th className="text-left px-5 py-3">Invoice #</th>
                <th className="text-left px-5 py-3">Project</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Total</th>
                <th className="text-right px-5 py-3">Balance</th>
                <th className="text-left px-5 py-3">Due</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {invoices.map((inv) => {
                const Icon = STATUS_ICONS[inv.status] || Clock;
                return (
                  <tr key={inv._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-mono font-medium text-primary-900">{inv.invoiceNumber}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-800">{inv.projectId?.name || '—'}</p>
                      <p className="text-xs text-gray-400">{inv.projectId?.client}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[inv.status]}`}>
                        <Icon size={11} /> {inv.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium">₦{fmt(inv.total)}</td>
                    <td className={`px-5 py-3 text-right font-medium ${inv.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ₦{fmt(inv.balance)}
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">
                      {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('en-GB') : '—'}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => navigate(`/app/invoices/${inv._id}`)}
                          className="p-1.5 text-gray-400 hover:text-primary-900 rounded-lg hover:bg-primary-50" title="View">
                          <Eye size={15} />
                        </button>
                        <button onClick={() => openPDF(inv._id)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50" title="Download PDF">
                          <Download size={15} />
                        </button>
                        {user?.role === 'admin' && (
                          <button onClick={() => handleDelete(inv._id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50" title="Delete">
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {showCreate && (
        <CreateModal
          projects={projects}
          boqVersions={boqVersions}
          onClose={() => setShowCreate(false)}
          onSaved={() => { setShowCreate(false); load(); }}
        />
      )}
    </div>
  );
}
