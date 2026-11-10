#!/usr/bin/env node
// Verifica se um HTML segue o padrão GG (references/base-original.html).
// Uso: node verificar.mjs <arquivo.html>
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const base = readFileSync(join(here, '..', 'references', 'base-original.html'), 'utf8');
const alvoPath = process.argv[2];
if (!alvoPath) { console.error('Uso: node verificar.mjs <arquivo.html>'); process.exit(2); }
const alvo = readFileSync(alvoPath, 'utf8');
const norm = (s) => s.replace(/\r\n/g, '\n');

const erros = [], avisos = [], ok = [];
const exige = (cond, msg) => (cond ? ok.push(msg) : erros.push(msg));

// 1. Bloco de CSS do base presente sem alteração
const blocos = [...norm(base).matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
const cssBase = blocos.sort((a, b) => b.length - a.length)[0];
exige(norm(alvo).includes(cssBase), 'Bloco de CSS do base presente e idêntico');

// 2. Head
exige(/<html[^>]*lang="pt-BR"/.test(alvo), '<html lang="pt-BR">');
exige(/<meta charset="utf-8">/i.test(alvo), 'meta charset utf-8');
exige(/name="viewport"[^>]*width=device-width, initial-scale=1/.test(alvo), 'meta viewport');
exige(alvo.includes('family=Faustina:ital,wght@0,500;0,600;0,700;1,600') && alvo.includes('family=Inter:wght@400;500;600;700'), 'Google Fonts Faustina + Inter');
exige(/<style>:root \{ --brand: #[0-9a-fA-F]{3,8}; \}<\/style>/.test(alvo), 'Bloco --brand separado');
if (!alvo.includes('<base target="_top">')) avisos.push('Sem <base target="_top"> (obrigatório em Apps Script)');

// 3. Estrutura do body
['id="app"', 'id="modal-root"', 'id="toast-root"'].forEach((id) => exige(alvo.includes(id), `Raiz ${id}`));
exige(/function esc\(/.test(alvo), 'Helper esc() presente');
if (/class="pn-app"|'pn-app'|"pn-app"/.test(alvo) && /\.pn-side\s*\{/.test(alvo)) ok.push('Layout Painel Executivo (barra lateral + área clara)');
else avisos.push('Sem o layout Painel Executivo (barra lateral marrom). Ele é o formato padrão; use assets/template-painel.html, salvo pedido explícito por outro formato');

// 4. CSS extra (fora do bloco do base): cores, fontes, transições
const extra = norm(alvo).replace(cssBase, '');
const cssExtra = [...extra.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n') +
  [...extra.matchAll(/style="([^"]*)"/g)].map((m) => m[1]).join('\n');
// Tokens do layout Painel Executivo (assets/template-painel.html): --ind-ruim, --ind-bom, --ind-atencao, --ind-critico
const PALETA_PAINEL = ['#d64545', '#249c5c', '#eab93f', '#7b2726'];
const paleta = new Set([...cssBase.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0].toLowerCase()).concat(['#fff', '#ffffff', '#000'], PALETA_PAINEL));
const hexNovos = [...new Set([...cssExtra.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0].toLowerCase()))]
  .filter((h) => !paleta.has(h));
const brandDecl = (alvo.match(/--brand: (#[0-9a-fA-F]{3,8})/) || [])[1];
const hexFora = hexNovos.filter((h) => h !== (brandDecl || '').toLowerCase());
if (hexFora.length) avisos.push(`Cores fora dos tokens no CSS novo: ${hexFora.join(', ')} (use var(--...) ou color-mix com --brand)`);
const fontes = [...cssExtra.matchAll(/font-family:\s*([^;}"]+)/g)].map((m) => m[1].trim()).filter((f) => !/^(var\(--(sans|serif)\)|inherit)$/.test(f));
if (fontes.length) avisos.push(`font-family fora do padrão: ${[...new Set(fontes)].join(' | ')}`);
if (/transition:\s*all\b/.test(cssExtra)) avisos.push('transition: all (especifique propriedades; regra emil-design-eng)');
if (/scale\(0\)/.test(cssExtra)) avisos.push('scale(0) em animação (entre de .95+ com opacity)');
if (/ease-in[^-]/.test(cssExtra)) avisos.push('ease-in em UI (use ease-out / --ease-out)');
if (/@keyframes|transition:/.test(cssExtra) && !/prefers-reduced-motion/.test(alvo)) avisos.push('Há animação nova sem @media (prefers-reduced-motion)');

// 5. Emoji como ícone
const emojis = alvo.replace(cssBase, '').match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu);
if (emojis && emojis.length > 1) avisos.push(`Emojis no HTML (${emojis.length}): confirme que não estão no lugar de ícones (use SVG do ICONES)`);

// 6. Imagens sem alt
const imgsSemAlt = (alvo.match(/<img(?![^>]*\balt=)[^>]*>/g) || []).length;
if (imgsSemAlt) avisos.push(`${imgsSemAlt} <img> sem alt`);

console.log(`\nPadrão GG: ${alvoPath}\n`);
ok.forEach((m) => console.log('  ✔ ' + m));
avisos.forEach((m) => console.log('  ⚠ ' + m));
erros.forEach((m) => console.log('  ✖ ' + m));
console.log(`\n${erros.length} erro(s), ${avisos.length} aviso(s).`);
process.exit(erros.length ? 1 : 0);
