import React, { useEffect, useState, useCallback } from 'react';
import { Plus, X, Pencil, Trash2, Search, BookOpen } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CURRENCIES = ['NGN', 'USD', 'EUR', 'GBP'];
const EMPTY = { category: '', item: '', unit: '', source: '', price: '', currency: 'NGN' };

const inputCls =
  'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent';

function PriceModal({ open, onClose, onSaved, editing }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setForm(editing ? { category: editing.category, item: editing.item, unit: editing.unit, source: editing.source ?? '', price: editing.price, currency: editing.currency ?? 'NGN' } : EMPTY);
    setError('');
  }, [open, editing]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      editing ? await api.put(`/qs-prices/${editing._id}`, form) : await api.post('/qs-prices', form);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">{editing ? 'Edit Entry' : 'New QS Price Entry'}</h2>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
          {[
            { label: 'Category *', key: 'category', placeholder: 'e.g. Concrete Works' },
            { label: 'Item *', key: 'item', placeholder: 'e.g. Reinforced Concrete' },
            { label: 'Unit *', key: 'unit', placeholder: 'e.g. m³, kg, m²' },
            { label: 'Source', key: 'source', placeholder: 'e.g. NIQS 2024, Market Survey' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
              <input type="text" required={label.includes('*')} value={form[key]} onChange={set(key)} className={inputCls} placeholder={placeholder} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Price *</label>
              <input type="number" required min="0" step="0.01" value={form.price} onChange={set('price')} className={inputCls} placeholder="0.00" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Currency</label>
              <select value={form.currency} onChange={set('currency')} className={inputCls + ' bg-white'}>
                {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 bg-primary-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-800 disabled:opacity-60">
              {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function QsPricing() {
  const { user } = useAuth();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const canEdit = ['admin', 'qs'].includes(user?.role);

  const fetchPrices = useCallback(() => {
    const params = categoryFilter ? `?category=${categoryFilter}` : '';
    api.get(`/qs-prices${params}`)
      .then(({ data }) => setPrices(data.prices))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categoryFilter]);

  useEffect(() => { fetchPrices(); }, [fetchPrices]);

  const categories = [...new Set(prices.map((p) => p.category))].sort();

  const filtered = prices.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.item.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.source ?? '').toLowerCase().includes(q);
  });

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return;
    await api.delete(`/qs-prices/${id}`);
    fetchPrices();
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search items…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 bg-white">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <span className="text-sm text-gray-400 self-center hidden sm:block">{filtered.length} entries</span>
        {canEdit && (
          <button onClick={() => { setEditing(null); setModal(true); }}
            className="flex items-center gap-2 bg-primary-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-800 shrink-0">
            <Plus size={16} /> Add Entry
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-900" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen size={48} className="mx-auto mb-3 text-gray-200" />
          <p className="text-gray-500 text-sm">{prices.length === 0 ? 'No price entries yet.' : 'No results for your search.'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Category', 'Item', 'Unit', 'Source', 'Price', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3"><span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">{p.category}</span></td>
                  <td className="px-4 py-3 font-medium text-gray-800">{p.item}</td>
                  <td className="px-4 py-3 text-gray-500">{p.unit}</td>
                  <td className="px-4 py-3 text-gray-500">{p.source || '—'}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{p.currency} {Number(p.price).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {canEdit && (
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => { setEditing(p); setModal(true); }} className="text-gray-400 hover:text-primary-900 transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(p._id)} className="text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PriceModal open={modal} onClose={() => setModal(false)} onSaved={() => { setModal(false); fetchPrices(); }} editing={editing} />
    </div>
  );
}
