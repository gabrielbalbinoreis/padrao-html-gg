---
name: padrao-html-gg
description: >-
  Padrão oficial de criação de HTML do Grupo GG (Grupo Gestão / grupogestao.co). Use SEMPRE que for criar,
  refazer, revisar ou estilizar qualquer página, tela, web app, painel, dashboard, formulário, relatório,
  landing page ou componente HTML para o Grupo GG ou suas empresas/clientes (ex.: Soltec Engenharia), inclusive
  web apps Google Apps Script (HtmlService) e projetos React/shadcn/Tailwind. Garante os mesmos tokens, fontes
  (Faustina + Inter), componentes, estrutura e JS do HTML de base, e integra as skills impeccable,
  design-taste-frontend (taste-skill) e emil-design-eng. Também cobre a integração de componentes React
  colados (ex.: DropdownNavigation) no padrão GG.
user-invocable: true
argument-hint: "[o que criar] — ex.: painel de obras, formulário de cadastro, landing da empresa"
---

# Padrão HTML Grupo GG

Todo HTML gerado para o Grupo GG segue o **HTML de base**: o web app *Hub de Capacitação em IA*
(`https://script.google.com/a/macros/grupogestao.co/s/AKfycbxqDdKpsimvl82rPkj61zdHTeygEif3LDpjr_UWfLIkGkf8-qzREu84O1TbIZdE8HA/exec`).
A cópia dele está em `references/base-original.html`: idêntica ao HTML servido, exceto o e-mail de suporte
(trocado por `suporte@empresa.example`) e os dois logos (trocados por um espaço reservado "LOGO"), retirados para o
repositório poder ser público. Em página real, use o logo e o contato da empresa via `APP_CFG`.

## Regra zero: o base é intocável

- **Nunca edite** `references/base-original.html`, nem o bloco de CSS que vem dele. Ele é a referência.
- Página nova = **copiar** o head e o bloco de CSS do base sem alterar nenhum caractere, e **acrescentar** o que
  faltar num `<style>` separado, depois dele.
- O único valor que muda por empresa é `--brand` (via `corPrimaria` / `<style>:root { --brand: ... }</style>`).
- Se o usuário entregar um HTML e pedir para não alterar, trabalhe só em arquivos novos.

## Arquivos da skill

| Arquivo | Para quê |
|---|---|
| `references/base-original.html` | HTML de base (fonte da verdade; só e-mail e logos substituídos) |
| `references/design-system.md` | Catálogo de tokens, componentes, classes, JS, breakpoints, microcopy |
| `references/integracao-skills.md` | Como impeccable, taste-skill e emil entram, e quem vence nos conflitos |
| `references/react-shadcn.md` | Projetos React: checagem shadcn/Tailwind/TS, `/components/ui`, tokens GG no tema, procedimento de integração |
| `assets/template.html` | Ponto de partida: head + CSS do base idênticos + núcleo `App` (helpers, views, nav, modal, toast, api) |
| `assets/componentes/dropdown-nav.html` | Menu dropdown (mega-menu) no padrão GG, sem React |
| `assets/react/dorpdown-navigation.tsx`, `assets/react/demo.tsx` | Componente React DropdownNavigation, como recebido |
| `scripts/verificar.mjs` | Validador: `node <skill>/scripts/verificar.mjs <arquivo.html>` |

## Fluxo

1. **Entenda a superfície** e defina o modo (impeccable): *Operate* (painel, hub, admin, formulário, ferramenta;
   é o caso padrão), *Read* (relatório, documentação), *Persuade* (landing/site institucional).
2. **Escolha o alvo:**
   - **HTML único / Apps Script** (padrão): copie `assets/template.html` para o projeto e substitua
     `{{NOME_APP}}`, `{{NOME_EMPRESA}}`, `{{TITULO}}`, `{{SUBTITULO}}` e as views de exemplo.
   - **Projeto React**: siga `references/react-shadcn.md`.
