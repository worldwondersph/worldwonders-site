'use client';
import { useState } from 'react';

export const metadata = { title: 'Contact | WorldWonders' };

export default function ContactPage() {
  const [status, setStatus] = useState<'idle'|'sending'|'ok'|'err'>('idle');
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!r.ok) throw new Error('Send failed');
      setStatus('ok'); setForm({ name:'', email:'', message:'' });
    } catch {
      setStatus('err');
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border p-3 rounded-xl" placeholder="Your name"
               value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <input className="w-full border p-3 rounded-xl" placeholder="Your email" type="email"
               value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        <textarea className="w-full border p-3 rounded-xl" placeholder="Message" rows={5}
                  value={form.message} onChange={e=>setForm({...form, message:e.target.value})} required />
        <button className="border px-4 py-2 rounded-xl" disabled={status==='sending'}>
          {status==='sending' ? 'Sending…' : 'Send'}
        </button>
        {status==='ok'  && <p className="text-green-700">Thanks! We’ll get back to you.</p>}
        {status==='err' && <p className="text-red-600">Couldn’t send. Try again.</p>}
      </form>
    </div>
  );
}
