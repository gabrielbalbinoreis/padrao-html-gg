# Design system GG: catálogo extraído do HTML de base

Fonte única da verdade: `references/base-original.html` (cópia do HTML servido pelo Apps Script
"Hub de Capacitação em IA", com e-mail de suporte e logos trocados por genéricos). Este arquivo só **descreve** o que está lá. Em caso de dúvida, o base vence.
Nunca edite o base.

## Painel Executivo (formato padrão de todo documento)

Bloco CSS próprio em `assets/template-painel.html`, depois do CSS do base. Referência visual: painel
"Indicadores da Qualidade" da Soltec (cores medidas do print do usuário).

| Token do painel | Valor | Uso |
|---|---|---|
| `--side` | `color-mix(in srgb, var(--brand) 88%, black)` (= `#6a1a01` com a marca padrão) | Fundo da barra lateral e da barra do celular |
| `--side-on` / `--side-hover` / `--side-line` / `--side-muted` | brancos translúcidos .18 / .08 / .14 / .64 | Item ativo, hover, separadores, rótulos da lateral |
| `--ind-ruim` | `#d64545` | Borda/valor de indicador fora da meta ou em queda |
| `--ind-bom` | `#249c5c` | Dentro da meta, ponto "dados atualizados" |
| `--ind-atencao` | `#eab93f` | Linha/ponto de atenção (texto de atenção usa `--warn`) |
| `--ind-critico` | `#7b2726` | Card "Críticos" |
| `--radius-pn` | `8px` | Cards, selects e itens do painel |
| `--side-w` | `236px` | Largura da lateral |

| Componente | Classes / helper | Notas |
|---|---|---|
| Shell | `.pn-app > .pn-side + .pn-scrim + .pn-main` | Gerado por `shell()`; lateral sticky; < 760px vira gaveta com `.pn-mbar` (menu + logo) |
| Lateral | `.pn-logo` (logo branco ou nome em Faustina) · `.pn-prod small + b` · `.pn-nav button(.on)` · `.sep` · `.pn-side-foot` | Grupo `admin` abaixo do separador |
| Barra de status | `.pn-top > .pn-status(i) + .pn-icon-btn(.badge)` | `atualizadoEm`, `notificacoes` do `APP_CFG` |
| Cabeçalho | `H.cabecalho(rótulo, título, subtítulo)` → `.pn-head .eyebrow h1 p` | Título 32px Faustina |
| Filtros | `H.filtros([{id, rotulo, opcoes, valor}], acoes)` → `.pn-filtros` | Uma linha, rótulos em caixa alta; "Limpar filtros" em `.btn-link` apagado |
| Seção | `H.secao(título, sub, ação)` → `.pn-sec` | Ex.: "Agosto de 2026 / Resumo do período / Gerar relatório" |
| Card de indicador | `H.kpi({rotulo, valor, unidade, sub, tom, barra, direcao, cor})` → `.pn-kpi(.ruim/.bom/.atencao/.critico)` | Borda esquerda 3px na cor do tom; `direcao: 'desce'/'sobe'` + `cor: 'neg'/'pos'` para variação |
| Grade | `.pn-grid > .pn-card > .pn-card-h(h3, small, ação)` | 1,75fr + 1fr; uma coluna abaixo de 1100px |
| Gráfico | `H.graficoBarras(dados, {titulo, meta, atencao, max, sufixo, casas})` + `H.ligarGraficos(el, [dados])` | SVG em escala, barras na cor da marca com topo arredondado 4px, linhas Meta/Atenção rotuladas, tooltip no hover e foco, tabela acessível |
| Lista de atenção | `H.listaAtencao([{titulo, detalhe, tom}])` → `.pn-lista .pn-item` | Ponto colorido + texto (status nunca só por cor) |

## Tokens (`:root`)