3. **Leia `references/design-system.md`** e monte a tela **só com as classes do base** (`.card`, `.panel`, `.kpi`,
   `.btn-*`, `.field/.input`, `.pill.s-*`, `table.t`, `.filters`, `.subtabs`, `.modal`, `.toast`...). Precisou de
   algo novo? Crie no `<style>` extra, com os tokens (`var(--brand)`, `var(--line)`, `var(--radius)`,
   `var(--shadow)`...) e o mesmo vocabulário visual (raios 9/10/14/16/18, pílulas 99px, Faustina nos títulos).
4. **Antes de escrever UI**, leia `~/.claude/skills/impeccable/reference/craft-floor.md` (parte *Verify*) e, para
   Operate/Read, `~/.claude/skills/impeccable/reference/operate.md`.
5. **Animações:** siga `emil-design-eng` (ver `references/integracao-skills.md`): `--ease-out`, ≤ 300ms,
   nada de `scale(0)`/`ease-in`/`transition: all`, `:active { transform: scale(.97) }` em botões novos,
   hover de movimento só com `(hover: hover) and (pointer: fine)`, `prefers-reduced-motion`.
6. **Landing/site institucional:** aplique também o taste-skill (`~/.claude/skills/design-taste-frontend/SKILL.md`)
   só no que não colide com o base (plano de seções, copy, fotos reais), nunca o CSS ou as fontes dele.
7. **JS:** mantenha as convenções do base: núcleo IIFE, `esc()` em todo dado que entra em `innerHTML`,
   `api('funcao', ...)` sobre `google.script.run` com resposta `{ ok, data, erro }`, `carregando()`,
   `erroNaTela()`, `ocupado(btn, promessa)`, `toast()`, `modal()`, nomes e textos em português.
8. **Estados obrigatórios** em toda tela com dados: carregando, vazio (`.empty`), erro com "Tentar novamente",
   desabilitado/ocupado nos botões, e o responsivo em 1180 / 980 / 760 / 390px.
9. **Verifique:**
   - `node ~/.claude/skills/padrao-html-gg/scripts/verificar.mjs <arquivo.html>`: zero erros; resolva os avisos
     ou justifique.
   - Revise com `impeccable` → `reference/audit.md` e `reference/polish.md`.
   - Se houver animação, revise com `emil-design-eng` / `review-animations` (tabela Before | After | Why).
   - Abra no navegador em desktop e 390px quando possível.

## Apps Script

- Arquivo servido por `HtmlService.createHtmlOutputFromFile('Index')` (ou `createTemplateFromFile` + `include()`
  para separar CSS/JS em parciais `.html`); título via `.setTitle('Nome — Empresa')`, viewport via
  `.addMetaTag('viewport', 'width=device-width, initial-scale=1')`.
- `<base target="_top">` sempre (links saem do iframe sandbox).
- Funções do servidor devolvem `{ ok: true, data }` ou `{ ok: false, erro: 'mensagem para o usuário' }`.
- Configuração da empresa (nome, logo, cor) injetada como `window.APP_CFG = {...}` antes do núcleo, como o
  `HUB_CFG` do base. Logo em `logoUrl` (URL ou data URI); sem logo, a marca mostra só o nome.

## Não fazer

- Trocar ou acrescentar fontes; usar cores hex fora dos tokens; usar Tailwind/Bootstrap/CDN de UI num HTML GG
  (o CSS é o do base).
- Emoji ou caractere Unicode como ícone (use `ic('nome')`; novos ícones em SVG traço 2, estilo lucide).
- Redesenhar o visual "para ficar mais moderno": o impeccable trabalha aqui em modo *refinement*, nunca *redesign*.
- Remover `.eyebrow`, `.ring`, `.kpi` por causa de regras genéricas das skills externas (ver conflitos resolvidos
  em `references/integracao-skills.md`).
