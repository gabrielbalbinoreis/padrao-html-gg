# padrao-html-gg

Skill do Claude Code com o **padrão oficial de criação de HTML do Grupo GG**. Todo HTML gerado segue o web app
de base (*Hub de Capacitação em IA*): os mesmos tokens, fontes (Faustina + Inter), componentes, estrutura e JS.
Ela integra as skills **impeccable**, **taste-skill** e **emil-design-eng**.

> O HTML de base (`references/base-original.html`) é o do web app original, com o e-mail de suporte e os logos
> substituídos por valores genéricos. Não adicione dados internos (e-mails, logos de clientes, credenciais) a este
> repositório: ele é público.

## Instalação

Pré-requisitos: [Claude Code](https://claude.com/claude-code), Git e Node 18+.

### 1. Esta skill

Para todos os projetos (pasta de usuário):

```bash
# macOS / Linux
git clone https://github.com/gabrielbalbinoreis/padrao-html-gg.git ~/.claude/skills/padrao-html-gg

# Windows (PowerShell)
git clone https://github.com/gabrielbalbinoreis/padrao-html-gg.git "$env:USERPROFILE\.claude\skills\padrao-html-gg"
```

Ou pelo CLI de skills:

```bash
npx skills add gabrielbalbinoreis/padrao-html-gg -g
```

### 2. Skills integradas (obrigatórias)

```bash
npx skills add pbakaus/impeccable -g
npx skills add Leonxlnx/taste-skill -g
npx skills add emilkowalski/skill -g
```

Elas precisam ficar em `~/.claude/skills/impeccable`, `~/.claude/skills/design-taste-frontend` e
`~/.claude/skills/emil-design-eng` (e irmãs), porque é nesses caminhos que esta skill as procura.

### 3. Atualizar

```bash
cd ~/.claude/skills/padrao-html-gg && git pull
```

## Uso

No Claude Code, peça qualquer HTML para o Grupo GG ("crie um painel de obras no padrão GG") ou chame direto:

```
/padrao-html-gg painel de acompanhamento de obras
```

Para validar um HTML gerado:

```bash
node ~/.claude/skills/padrao-html-gg/scripts/verificar.mjs caminho/do/arquivo.html
```

## Conteúdo

| Caminho | O que é |
|---|---|
| `SKILL.md` | Instruções da skill (fluxo, regras, Apps Script) |
| `references/base-original.html` | HTML de base (e-mail e logos genéricos). **Não editar** |
| `references/design-system.md` | Catálogo de tokens e componentes |
| `references/integracao-skills.md` | Como as skills externas entram e quem vence nos conflitos |
| `references/react-shadcn.md` | Padrão para projetos React/shadcn/Tailwind |
| `assets/template.html` | Ponto de partida de toda página nova |
| `assets/componentes/` | Componentes extras no padrão (ex.: dropdown de navegação) |
| `assets/react/` | Componentes React de referência |
| `scripts/verificar.mjs` | Validador do padrão |

## Contribuindo

Mudanças no padrão passam por pull request. O arquivo `references/base-original.html` só muda quando o web app de
base mudar; nesse caso, substitua pela nova cópia e troque de novo só o e-mail de suporte e os logos (base64)
por valores genéricos antes do commit.
