#!/usr/bin/env node
// Embute um logo (PNG, SVG, JPG ou WebP) em window.APP_CFG.logoUrl de um HTML gerado pela skill.
// Uso: node embutir-logo.mjs <arquivo.html> <logo.png>
import { readFileSync, writeFileSync } from 'node:fs';
import { extname } from 'node:path';

const [arquivo, logo] = process.argv.slice(2);
if (!arquivo || !logo) { console.error('Uso: node embutir-logo.mjs <arquivo.html> <logo.png|svg|jpg|webp>'); process.exit(2); }
const tipos = { '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
const tipo = tipos[extname(logo).toLowerCase()];
if (!tipo) { console.error('Formato de logo não suportado: ' + extname(logo)); process.exit(2); }

const dataUri = 'data:' + tipo + ';base64,' + readFileSync(logo).toString('base64');
let html = readFileSync(arquivo, 'utf8');
const re = /("logoUrl"\s*:\s*)"[^"]*"/;
if (!re.test(html)) { console.error('Não encontrei "logoUrl" em window.APP_CFG neste arquivo.'); process.exit(1); }
html = html.replace(re, (_, chave) => chave + JSON.stringify(dataUri));
writeFileSync(arquivo, html, 'utf8');
console.log('Logo embutido (' + Math.round(dataUri.length / 1024) + ' KB) em ' + arquivo);
