import { barrar, json } from '../lib/servidor.js';

// Ponte para a API da OpenAI: a chave fica só aqui no servidor (OPENAI_API_KEY).
const BASE = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/responses';
const MODELO = () => process.env.OPENAI_MODEL || 'gpt-6.2-astra';

async function openai(caminho, opcoes = {}) {
  const r = await fetch(BASE + caminho, {
    ...opcoes,
    headers: { 'content-type': 'application/json', authorization: 'Bearer ' + process.env.OPENAI_API_KEY },
  });
  const corpo = await r.json().catch(() => ({}));
  if (!r.ok) return json({ erro: corpo?.error?.message || `erro HTTP ${r.status}` }, r.status);
  // devolve só o que o painel usa
  const { id, status, output, error, incomplete_details } = corpo;
  return json({ id, status, output, error, incomplete_details });
}
const semChave = () => !process.env.OPENAI_API_KEY &&
  json({ erro: 'A chave da OpenAI ainda não foi configurada na Vercel (OPENAI_API_KEY).' }, 503);

// POST { acao: 'criar', input, segundoPlano, formato } | { acao: 'cancelar', id }
export async function POST(request) {
  const bloqueio = await barrar(request); if (bloqueio) return bloqueio;
  const falta = semChave(); if (falta) return falta;
  let c;
  try { c = JSON.parse(await request.text()); } catch { return json({ erro: 'Pedido inválido.' }, 400); }
  if (c.acao === 'cancelar') {
    if (!/^resp_[\w-]+$/.test(c.id || '')) return json({ erro: 'id inválido' }, 400);
    return openai('/' + c.id + '/cancel', { method: 'POST' });
  }
  if (typeof c.input !== 'string' || !c.input || c.input.length > 20000) return json({ erro: 'Pedido inválido.' }, 400);
  const corpo = {
    model: MODELO(),
    max_output_tokens: 16000,
    tools: [{ type: 'web_search', user_location: { type: 'approximate', country: 'BR' } }],
    input: c.input,
  };
  if (c.segundoPlano) corpo.background = true;
  if (c.formato && c.formato.type === 'json_schema' && JSON.stringify(c.formato).length < 8000) corpo.text = { format: c.formato };
  return openai('', { method: 'POST', body: JSON.stringify(corpo) });
}

// GET ?id=resp_...  → andamento da varredura
export async function GET(request) {
  const bloqueio = await barrar(request); if (bloqueio) return bloqueio;
  const falta = semChave(); if (falta) return falta;
  const id = new URL(request.url).searchParams.get('id') || '';
  if (!/^resp_[\w-]+$/.test(id)) return json({ erro: 'id inválido' }, 400);
  return openai('/' + id);
}