| Grupo | Token | Valor |
|---|---|---|
| Marca | `--brand` | `#791e01` (único valor trocável por empresa/cliente, via `corPrimaria`) |
| | `--brand-700` | `color-mix(in srgb, var(--brand) 82%, black)`: hover do primário, gradientes |
| | `--brand-100` | `color-mix(... 14%, white)`: trilhas de barra/anel, focus ring |
| | `--brand-50` | `color-mix(... 6%, white)`: fundo de item ativo, alert info, btn-soft |
| Superfícies | `--bg` `#faf7f5` · `--surface` `#ffffff` | |
| Texto | `--ink` `#1d1714` · `--ink-2` `#4a403b` · `--muted` `#7a6f6a` | |
| Linhas | `--line` `#ebe3df` · `--line-2` `#f3eeeb` | |
| Estados | `--ok` `#2f7a4f`/`--ok-bg` `#e8f3ec` · `--warn` `#9a5b00`/`--warn-bg` `#fdf3e2` · `--err` `#b42318`/`--err-bg` `#fdecea` · `--lock` `#9b918c`/`--lock-bg` `#f2eeec` | |
| Forma | `--radius` 14px · `--radius-sm` 9px | botões 10px, inputs 10px, modal 18px, pílulas 99px |
| Sombra | `--shadow` (cards) · `--shadow-lg` (menu, modal, toast) | |
| Tipo | `--serif` Faustina (h1–h3, valores de KPI, `.prose .h`) · `--sans` Inter (todo o resto) | body 15px / 1.55 (14px abaixo de 760px) |

Regras: **nenhuma cor nova em hex** fora destes tokens (exceção já presente no base: `#fcfaf9` em cabeçalho de
tabela/hover e `#c9a227` do troféu). Cores novas, se inevitáveis, derivam de `--brand` com `color-mix`.

## Head obrigatório

Exatamente como no base: `<!DOCTYPE html>`, `<html lang="pt-BR">`, `<base target="_top">`, `charset utf-8`,
`viewport`, os dois `preconnect`, o link do Google Fonts (Faustina 500/600/700/600i + Inter 400–700),
`<style>:root { --brand: ... }</style>` separado, depois o bloco de CSS do base. Fora do Apps Script, acrescente
`<title>`; dentro, o título vem de `HtmlService...setTitle()`.

## Esqueleto do body

```html
<div id="app" aria-live="polite"><div class="boot"><div class="spinner"></div></div></div>
<div id="modal-root"></div>
<div id="toast-root" role="status"></div>
<script>window.APP_CFG = {...}</script>   <!-- configuração injetada (nomeEmpresa, nomeApp, logoUrl, corPrimaria) -->
<script>var App = (function(){ ... })();</script>   <!-- núcleo: helpers + views -->
<script>App.iniciar();</script>
```

## Componentes (classes do base)

