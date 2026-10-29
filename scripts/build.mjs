import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const src = path.join(root, 'src');
const assets = JSON.parse(await readFile(path.join(root, 'assets/manifest.json'), 'utf8'));
const byPath = new Map(assets.map(asset => [asset.path, asset]));

function inside(base, relative) {
  const target = path.resolve(base, relative);
  if (!target.startsWith(path.resolve(base) + path.sep)) throw new Error(`Invalid project path: ${relative}`);
  return target;
}

async function replaceAsync(text, pattern, callback) {
  const matches = [...text.matchAll(pattern)];
  for (let i = matches.length - 1; i >= 0; i--) {
    const match = matches[i];
    text = text.slice(0, match.index) + await callback(match) + text.slice(match.index + match[0].length);
  }
  return text;
}

let html = await readFile(path.join(src, 'index.template.html'), 'utf8');
html = await replaceAsync(html, /(?:\/\* @inline ([\w./-]+) \*\/|\/\/ @inline ([\w./-]+))/g,
  match => readFile(inside(src, match[1] || match[2]), 'utf8'));
html = await replaceAsync(html, /\{\{json:([\w./-]+)\}\}/g,
  async match => JSON.stringify(JSON.parse(await readFile(inside(src, match[1]), 'utf8'))));
html = await replaceAsync(html, /\{\{asset:([\w./-]+)\}\}/g, async match => {
  const asset = byPath.get(match[1]);
  if (!asset) throw new Error(`Missing manifest entry: ${match[1]}`);
  const bytes = await readFile(inside(root, asset.path));
  return `data:${asset.mime};base64,${bytes.toString('base64')}`;
});
html = await replaceAsync(html, /\{\{base64:([\w./-]+)\}\}/g,
  async match => (await readFile(inside(root, match[1]))).toString('base64'));
if (/\{\{(?:asset|base64|json):|@inline (?:styles|scripts)\//.test(html)) throw new Error('Unresolved build marker.');
await writeFile(path.join(root, 'index.html'), html);
console.log(`Built index.html (${(Buffer.byteLength(html) / 1e6).toFixed(2)} MB). No runtime dependencies.`);
