function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]!));
}

export async function POST(req: Request) {
  const { name='', email='', message='' } = await req.json().catch(() => ({}));
  if (!name || !email || !message) {
    return new Response(JSON.stringify({ ok:false, error:'Missing fields' }), { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from   = process.env.RESEND_FROM || 'WorldWonders <noreply@worldwonders.ph>';
  const to     = process.env.RESEND_TO   || 'hello@worldwonders.ph';

  if (!apiKey) return new Response('Missing RESEND_API_KEY', { status: 500 });

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${apiKey}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      from, to,
      reply_to: email,
      subject: `Website contact: ${name}`,
      html: `<p><b>From:</b> ${escapeHtml(name)} (${escapeHtml(email)})</p>
             <p>${escapeHtml(message)}</p>`
    })
  });

  if (!res.ok) {
    const text = await res.text();
    return new Response(JSON.stringify({ ok:false, error:text.slice(0,300) }), { status: 500 });
  }
  return new Response(JSON.stringify({ ok:true }), { headers: { 'content-type':'application/json' }});
}
