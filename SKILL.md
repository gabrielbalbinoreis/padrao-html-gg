---
name: padrao-html-gg
description: >-
  Padrão oficial de criação de HTML do Grupo GG (Grupo Gestão / grupogestao.co). Use SEMPRE que for criar,
  refazer, revisar ou estilizar qualquer documento, página, tela, web app, painel, dashboard, formulário,
  relatório ou componente HTML para o Grupo GG ou suas empresas/clientes (ex.: Soltec Engenharia), inclusive
  web apps Google Apps Script (HtmlService) e projetos React/shadcn/Tailwind. Formato padrão obrigatório:
  PAINEL EXECUTIVO — barra lateral marrom (cor da marca) com o logo da empresa no topo e a navegação, e à
  direita a área clara com rótulo, título em Faustina, filtros, cards de indicador com borda colorida, gráficos
  e listas. Garante os tokens, fontes (Faustina + Inter), componentes e JS do HTML de base, e integra as skills
  impeccable, design-taste-frontend (taste-skill) e emil-design-eng.
user-invocable: true
argument-hint: "[o que criar] — ex.: painel de indicadores, relatório de obras, cadastro de fornecedores"
---

# Padrão HTML Grupo GG

## Formato padrão: Painel Executivo (obrigatório)

**Todo documento HTML gerado sai no formato Painel Executivo**, a referência visual do GG (o painel "Indicadores
da Qualidade" da Soltec):

- **Esquerda — barra lateral marrom** (`--side`, a cor da marca escurecida): **logo da empresa no topo** (versão
  branca), rótulo pequeno em caixa alta (ex.: "PAINEL EXECUTIVO"), nome do produto em Faustina, navegação com
  ícones (item ativo com fundo claro translúcido), separador, grupo administrativo (Gerenciamento,
  Configurações) e o nome da empresa no rodapé.
- **Direita — área clara** (`--bg`): barra de status no topo (● "Dados de dd/mm/aaaa hh:mm", sino com contador,
  atualizar); cabeçalho com rótulo vermelho em caixa alta + título grande em Faustina + subtítulo; linha de
  filtros (selects com rótulo em caixa alta, "Mais filtros", "Limpar filtros"); título do período com ação
  ("Gerar relatório"); 4 cards de indicador com **borda esquerda colorida** por situação; grade com gráfico e
  lista "Precisam de atenção".
- **Celular:** barra marrom no topo com menu + logo; a lateral vira gaveta; cards em 2 colunas.

Ponto de partida: **`assets/template-painel.html`**. Use o `assets/template.html` (barra superior simples) **só se o
usuário pedir explicitamente outro formato**.

### Logo

1. Se existir `assets/marcas/<empresa>-branca.png` nesta skill (ex.: `soltec-branca.png`), embuta-o:
   `node <skill>/scripts/embutir-logo.mjs <arquivo.html> <skill>/assets/marcas/soltec-branca.png`.
2. Se não existir, peça o logo da empresa ao usuário (versão branca, PNG/SVG). Sem logo, a lateral mostra o
   nome da empresa em Faustina; nunca invente um logo.
3. `assets/marcas/` fica **fora do Git** (o repositório é público): logos de clientes não são publicados.

## Base técnica: o HTML de base é intocável

Tudo é construído sobre o **HTML de base** (web app *Hub de Capacitação em IA*,
`https://script.google.com/a/macros/grupogestao.co/s/AKfycbxqDdKpsimvl82rPkj61zdHTeygEif3LDpjr_UWfLIkGkf8-qzREu84O1TbIZdE8HA/exec`),
cuja cópia está em `references/base-original.html` (idêntica ao HTML servido, exceto e-mail de suporte e logos,
trocados por genéricos para o repositório ser público).

- **Nunca edite** `references/base-original.html`, nem o bloco de CSS que vem dele.
- Página nova = **copiar** o head e o CSS do base sem alterar nenhum caractere, e **acrescentar** o resto em
  `<style>` separado depois dele (é o que os templates já fazem: o bloco do painel vem depois do bloco do base).
- O único valor que muda por empresa é `--brand` (via `corPrimaria`); a lateral deriva dele.
- Se o usuário entregar um HTML e pedir para não alterar, trabalhe só em arquivos novos.

## Arquivos da skill

| Arquivo | Para quê |
|---|---|
| `assets/template-painel.html` | **Formato padrão.** Head + CSS do base idênticos + bloco Painel Executivo + núcleo `App` com shell lateral, `cabecalho`, `filtros`, `secao`, `kpi`, `graficoBarras`, `listaAtencao` e telas de exemplo |
| `assets/template.html` | Alternativa (barra superior), só sob pedido |
| `assets/marcas/` | Logos locais das empresas (fora do Git) |
| `references/base-original.html` | HTML de base (fonte da verdade) |
| `references/design-system.md` | Tokens, componentes do base **e do painel**, JS, breakpoints, microcopy |
| `references/integracao-skills.md` | Como impeccable, taste-skill e emil entram, e quem vence nos conflitos |
| `references/react-shadcn.md` | Projetos React/shadcn/Tailwind |
| `assets/componentes/`, `assets/react/` | Componentes extras (dropdown, etc.) |
| `scripts/verificar.mjs` | Validador (CSS do base intacto, tokens, layout painel) |
| `scripts/embutir-logo.mjs` | Embute um logo PNG/SVG no `APP_CFG.logoUrl` de um HTML |

## Fluxo

1. **Copie `assets/template-painel.html`** para o destino. Preencha `window.APP_CFG`: `nomeEmpresa`,
   `rotuloApp` (ex.: "Painel executivo"), `nomeApp` (ex.: "Indicadores da Qualidade"), `corPrimaria`,
   `atualizadoEm`, `notificacoes`. Embuta o logo (seção Logo).
2. **Monte as telas** com `H.registrar(nome, rotulo, icone, fn, grupo)` (`grupo: 'admin'` vai para baixo do
   separador). Cada tela segue a ordem do painel: `H.cabecalho(rótulo, título, subtítulo)` → `H.filtros([...])`
   (se houver filtros) → `H.secao(período, resumo, ação)` → `.pn-kpis` com `H.kpi({...})` (tom `ruim` | `bom` |
   `atencao` | `critico`) → `.pn-grid` com `.pn-card` (gráfico `H.graficoBarras` + `H.ligarGraficos`, tabela
   `table.t`, `H.listaAtencao`). Remova as telas de exemplo que não usar; nunca deixe item de menu sem conteúdo real.
3. **Classes:** só as do base (`.btn-*`, `.field/.input`, `.pill.s-*`, `table.t`, `.modal`, `.toast`, `.empty`...)
   e as do painel (`.pn-*`). Novas regras em `<style>` extra, só com tokens (`var(--brand)`, `var(--side)`,
   `var(--ind-*)`, `var(--line)`, `var(--radius-pn)`...).
4. **Antes de escrever UI**, leia `~/.claude/skills/impeccable/reference/craft-floor.md` (parte *Verify*) e
   `~/.claude/skills/impeccable/reference/operate.md` (painel = modo *Operate*).
5. **Gráficos:** uma série por gráfico, uma escala, meta/atenção como linhas rotuladas, tooltip no hover/foco,
   tabela acessível (o `graficoBarras` já faz). Status sempre com texto, nunca só cor; texto de "atenção" em
   `--warn` (o amarelo `--ind-atencao` é só para linhas e marcas).
6. **Animações:** `emil-design-eng`: `--ease-out`, ≤ 300ms, nada de `scale(0)`/`ease-in`/`transition: all`,
   `:active { transform: scale(.97) }`, `prefers-reduced-motion`.
7. **JS:** convenções do base: `esc()` em todo dado em `innerHTML`, `api('funcao', ...)` sobre
   `google.script.run` com `{ ok, data, erro }`, `carregando()`, `erroNaTela()`, `ocupado()`, `toast()`, `modal()`,
   nomes e textos em português.
8. **Estados obrigatórios:** carregando, vazio (`.empty`), erro com "Tentar novamente", botões ocupados, e o
   responsivo em 1366 / 1100 / 760 / 390px (gaveta lateral no celular).
9. **Verifique:** `node ~/.claude/skills/padrao-html-gg/scripts/verificar.mjs <arquivo.html>` com zero erros e
   zero avisos (o aviso "Sem o layout Painel Executivo" só é aceitável se o usuário pediu outro formato);
   revise com `impeccable` (`audit.md`, `polish.md`); abra no navegador em desktop e 390px.

## Apps Script

- `HtmlService.createHtmlOutputFromFile('Index')` (ou `createTemplateFromFile` + `include()`); título via
  `.setTitle('Nome — Empresa')`, viewport via `.addMetaTag('viewport', 'width=device-width, initial-scale=1')`.
- `<base target="_top">` sempre.
- Funções do servidor devolvem `{ ok: true, data }` ou `{ ok: false, erro: 'mensagem para o usuário' }`.
- `window.APP_CFG` injetado pelo servidor antes do núcleo (como o `HUB_CFG` do base); `atualizadoEm` vem da
  última carga de dados.

## Não fazer

- Gerar documento sem a barra lateral marrom com logo, ou com outra paleta/fonte (salvo pedido explícito).
- Trocar ou acrescentar fontes; usar cores hex fora dos tokens; usar Tailwind/Bootstrap/CDN de UI.
- Emoji ou caractere Unicode como ícone (use `ic('nome')`; novos ícones em SVG traço 2, estilo lucide).
- Redesenhar "para ficar mais moderno": o impeccable trabalha em modo *refinement*, nunca *redesign*.
- Remover `.eyebrow`, cards de indicador, borda colorida dos cards ou `.ring` por regras genéricas das skills
  externas (ver conflitos resolvidos em `references/integracao-skills.md`).
- Publicar logo de cliente no repositório (fica em `assets/marcas/`, fora do Git).
