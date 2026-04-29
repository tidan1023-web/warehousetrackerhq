import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, ArrowLeft, Plus, Trash2, CheckCircle, Send, XCircle } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const METHOD_LABELS = {
  bank_transfer: 'Bank Transfer', cash: 'Cash', cheque: 'Cheque', card: 'Card', other: 'Other',
};
const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-600',
  sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-400',
};

function fmt(n) {
  return Number(n || 0).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function PaymentModal({ invoiceId, currency, onClose, onSaved }) {
  const [form, setForm] = useState({ amount: '', method: 'bank_transfer', reference: '', paymentDate: new Date().toISOString().split('T')[0], notes: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-900/30';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.post(`/invoices/${invoiceId}/payments`, form);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record payment');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Record Payment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Amount ({currency}) *</label>
            <input type="number" min={0} step="0.01" value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} required className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Method</label>
            <select value={form.method} onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))} className={inputCls}>
              {Object.entries(METHOD_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Reference</label>
            <input value={form.reference} onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
            <input type="date" value={form.paymentDate} onChange={(e) => setForm((f) => ({ ...f, paymentDate: e.target.value }))} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} rows={2} className={inputCls} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 bg-primary-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-primary-800 disabled:opacity-60">
              {saving ? 'Saving…' : 'Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const canManage = ['admin', 'qs', 'project_manager'].includes(user?.role);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/invoices/${id}`);
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const updateStatus = async (status) => {
    setUpdatingStatus(true);
    try {
      await api.put(`/invoices/${id}`, { status });
      load();
    } finally {
      setUpdatingStatus(false);
    }
  };

  const deletePayment = async (pid) => {
    if (!confirm('Delete this payment record?')) return;
    await api.delete(`/invoices/${id}/payments/${pid}`);
    load();
  };

  const openPDF = () => window.open(`/api/invoices/${id}/pdf`, '_blank');

  if (loading) return <div className="text-center py-20 text-gray-400">Loading invoice…</div>;
  if (!data) return <div className="text-center py-20 text-red-500">Invoice not found</div>;

  const { invoice, items, payments } = data;
  const co = invoice.companySnapshot || {};
  const pct = invoice.total > 0 ? Math.min(100, (invoice.amountPaid / invoice.total) * 100) : 0;

  return (
    <div className="max-w-5xl space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/app/invoices')} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm">
          <ArrowLeft size={16} /> Back to Invoices
        </button>
        <div className="flex items-center gap-2">
          <button onClick={openPDF} className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
            <Download size={15} /> Download PDF
          </button>
          {canManage && invoice.status === 'draft' && (
            <button onClick={() => updateStatus('sent')} disabled={updatingStatus}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60">
              <Send size={15} /> Mark as Sent
            </button>
          )}
          {canManage && invoice.status === 'sent' && (
            <button onClick={() => updateStatus('paid')} disabled={updatingStatus}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-60">
              <CheckCircle size={15} /> Mark as Paid
            </button>
          )}
        </div>
      </div>

      {/* Invoice header card */}
      <div className="bg-primary-900 text-white rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-300 text-xs font-semibold uppercase tracking-wide mb-1">Invoice</p>
            <p className="text-2xl font-bold font-mono">{invoice.invoiceNumber}</p>
            <p className="text-blue-200 text-sm mt-1">{co.companyName}</p>
          </div>
          <div className="text-right">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase ${STATUS_COLORS[invoice.status]}`}>
              {invoice.status}
            </span>
            <p className="text-blue-200 text-xs mt-2">Issued: {fmtDate(invoice.issueDate)}</p>
            <p className="text-blue-200 text-xs">Due: {fmtDate(invoice.dueDate)}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <p className="text-blue-400 text-xs">Total</p>
            <p className="text-xl font-bold">{invoice.currency} {fmt(invoice.total)}</p>
          </div>
          <div>
            <p className="text-blue-400 text-xs">Paid</p>
            <p className="text-xl font-bold text-green-300">{invoice.currency} {fmt(invoice.amountPaid)}</p>
          </div>
          <div>
            <p className="text-blue-400 text-xs">Balance</p>
            <p className={`text-xl font-bold ${invoice.balance > 0 ? 'text-red-300' : 'text-green-300'}`}>
              {invoice.currency} {fmt(invoice.balance)}
            </p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4">
          <div className="h-2 bg-primary-800 rounded-full overflow-hidden">
            <div className="h-2 bg-green-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-blue-300 text-xs mt-1">{pct.toFixed(0)}% paid</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: items + totals */}
        <div className="lg:col-span-2 space-y-5">
          {/* Project info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">Project</p>
              <p className="font-semibold text-gray-800">{invoice.projectId?.name}</p>
              <p className="text-sm text-gray-500">{invoice.projectId?.client}</p>
              <p className="text-xs text-gray-400">{invoice.projectId?.location}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">BOQ Version</p>
              <p className="font-semibold text-gray-800">{invoice.boqVersionId?.name}</p>
            </div>
          </div>

          {/* Line items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-50">
              <h3 className="font-semibold text-gray-800 text-sm">Line Items</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                  <th className="text-left px-5 py-2">Item</th>
                  <th className="text-right px-4 py-2">Unit</th>
                  <th className="text-right px-4 py-2">Qty</th>
                  <th className="text-right px-4 py-2">Unit Price</th>
                  <th className="text-right px-5 py-2">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-800">{item.item}</p>
                      {item.description && <p className="text-xs text-gray-400">{item.description}</p>}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500">{item.unit}</td>
                    <td className="px-4 py-3 text-right">{item.quantity}</td>
                    <td className="px-4 py-3 text-right">{fmt(item.finalUnitPrice)}</td>
                    <td className="px-5 py-3 text-right font-medium">{fmt(item.totalCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-4 border-t border-gray-100 space-y-1.5 bg-gray-50">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span><span className="font-medium">{invoice.currency} {fmt(invoice.subtotal)}</span>
              </div>
              {invoice.vatPercent > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>VAT ({invoice.vatPercent}%)</span><span>{invoice.currency} {fmt(invoice.vatAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-gray-800 pt-1 border-t border-gray-200">
                <span>Grand Total</span><span>{invoice.currency} {fmt(invoice.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: payments + company */}
        <div className="space-y-5">
          {/* Payments */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="px-5 py-3 border-b border-gray-50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800 text-sm">Payments</h3>
              {canManage && invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                <button onClick={() => setShowPayment(true)}
                  className="flex items-center gap-1 text-xs text-primary-900 font-medium hover:underline">
                  <Plus size={13} /> Add
                </button>
              )}
            </div>
            <div className="p-5">
              {payments.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-3">No payments recorded</p>
              ) : (
                <div className="space-y-3">
                  {payments.map((p) => (
                    <div key={p._id} className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{invoice.currency} {fmt(p.amount)}</p>
                        <p className="text-xs text-gray-400">{METHOD_LABELS[p.method]} · {fmtDate(p.paymentDate)}</p>
                        {p.reference && <p className="text-xs text-gray-400">Ref: {p.reference}</p>}
                      </div>
                      {canManage && (
                        <button onClick={() => deletePayment(p._id)} className="text-gray-300 hover:text-red-500">
                          <XCircle size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Company snapshot */}
          {co.bankDetails && co.bankDetails.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-800 text-sm mb-3">Payment Details</h3>
              {co.bankDetails.map((b, i) => (
                <div key={i} className="mb-3 last:mb-0">
                  <p className="text-xs font-semibold text-gray-700">{b.bankName}</p>
                  <p className="text-xs text-gray-500">{b.accountName}</p>
                  <p className="text-xs text-gray-500 font-mono">{b.accountNumber}</p>
                  {b.sortCode && <p className="text-xs text-gray-400">Sort: {b.sortCode}</p>}
                </div>
              ))}
              {co.paymentInstructions && (
                <p className="text-xs text-gray-400 mt-2 border-t border-gray-100 pt-2">{co.paymentInstructions}</p>
              )}
            </div>
          )}

          {/* Notes */}
          {invoice.notes && (
            <div className="bg-yellow-50 rounded-2xl border border-yellow-100 p-5">
              <h3 className="font-semibold text-yellow-800 text-sm mb-1">Notes</h3>
              <p className="text-xs text-yellow-700">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          invoiceId={id}
          currency={invoice.currency}
          onClose={() => setShowPayment(false)}
          onSaved={() => { setShowPayment(false); load(); }}
        />
      )}
    </div>
  );
}
