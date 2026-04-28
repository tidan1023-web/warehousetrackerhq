import React, { useState } from 'react';
import { Search, TrendingUp, TrendingDown, BarChart2, Star, AlertCircle } from 'lucide-react';
import api from '../services/api';

const SOURCE_COLORS = {
  'QS Library': 'bg-blue-50 text-blue-700 border-blue-200',
  'Artisan': 'bg-orange-50 text-orange-700 border-orange-200',
  'Material Supplier': 'bg-green-50 text-green-700 border-green-200',
};

const TYPE_OPTS = [
  { value: '', label: 'All sources' },
  { value: 'qs', label: 'QS Library only' },
  { value: 'artisan', label: 'Artisan rates only' },
  { value: 'material', label: 'Material suppliers only' },
];

function StatCard({ label, value, currency, icon: Icon, color }) {
  return (
    <div className={`rounded-xl p-5 border ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
        <Icon size={16} className="opacity-60" />
      </div>
      <p className="text-2xl font-bold">{currency} {Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    </div>
  );
}

export default function PricingIntelligence() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setData(null);
    setSearched(true);
    try {
      const params = new URLSearchParams({ query: query.trim() });
      if (type) params.set('type', type);
      const { data: res } = await api.get(`/pricing/intelligence?${params}`);
      setData(res);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const currency = data?.results?.[0]?.currency ?? 'NGN';

  return (
    <div className="max-w-4xl">
      {/* Search bar */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-semibold text-gray-800 mb-1">Search Pricing Data</h2>
        <p className="text-sm text-gray-500 mb-4">
          Search across QS library, artisan rates, and material suppliers to get intelligent price recommendations.
        </p>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Cement, Bricklayer, Reinforced Concrete…"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
            />
          </div>
          <select value={type} onChange={(e) => setType(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 bg-white">
            {TYPE_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button type="submit" disabled={loading || !query.trim()}
            className="flex items-center gap-2 bg-primary-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-800 disabled:opacity-60 shrink-0">
            <Search size={15} />
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 mb-6">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-900" />
        </div>
      )}

      {/* No results */}
      {searched && !loading && data && data.results.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <BarChart2 size={48} className="mx-auto mb-3 text-gray-200" />
          <p className="text-gray-500">No pricing data found for <strong>"{query}"</strong>.</p>
          <p className="text-sm text-gray-400 mt-1">Try adding entries in QS Prices, Artisan Rates, or Materials.</p>
        </div>
      )}

      {/* Results */}
      {data && data.results.length > 0 && (
        <>
          {/* Intelligence cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Minimum" value={data.intelligence.min} currency={currency} icon={TrendingDown} color="bg-green-50 border-green-200 text-green-800" />
            <StatCard label="Maximum" value={data.intelligence.max} currency={currency} icon={TrendingUp} color="bg-red-50 border-red-200 text-red-800" />
            <StatCard label="Average" value={data.intelligence.average} currency={currency} icon={BarChart2} color="bg-blue-50 border-blue-200 text-blue-800" />
            <div className="rounded-xl p-5 border bg-primary-900 border-primary-800 text-white">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold uppercase tracking-wide opacity-70">Recommended</p>
                <Star size={16} className="opacity-60" />
              </div>
              <p className="text-2xl font-bold">{currency} {Number(data.intelligence.recommended).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-xs opacity-60 mt-1">avg + 10% buffer</p>
            </div>
          </div>

          {/* Source breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">
                Price Sources <span className="text-gray-400 font-normal text-sm ml-1">({data.results.length} found)</span>
              </h3>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Source', 'Name', 'Price', 'Unit', 'Location'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.results.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${SOURCE_COLORS[r.source] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {r.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{r.name}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{r.currency} {Number(r.price).toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-500">{r.unit}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{r.location || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Initial state */}
      {!searched && (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <BarChart2 size={48} className="mx-auto mb-3 text-gray-200" />
          <p className="text-gray-500">Enter a search term above to analyse pricing data.</p>
          <p className="text-sm text-gray-400 mt-1">Results are pulled from all three pricing libraries.</p>
        </div>
      )}
    </div>
  );
}
