import { mkdir, copyFile, readFile, rm } from 'node:fs/promises';
import { dirname, extname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { linkPage } from '../src/content.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'dist');
const files = new Set();

async function include(reference, from = 'index.html') {
  if (!reference || /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(reference)) return;
  const clean = reference.split(/[?#]/)[0];
  const absolute = reference.startsWith('/')
    ? resolve(root, `.${clean}`)
    : resolve(root, dirname(from), clean);
  if (!absolute.startsWith(root + sep)) throw new Error(`Asset escapes project: ${reference}`);
  const path = relative(root, absolute).replaceAll('\\', '/');
  if (files.has(path)) return;
  const source = await readFile(absolute); // 누락된 파일은 빌드 단계에서 검출
  files.add(path);
  const text = source.toString('utf8');
  const extension = extname(path);
  if (extension === '.html') {
    for (const match of text.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/g)) await include(match[1], path);
  }
  if (extension === '.css') {
    for (const match of text.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) await include(match[1], path);
  }
  if (extension === '.js' || extension === '.mjs') {
    for (const match of text.matchAll(/\bimport\s+(?:[^;]*?\s+from\s+)?["']([^"']+)["']/g)) await include(match[1], path);
  }
}

await include('/index.html');
await include(linkPage.profile.imageSrc);
for (const link of [...linkPage.links, ...(linkPage.archive?.links || [])]) await include(link.imageSrc);
for (const benefit of linkPage.signup.benefits || []) await include(`/public/icons/${benefit.icon}.svg`);
for (const license of ['/public/icons/LICENSE', '/public/fonts/SUIT-LICENSE']) await include(license);

// 고정된 프로젝트 내부 dist 경로만 정리해 이전 스크린샷·파일이 남지 않게 합니다.
if (dirname(output) !== root || relative(root, output) !== 'dist') throw new Error('Invalid output path');
await rm(output, { recursive: true, force: true });
for (const file of [...files].sort()) {
  const destination = resolve(output, file);
  await mkdir(dirname(destination), { recursive: true });
  await copyFile(resolve(root, file), destination);
}
console.log(`Production build complete: dist/ (${files.size} referenced assets and licenses)`);
