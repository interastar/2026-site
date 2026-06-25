import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const prerender = false;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

function getEnv() {
  // Cloudflare Workers env (production + dev via wrangler/.dev.vars).
  const e = env as Record<string, string | undefined>;
  return {
    CLICKUP_API_TOKEN: e.CLICKUP_API_TOKEN,
    CLICKUP_LIST_ID: e.CLICKUP_LIST_ID,
  };
}

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const POST: APIRoute = async ({ request }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'invalid_request' }, 400);
  }

  const get = (k: string) => (form.get(k) ?? '').toString().trim();

  // Honeypot — silently accept without creating a task.
  if (get('company_url')) return json({ ok: true });

  const name = get('name');
  const company = get('company');
  const email = get('email');
  const phone = get('phone');
  const role = get('role');
  const interest = get('interest');
  const message = get('message');
  const lang = get('lang') || 'es';
  const source = get('source') || 'web';
  const page = get('page');

  if (!name || !company || !email || !role || !interest) {
    return json({ ok: false, error: 'missing_fields' }, 422);
  }
  if (!isEmail(email)) {
    return json({ ok: false, error: 'invalid_email' }, 422);
  }

  const { CLICKUP_API_TOKEN, CLICKUP_LIST_ID } = getEnv();

  const taskName = `Lead web — ${company} (${name})`;
  const description = [
    `**Nuevo lead desde interastar.com**`,
    ``,
    `- Nombre: ${name}`,
    `- Empresa: ${company}`,
    `- Email: ${email}`,
    phone ? `- Teléfono: ${phone}` : null,
    `- Rol: ${role}`,
    `- Interés: ${interest}`,
    `- Idioma: ${lang}`,
    `- Origen: ${source}`,
    page ? `- Página: ${page}` : null,
    ``,
    message ? `**Mensaje:**\n${message}` : `_Sin mensaje adicional._`,
  ]
    .filter(Boolean)
    .join('\n');

  // If ClickUp isn't configured yet, don't fail the user: log and accept.
  if (!CLICKUP_API_TOKEN || !CLICKUP_LIST_ID) {
    console.warn('[lead] ClickUp not configured. Lead payload:', {
      name, company, email, phone, role, interest, message, lang, source, page,
    });
    return json({ ok: true, stored: false });
  }

  try {
    const res = await fetch(`https://api.clickup.com/api/v2/list/${CLICKUP_LIST_ID}/task`, {
      method: 'POST',
      headers: {
        Authorization: CLICKUP_API_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: taskName,
        markdown_description: description,
        tags: ['web-lead', interest].filter(Boolean),
        priority: 2,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error('[lead] ClickUp error', res.status, detail);
      return json({ ok: false, error: 'crm_error' }, 502);
    }

    return json({ ok: true, stored: true });
  } catch (err) {
    console.error('[lead] fetch failed', err);
    return json({ ok: false, error: 'network_error' }, 502);
  }
};
