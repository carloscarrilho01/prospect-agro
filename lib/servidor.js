// Peças comuns das funções: senha do painel e armazenamento privado dos leads.
import { createHash, timingSafeEqual } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const LOCAL = process.env.ARMAZEM_LOCAL;      // só para testar na máquina
const ARQUIVO = 'dados/leads.json';

export const json = (dados, status = 200) =>
  Response.json(dados, { status, headers: { 'cache-control': 'no-store' } });

const h = (s) => createHash('sha256').update(String(s)).digest();
export async function autorizado(request) {
  const certa = process.env.ADMIN_SENHA;
  const dada = request.headers.get('x-senha') || '';
  if (!certa || !dada) return false;
  const ok = timingSafeEqual(h(certa), h(dada));
  if (!ok) await new Promise((r) => setTimeout(r, 800)); // freia tentativa e erro
  return ok;
}
export async function barrar(request) {
  if (!process.env.ADMIN_SENHA) return json({ erro: 'A senha do painel ainda não foi configurada na Vercel (ADMIN_SENHA).' }, 503);
  if (!(await autorizado(request))) return json({ erro: 'Senha incorreta.' }, 401);
  return null;
}

// ---- leads: { leads: [...], removidos: { id: data } } ----
export async function lerDados() {
  let bruto = null;
  if (LOCAL) {
    try { bruto = await fs.readFile(path.join(LOCAL, 'leads.json'), 'utf8'); } catch {}
  } else {
    const { get } = await import('@vercel/blob');
    const r = await get(ARQUIVO, { access: 'private', useCache: false });
    if (r && r.stream) bruto = await new Response(r.stream).text();
  }
  try {
    const d = bruto ? JSON.parse(bruto) : null;
    return { leads: Array.isArray(d?.leads) ? d.leads : [], removidos: d?.removidos && typeof d.removidos === 'object' ? d.removidos : {} };
  } catch { return { leads: [], removidos: {} }; }
}
export async function gravarDados(dados) {
  const texto = JSON.stringify(dados);
  if (LOCAL) {
    await fs.mkdir(LOCAL, { recursive: true });
    await fs.writeFile(path.join(LOCAL, 'leads.json'), texto);
    return;
  }
  const { put } = await import('@vercel/blob');
  await put(ARQUIVO, texto, { access: 'private', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true });
}

// junta o que está no servidor com o que veio do aparelho:
// vale a versão mais nova de cada lead; exclusões valem se forem mais novas que o lead
export function juntar(servidor, aparelho) {
  const removidos = { ...servidor.removidos };
  for (const [id, quando] of Object.entries(aparelho.removidos || {})) {
    if (typeof quando === 'string' && (!removidos[id] || removidos[id] < quando)) removidos[id] = quando;
  }
  const porId = new Map();
  for (const l of [...servidor.leads, ...(aparelho.leads || [])]) {
    if (!l || typeof l !== 'object' || typeof l.id !== 'string' || !l.nome) continue;
    const atual = porId.get(l.id);
    if (!atual || String(l.atualizadoEm || '') > String(atual.atualizadoEm || '')) porId.set(l.id, l);
  }
  const leads = [...porId.values()].filter((l) => !(removidos[l.id] && removidos[l.id] >= String(l.atualizadoEm || '')));
  // exclusões com mais de 90 dias já não precisam ser lembradas
  const limite = new Date(Date.now() - 90 * 864e5).toISOString();
  for (const id of Object.keys(removidos)) if (removidos[id] < limite) delete removidos[id];
  return { leads: leads.slice(0, 5000), removidos };
}
