# Prospector Agro

Painel de prospecção de clientes para serviços de **drone agrícola** — pulverização, dispersão de sólidos (sementes e adubo), mapeamento aéreo, coleta e análise de solo e filmagem de colheita.

É um único arquivo HTML que roda direto no navegador, sem instalar nada. A varredura usa a API da OpenAI com busca na web: você escolhe o estado e os alvos (produtores, revendas/cooperativas, consultorias, usinas) e os leads qualificados entram direto no funil, com nota de calor, sinal de oportunidade, contatos e gancho de abordagem.

## Como usar

1. Baixe os arquivos (ou clone o repositório).
2. Copie `chave.exemplo.js` para `chave.js` e cole a sua chave da API da OpenAI (crie em [platform.openai.com](https://platform.openai.com), menu API Keys).
3. Abra `prospector-agro.html` no navegador (dois cliques).
4. Escolha o estado, marque os alvos e clique em **Rodar varredura agora**.

Os leads ficam salvos no próprio navegador (localStorage). Use **Exportar backup** para guardar uma cópia em JSON.

> **Atenção:** o arquivo `chave.js` contém a sua chave e está no `.gitignore` — nunca o envie para o GitHub nem compartilhe. Cada varredura consome créditos da sua conta OpenAI.

## Funcionalidades

- Varredura por estado/região com os 4 tipos de alvo selecionáveis
- Funil de leads: novo → contatado → em conversa → proposta → fechado/perdido
- Barra de calor (quente/morno/frio), sinal de oportunidade e gancho copiável
- Botão direto de WhatsApp e follow-up com alerta de atraso
- Busca, filtros, anotações por lead, importação e backup em JSON
- Funciona offline (exceto a varredura, que precisa de internet)

Foto do topo: [Pexels — High-Tech Drone Spraying Crops in Field](https://www.pexels.com/photo/high-tech-drone-spraying-crops-in-field-34182370/) (licença Pexels, uso livre).
