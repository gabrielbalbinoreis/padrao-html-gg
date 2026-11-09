# Como as skills integradas entram no padrão GG

Skills instaladas em `~/.claude/skills/`:

| Skill | Pasta | Origem | Papel no padrão GG |
|---|---|---|---|
| **impeccable** | `impeccable/` | `pbakaus/impeccable` | Direção de UX, piso de qualidade (`reference/craft-floor.md`), `audit`, `polish`, `harden`, `clarify`, `adapt` |
| **taste-skill** (`design-taste-frontend`) | `design-taste-frontend/` | `Leonxlnx/taste-skill` | Só para **sites/landing pages** (Persuade): plano de seções, copy, fotos, momentos |
| **Emil Kowalski** (`emil-design-eng` + família) | `emil-design-eng/`, `animate/`, `review-animations/`, `improve-animations/`, `animation-performance/`... | `emilkowalski/skill` | Motion e microinterações: easing, duração, `:active`, reduced-motion |

## Hierarquia (o que vence em conflito)

1. **HTML de base GG** (`references/base-original.html`): tokens, fontes, classes, estrutura, JS. Sempre vence.
2. **Pedido explícito do usuário** para esta página.
3. **impeccable**, que concorda com isto: "The brief wins... Refinement preserves". O padrão GG é o mundo visual já
   decidido, então use o impeccable no modo *refinement*, **nunca redesign**.
4. **emil-design-eng** para tudo que se move.
5. **taste-skill** só nas partes que não colidem com 1–4.

## Conflitos já resolvidos (não reabrir)

| Regra da skill externa | Decisão GG |
|---|---|
| impeccable proíbe `eyebrow`/kicker acima de título | **Permitido**: `.eyebrow` é componente do base. Use com parcimônia (no máx. 1 por bloco de destaque) |
| impeccable recusa "progress rings" e grades de KPI | **Permitido** quando o dado existe: `.ring`, `.kpi`, `.bar` são do base. Nunca como enfeite sem dado real |
| impeccable/taste trocam fontes "genéricas" (Inter) | **Fontes fixas**: Faustina + Inter. Não trocar, não adicionar uma terceira |
| taste-skill: fotos em toda tela, uma seção por tela, cenas/shaders | Só em landing page institucional, e mesmo assim com tokens GG. Em apps (painel, hub, admin, formulários): **não se aplica** |
| taste-skill: ícones "reais coloridos" | Ícones do padrão: SVG traço 2 do `ICONES`. Logos de produtos de terceiros podem ser imagem |
| taste-skill: metas `data-type`, `page-type`, gate em Node/Chrome | Opcional; só quando usar o fluxo completo do taste-skill numa landing |
| impeccable: rodar `scripts/impeccable context`, criar PRODUCT.md/DESIGN.md | Opcional. Se rodar no Windows, use `scripts\impeccable.cmd`. Se falhar, siga sem ele (o próprio impeccable prevê isso) e trate `design-system.md` desta skill como o DESIGN.md |
| emil: `transition: all` proibido | O base já especifica propriedades; mantenha assim em CSS novo |
| emil: botões com `:active { transform: scale(.97) }` | **Adicionar** em CSS novo da página (acréscimo depois do bloco do base, nunca editando o bloco) |

## Como usar cada uma no fluxo

**impeccable (sempre):**
- Antes de escrever UI, leia `~/.claude/skills/impeccable/reference/craft-floor.md` e aplique a parte *Verify*
  (contraste ≥ 4.5:1, estados hover/disabled/loading/erro/vazio, foco por teclado, seleção de texto/scrollbar/caret
  com a cor da marca, números tabulares).
- Defina o *modo* da superfície: **Operate** (painéis, hubs, admin, formulários; maioria dos HTMLs GG),
  **Read** (documentação, relatórios), **Persuade** (landing). Para Operate/Read leia `reference/operate.md`.
- Depois de pronto: `reference/audit.md` (técnico) e `reference/polish.md` (acabamento). Para dados reais/erros:
  `reference/harden.md`. Para microcopy: `reference/clarify.md`. Para mobile: `reference/adapt.md`.

**emil-design-eng (sempre que houver animação):**
- Framework: deve animar? (ações repetidas 100x/dia não), qual o propósito, easing (`ease-out` ao entrar,
  nunca `ease-in`), duração (UI ≤ 300ms; dropdown 150–250ms; modal 200–300ms).
- Curvas: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`.
- Nunca `scale(0)`: entrar de `scale(.95–.98)` + `opacity: 0`. Popover nasce do gatilho (`transform-origin`), modal centralizado.
- Hover de movimento só dentro de `@media (hover: hover) and (pointer: fine)`.
- `@media (prefers-reduced-motion: reduce)`: mantém fade/cor, remove deslocamento.
- Stagger de listas 30–80ms, sem bloquear clique.
- Revisões de animação em tabela **Before | After | Why**, como o emil exige.
- Skills irmãs: `review-animations`, `improve-animations`, `animation-performance`, `find-animation-opportunities`.

**taste-skill (só landing/site institucional):**
- Leia `~/.claude/skills/design-taste-frontend/SKILL.md` (house rules) e `references/copy.md`, `sections.md`,
  `photos.md`, `motion.md`.
- Aproveite: plano de seções, voz da copy sem clichês de IA, fotos reais (licenciadas/Unsplash existentes), arestas
  iguais, uma ação principal por tela, entrada do hero.
- Descarte: `system.css`/`starter.html` da skill (o CSS é o do base GG), shaders/cenas fora de página de tecnologia,
  qualquer fonte ou paleta própria.
- O hook `Stop` do taste-skill roda em `sh`; neste Windows (sem Git Bash) ele pode só não executar. Não é erro do padrão GG.
