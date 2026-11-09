# Integração de componentes React (shadcn + Tailwind + TypeScript) no padrão GG

Use quando a entrega for um **projeto React** (Next.js, Vite, Remix) e não um HTML único de Apps Script.
Para HTML único, use os ports em `assets/componentes/` (ex.: `dropdown-nav.html`).

## 0. Verificar o projeto

O projeto precisa ter **estrutura shadcn**, **Tailwind CSS** e **TypeScript**. Cheque nesta ordem:

| Item | Como checar | Se faltar |
|---|---|---|
| TypeScript | `tsconfig.json` existe; arquivos `.tsx` | Next: `npx create-next-app@latest --ts`. Vite: `npm create vite@latest -- --template react-ts`. Projeto existente: `npm i -D typescript @types/react @types/react-dom` + `npx tsc --init` |
| Tailwind | `tailwind.config.*` (v3) ou `@import "tailwindcss"` no CSS global (v4); `postcss.config.*` ou `@tailwindcss/vite` | v4 + Vite: `npm i tailwindcss @tailwindcss/vite` e adicionar o plugin no `vite.config.ts`. Next: `npm i tailwindcss @tailwindcss/postcss` + `postcss.config.mjs` |
| shadcn | `components.json` na raiz; `lib/utils.ts` com `cn()` | `npx shadcn@latest init` (cria `components.json`, `lib/utils.ts`, variáveis de tema no CSS global e o alias `@/`) |
| Alias `@/` | `paths: { "@/*": ["./src/*"] }` (ou `./*`) no `tsconfig.json` | o `shadcn init` configura; no Vite, espelhar em `resolve.alias` |

## 1. Caminhos padrão

- Componentes: leia `aliases.components` / `aliases.ui` em `components.json`. O padrão é **`@/components/ui`**
  (`src/components/ui` quando há `src/`).
- Estilos: `tailwind.css` indicado em `components.json` (normalmente `src/app/globals.css`, `app/globals.css` ou `src/index.css`).

**Por que `/components/ui` importa:** é onde o CLI do shadcn grava e procura os primitivos (`npx shadcn add button`
escreve lá), os imports de exemplo da comunidade (`@/components/ui/...`) assumem esse caminho, e separar
primitivos reutilizáveis (ui/) dos componentes de feature (components/) mantém o projeto previsível. Se o
projeto usar outro caminho, crie `components/ui` mesmo assim e ajuste `aliases.ui` em `components.json`, para não
quebrar `npx shadcn add` nem os imports copiados.

## 2. Tokens GG → tema shadcn

Os componentes shadcn usam `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`,
`bg-primary`, `bg-accent`... Mapeie essas variáveis para os tokens do base **no CSS global**, e tudo herda o
padrão GG. Valores tirados de `references/base-original.html`, sem alteração:

```css
@import url("https://fonts.googleapis.com/css2?family=Faustina:ital,wght@0,500;0,600;0,700;1,600&family=Inter:wght@400;500;600;700&display=swap");

:root {
  --brand: #791e01;                     /* troque só este valor por empresa */
  --background: #faf7f5;                /* --bg */
  --foreground: #1d1714;                /* --ink */
  --card: #ffffff;                      /* --surface */
  --card-foreground: #1d1714;
  --popover: #ffffff;
  --popover-foreground: #1d1714;
  --primary: var(--brand);
  --primary-foreground: #ffffff;
  --secondary: #f3eeeb;                 /* --line-2 */
  --secondary-foreground: #4a403b;      /* --ink-2 */
  --muted: #f3eeeb;
  --muted-foreground: #7a6f6a;          /* --muted do base */
  --accent: color-mix(in srgb, var(--brand) 6%, white);   /* --brand-50 */
  --accent-foreground: var(--brand);
  --destructive: #b42318;               /* --err */
  --border: #ebe3df;                    /* --line */
  --input: #ebe3df;
  --ring: color-mix(in srgb, var(--brand) 14%, white);    /* --brand-100 */
  --radius: 14px;
  --font-sans: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --font-serif: 'Faustina', Georgia, serif;
}
body { font-family: var(--font-sans); background: var(--background); color: var(--foreground); font-size: 15px; line-height: 1.55; -webkit-font-smoothing: antialiased; }
h1, h2, h3 { font-family: var(--font-serif); font-weight: 600; letter-spacing: -.01em; line-height: 1.2; }
```

