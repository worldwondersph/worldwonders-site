'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Row = {
  id: number;
  destination: string;
  traveler_type: string;
  requirement: string;
  updated_at: string;
};

export default function VisaClient() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState('');
  const [travelerType, setTravelerType] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('visa_requirements')
          .select('*')
          .order('destination', { ascending: true })
          .order('traveler_type', { ascending: true });

        if (error) throw error;
        setRows((data || []) as Row[]);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Failed to load data.';
        setError(message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const destinations = useMemo(
    () => Array.from(new Set(rows.map(r => r.destination))).sort(),
    [rows]
  );
  const travelerTypes = useMemo(
    () => Array.from(new Set(rows.map(r => r.traveler_type))).sort(),
    [rows]
  );

  const filtered = rows.filter(r =>
    (!destination || r.destination === destination) &&
    (!travelerType || r.traveler_type === travelerType)
  );

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold mb-4">Visa Requirements</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium">Destination</label>
          <select
            className="mt-1 w-full rounded-xl border p-3"
            value={destination}
            onChange={e => setDestination(e.target.value)}
          >
            <option value="">All</option>
            {destinations.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Traveler Type</label>
          <select
            className="mt-1 w-full rounded-xl border p-3"
            value={travelerType}
            onChange={e => setTravelerType(e.target.value)}
          >
            <option value="">All</option>
            {travelerTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="rounded-xl border p-6">Loading…</div>
      ) : error ? (
        <div className="rounded-xl border p-6 text-red-600">Error: {error}</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border p-6">
          <p>No results yet. Try a different combination or add entries in Supabase.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map(item => (
            <li key={item.id} className="rounded-xl border p-4">
              <div className="text-sm opacity-60 mb-1">
                {item.destination} • {item.traveler_type}
              </div>
              <div className="whitespace-pre-line">{item.requirement}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
