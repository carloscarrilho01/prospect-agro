import { barrar, json, lerDados, gravarDados, juntar } from '../lib/servidor.js';

// GET: leads salvos na nuvem.  PUT: envia os do aparelho, devolve a lista juntada.
export async function GET(request) {
  const bloqueio = await barrar(request); if (bloqueio) return bloqueio;
  try { return json(await lerDados()); }
  catch (e) { return json({ erro: 'Não deu para ler os leads salvos.' }, 500); }
}

export async function PUT(request) {
  const bloqueio = await barrar(request); if (bloqueio) return bloqueio;
  let corpo;
  try {
    const texto = await request.text();
    if (texto.length > 4_000_000) return json({ erro: 'Dados grandes demais.' }, 413);
    corpo = JSON.parse(texto);
  } catch { return json({ erro: 'Pedido inválido.' }, 400); }
  try {
    const juntos = juntar(await lerDados(), { leads: Array.isArray(corpo.leads) ? corpo.leads : [], removidos: corpo.removidos || {} });
    await gravarDados(juntos);
    return json(juntos);
  } catch (e) { return json({ erro: 'Não deu para salvar na nuvem.' }, 500); }
}