| Componente | Classes | Notas |
|---|---|---|
| Botões | `.btn` + `.btn-primary` / `.btn-ghost` / `.btn-soft` / `.btn-ok` / `.btn-link`; tamanhos `.btn-sm` `.btn-lg`; `[disabled]` | ícone SVG antes do texto; loading via `ocupado(btn, promessa)` |
| Formulário | `.field > label + .input` (input/select/textarea) | foco: borda `--brand` + anel `--brand-100` |
| Alertas | `.alert` + `.alert-err` / `-ok` / `-info` / `-warn` | ícone + `<div>` texto |
| Topbar | `.topbar > .topbar-in > .brand(.sep .nm small) .nav button(.on) .spacer .me` | sticky, blur 8px, altura 68px (60 mobile), largura 1160px |
| Navegação mobile | `.mobile-nav button(.on)` | aparece < 760px, fixa embaixo, safe-area |
| Página | `main.page` (max 1160, padding 32/24/80) | |
| Saudação | `.hello h1 + p` | |
| Grid | `.grid` + `.kpis` (4 col) / `.kpis.k6` (3) / `.two` (1.4fr 1fr) | colapsa em 980 e 760px |
| Card | `.card` (+ `.panel`, `.kpi`, `.box`, `.empty`, `.entrega`) | borda `--line` + `--shadow` |
| KPI | `.kpi > .lbl + .val(small) + .sub` / `.kpi-row` | valor em Faustina 34px |
| Destaque | `.card.continue` (gradiente brand → brand-700, texto branco) | CTA branco |
| Cabeçalho de painel | `.panel-h > h3 + ação` | |
| Lista compacta | `.mini-list > button.mini > .dot + .t(b, span) + chev` | |
| Status | `.pill.s-STATUS` · `.dot.s-STATUS` | CONCLUIDO, EM_ANDAMENTO, DISPONIVEL, BLOQUEADO, EM_BREVE, PENDENTE_AVALIACAO, REVISAR |
| Progresso | `.bar > i` (`.bar.ok`) · `.ring` (`--p`, `--sz`, `--th`) | helpers `barra(p)` e `ring(p)` |
| Rótulo | `.eyebrow` | faz parte do padrão GG (ver conflitos em `integracao-skills.md`) |
| Trilha/timeline | `.trail > .step(.done) > .rail(.dot .ln) + .tcard(.clicavel .lock)` | |
| Breadcrumb | `.crumb button` | |
| Hero interno | `.t-hero` + `.t-prog .ring` | |
| Acordeão | `.items > .item(.open .ok) > .item-h(.item-ic .item-t .chev) + .item-b` | |
| Mídia | `.embed` (16:9) / `.embed.doc` | iframes |
| Texto longo | `.prose` (p, ul com seta →, `.h`) | |
| Chave-valor | `dl.kv > dt + dd` | |
| Estado bloqueado | `.blocked .big` | |
| Quiz/opções | `.q .qn h3 .opt(.sel) .l` · `.quiz-foot` | |
| Modal | `#modal-root > .overlay > .modal(.wide) h2 ... .acts` | helper `modal(html, {wide, fixo})`, `[data-fechar]` |
| Toast | `#toast-root > .toast(.ok .err)` | helper `toast(msg, 'ok'|'err')` |
| Abas | `.tabs button.on` (segmentado) · `.subtabs button.on` (sublinhado) + `.badge` | |
| Filtros | `form.card.filters` (6 col → 2 → 1) | |
| Tabela | `.table-wrap > table.t` (th sticky, `.num` tabular) · `.mini-bar` | |
| Chips | `.people > .chip` | |
| Checklist | `.check-list label` | |
| Carregando / erro | `.loading .spinner` · `carregando(el)` · `erroNaTela(el, e, tentar)` · `.boot` | |
| Login (split) | `.login > .login-brand + .login-form > .login-card` · `.flow` | |

## Ícones

SVG inline, `viewBox 0 0 24 24`, `class="i"` (18px, stroke 2, round), dicionário `ICONES` + helper `ic(nome)`.
Novos ícones no mesmo traço (pode copiar os paths do lucide). **Nunca emoji como ícone** (o único emoji do base é
o 🎉 do texto "Você está em dia").

## JS: convenções

- Um IIFE de núcleo (`Hub`/`App`) exporta helpers; views extras em IIFEs `(function (H) { ... })(App)`.
- Tudo que vem de dados passa por `esc()` antes de entrar em `innerHTML`.
- Backend: `google.script.run` embrulhado em Promise (`api('nomeFuncao', ...args)`), resposta `{ ok, data, erro }`.
- Navegação: `registrar(nome, ...)`, `ir(rota)`, `google.script.history.push` (try/catch).
- Nomes de variáveis, funções e textos em **português** (`carregando`, `fecharModal`, `ocupado`).
- `localStorage` sempre em try/catch.

## Responsivo

Breakpoints do base: **1180** (esconde progresso do header), **980** (grids colapsam), **760** (mobile: topbar 60px,
nav vai para `.mobile-nav`, cards de 1 coluna, `main.page` padding 22/16/100). Não invente outros sem necessidade.

## Microcopy

pt-BR, direto, segunda pessoa ("Continue de onde parou", "Tentar novamente"). Botões nomeiam a ação. Erros dizem
o problema e a saída. Reticências com `…`.
