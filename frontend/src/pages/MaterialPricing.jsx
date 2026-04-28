import React, { useEffect, useState, useCallback } from 'react';
import { Plus, X, Pencil, Trash2, Search, Package } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CURRENCIES = ['NGN', 'USD', 'EUR', 'GBP'];
const EMPTY = { supplier: '', material: '', price: '', currency: 'NGN', unit: '', deliveryFee: '0', location: '' };

const inputCls =
  'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent';

function MaterialModal({ open, onClose, onSaved, editing }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setForm(editing
      ? { supplier: editing.supplier, material: editing.material, price: editing.price, currency: editing.currency ?? 'NGN', unit: editing.unit, deliveryFee: editing.deliveryFee ?? 0, location: editing.location ?? '' }
      : EMPTY);
    setError('');
  }, [open, editing]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      editing ? await api.put(`/material-prices/${editing._id}`, form) : await api.post('/material-prices', form);
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
          <h2 className="font-semibold text-gray-800">{editing ? 'Edit Material Price' : 'New Material Price'}</h2>
          <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-gray-600" /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Supplier *</label>
            <input type="text" required value={form.supplier} onChange={set('supplier')} className={inputCls} placeholder="e.g. Dangote, BUA, Local Market" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Material *</label>
            <input type="text" required value={form.material} onChange={set('material')} className={inputCls} placeholder="e.g. Cement (42.5R), Iron Rod 12mm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Unit *</label>
              <input type="text" required value={form.unit} onChange={set('unit')} className={inputCls} placeholder="e.g. bag, tonne, m³" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Currency</label>
              <select value={form.currency} onChange={set('currency')} className={inputCls + ' bg-white'}>
                {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Price *</label>
              <input type="number" required min="0" step="0.01" value={form.price} onChange={set('price')} className={inputCls} placeholder="0.00" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Delivery Fee</label>
              <input type="number" min="0" step="0.01" value={form.deliveryFee} onChange={set('deliveryFee')} className={inputCls} placeholder="0.00" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Location</label>
            <input type="text" value={form.location} onChange={set('location')} className={inputCls} placeholder="e.g. Lagos Island, Port Harcourt" />
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

export default function MaterialPricing() {
  const { user } = useAuth();
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');

  const canEdit = ['admin', 'qs'].includes(user?.role);

  const fetchPrices = useCallback(() => {
    api.get('/material-prices')
      .then(({ data }) => setPrices(data.prices))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchPrices(); }, [fetchPrices]);

  const filtered = prices.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.material.toLowerCase().includes(q) || p.supplier.toLowerCase().includes(q) || (p.location ?? '').toLowerCase().includes(q);
  });

  const handleDelete = async (id) => {
    if (!confirm('Delete this material price?')) return;
    await api.delete(`/material-prices/${id}`);
    fetchPrices();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search materials…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
        </div>
        <span className="text-sm text-gray-400 self-center hidden sm:block">{filtered.length} materials</span>
        {canEdit && (
          <button onClick={() => { setEditing(null); setModal(true); }}
            className="flex items-center gap-2 bg-primary-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-800 shrink-0">
            <Plus size={16} /> Add Material
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-900" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="mx-auto mb-3 text-gray-200" />
          <p className="text-gray-500 text-sm">{prices.length === 0 ? 'No material prices yet.' : 'No results for your search.'}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Material', 'Supplier', 'Unit', 'Price', 'Delivery', 'Total', 'Location', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{p.material}</td>
                  <td className="px-4 py-3 text-gray-600">{p.supplier}</td>
                  <td className="px-4 py-3 text-gray-500">{p.unit}</td>
                  <td className="px-4 py-3 text-gray-700">{p.currency} {Number(p.price).toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-500">{p.currency} {Number(p.deliveryFee).toLocaleString()}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{p.currency} {Number(p.price + p.deliveryFee).toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{p.location || '—'}</td>
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

      <MaterialModal open={modal} onClose={() => setModal(false)} onSaved={() => { setModal(false); fetchPrices(); }} editing={editing} />
    </div>
  );
}