Tailwind v4: exponha em `@theme inline { --color-background: var(--background); ... --font-sans: var(--font-sans); --font-serif: var(--font-serif); }`
(o `shadcn init` gera esse bloco; só substitua os valores do `:root`). Tailwind v3: em `tailwind.config` use
`colors: { background: 'var(--background)', ... }`. Mantenha a variante `.dark` do shadcn apenas se o produto pedir
tema escuro; o base GG é claro.

## 3. Procedimento de integração (qualquer componente colado)

1. **Analise** a estrutura e liste as dependências (`import` externos).
2. **Revise props e estado:** que dados entram, que estado é interno, que callbacks saem.
3. **Contextos e hooks:** identifique providers necessários (ex.: `ThemeProvider`, `TooltipProvider`) e instale-os.
4. **Perguntas a responder antes de colar** (pergunte ao usuário só o que o código e o pedido não respondem):
   - Que dados/props serão passados? De onde vêm?
   - Há requisito de gerência de estado (rota ativa, URL, store global)?
   - Há assets (imagens, ícones, logos)?
   - Qual o comportamento responsivo esperado (desktop / tablet / 390px)?
   - Qual o melhor lugar do app para usar o componente?
5. **Passos:**
   0. Copiar o código nos diretórios corretos (`components/ui/<nome>.tsx`; demo em rota/página ou `components/demo/`).
   1. Instalar dependências externas.
   2. Imagens: usar fotos do Unsplash que você sabe que existem (`https://images.unsplash.com/photo-<id>?w=1200&q=80`),
      nunca IDs inventados. Em projeto de cliente, deixe o slot marcado para a foto real.
   3. Ícones e logos: `lucide-react`.
6. **Ajuste ao padrão GG** (obrigatório): cores só via variáveis do tema (seção 2), Faustina nos títulos,
   Inter no corpo, raios 9/10/14/16/18px do base, sombras `--shadow`/`--shadow-lg`, textos de UI em pt-BR.
7. Passe o resultado por `impeccable audit` e pela checklist de motion do `emil-design-eng` (ver `integracao-skills.md`).

## 4. Componente registrado: DropdownNavigation

Arquivos originais (como recebidos, não editar): `assets/react/dorpdown-navigation.tsx` e `assets/react/demo.tsx`.

- Destino: `components/ui/dorpdown-navigation.tsx` (mantenha o nome, porque o demo importa
  `@/components/ui/dorpdown-navigation`) e `demo.tsx` onde o projeto guarda demos/páginas.
- Dependências: `npm i lucide-react framer-motion`.
- Props: `navItems: { id: number; label: string; link?: string; subMenus?: { title; items: { label; description; icon: React.ElementType }[] }[] }[]`.
- Estado interno: `openMenu` (label aberto) e `isHover` (id com fundo animado via `layoutId="hover-bg"`); nenhum provider.
- Assets: só ícones lucide; nenhuma imagem.

**Pontos que o código recebido tem e que você resolve na cópia do projeto (não no arquivo de referência):**

| Ponto | Ajuste no projeto |
|---|---|
| `({ navItems }: Props)`, mas `Props` descreve **um** item, então o TS acusa erro | `type NavItem = {...}` e `({ navItems }: { navItems: NavItem[] })` |
| Itens com `link` renderizam `<button>` sem navegar | renderizar `<a href={navItem.link}>` quando não houver `subMenus` |
| Sub-itens com `href="#"` fixo | adicionar `link?: string` em `items` e usar `href={item.link ?? "#"}` |
| Wrapper `<main className="min-h-screen ...">` | é só para demo; num header real, retire o `<main>` e use o `<ul>` dentro da topbar |
| Abre só por hover (sem teclado/toque) | abrir também no `onClick` e `onFocus`, fechar com `Escape`, `aria-expanded` no botão |
| Fundo do hover `bg-primary/10` | com o mapeamento GG fica `--brand` a 10%, igual ao `.nav button.on` do base |
| Motion | `transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}` no painel; respeitar `useReducedMotion()` |

**Uso recomendado no padrão GG:** navegação principal de sites/portais institucionais com muitos destinos agrupados
(Persuade/Read). Em apps operacionais (painéis, hubs, admin) prefira a `.nav` simples do base + `.subtabs`.
Equivalente sem React: `assets/componentes/dropdown-nav.html`.
