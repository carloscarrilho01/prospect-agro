# Prospector Agro

Painel de prospecção de clientes para serviços de **drone agrícola** — pulverização, dispersão de sólidos (sementes e adubo), mapeamento aéreo, coleta e análise de solo e filmagem de colheita.

É um único arquivo HTML que roda direto no navegador, sem instalar nada. A varredura usa a API da OpenAI com busca na web: você escolhe o estado e os alvos (produtores, revendas/cooperativas, consultorias, usinas) e os leads qualificados entram direto no funil, com nota de calor, sinal de oportunidade, contatos e gancho de abordagem.

## Duas formas de usar

### Online (Vercel) — recomendado
O painel fica num link com senha. A chave da OpenAI fica guardada no servidor (ninguém vê pelo navegador) e os leads ficam salvos num armazenamento privado da Vercel, sincronizando entre celular e computador.

Variáveis de ambiente do projeto na Vercel:

| Nome | O que é |
|---|---|
| `ADMIN_SENHA` | senha para entrar no painel |
| `OPENAI_API_KEY` | chave da API da OpenAI (crie em platform.openai.com, menu API Keys) |
| `OPENAI_MODEL` | opcional; modelo usado na varredura (padrão: `gpt-6.2-astra`) |
| `BLOB_READ_WRITE_TOKEN` | criada sozinha ao ligar o armazenamento Blob (privado) ao projeto |

Depois de criar ou mudar uma variável, faça um novo deploy (Deployments → Redeploy).

### No computador (sem servidor)
1. Baixe os arquivos (ou clone o repositório).
2. Copie `chave.exemplo.js` para `chave.js` e cole a sua chave da API da OpenAI.
3. Abra `prospector-agro.html` no navegador (dois cliques).

Nesse modo os leads ficam só naquele navegador (localStorage). Use **Exportar backup** para guardar uma cópia em JSON — e **Importar** para levá-los para a versão online.

> **Atenção:** o arquivo `chave.js` contém a sua chave e está no `.gitignore` — nunca o envie para o GitHub nem compartilhe. Cada varredura consome créditos da sua conta OpenAI.

## Funcionalidades

- Varredura por estado/região com os 4 tipos de alvo selecionáveis
- A varredura roda em segundo plano na OpenAI: dá para continuar usando o painel e, se a aba fechar, ela é retomada ao abrir de novo
- A IA recebe a lista do que já está no painel e não repete leads (menos crédito gasto)
- Resposta em formato garantido (JSON Schema), com links das fontes clicáveis em cada lead
- Duas formas de ver: **Lista** (cartões completos) e **Funil** (colunas por etapa, arrastando o lead; no celular, menu "mover para")
- Histórico de contatos por lead (WhatsApp, ligação, visita, e-mail), com data; registrar o primeiro contato já move o lead para "Contatado" e agenda o próximo em 3 dias
- Botão de WhatsApp que abre a conversa com o gancho já escrito
- Barra de calor (quente/morno/frio), sinal de oportunidade e gancho copiável
- Follow-up com alerta de atraso, busca, filtros, anotações, importação e backup em JSON (o backup guarda etapa, histórico e anotações)
- Atalhos no topo que filtram na hora (para contatar hoje, quentes, sem contato, propostas, fechados)
- Varredura numa gaveta lateral (tela cheia no celular); a lista de leads vem sempre primeiro
- Funciona offline (exceto a varredura, que precisa de internet)

> Mantenha as pastas `img/` e `fonts/` junto do `prospector-agro.html` (ícone e fonte Public Sans, licença OFL em `fonts/`).

Ícone do topo recortado da foto [Pexels — High-Tech Drone Spraying Crops in Field](https://www.pexels.com/photo/high-tech-drone-spraying-crops-in-field-34182370/) (licença Pexels, uso livre).
