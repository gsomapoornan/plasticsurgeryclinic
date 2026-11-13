import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const root = process.argv[2] ?? 'dist';
const html = readFileSync(join(root, 'index.html'), 'utf8');
const js = readFileSync(join(root, 'site.js'), 'utf8');
const ids = new Set(Array.from(html.matchAll(/\bid="([^"]+)"/g), ([, id]) => id));
for (const [, anchor] of html.matchAll(/href="#([^"]+)"/g)) assert(ids.has(anchor), 'Missing anchor: ' + anchor);
for (const [, asset] of (html + '\n' + js).matchAll(/["']\.\/([^"'#]+)(?:#[^"']*)?["']/g)) assert(statSync(join(root, asset)).isFile(), 'Missing asset: ' + asset);

const clips = ['arrival', 'welcome', 'preparation', 'surgery'];
assert.deepEqual(Array.from(js.matchAll(/src: '\.\/media\/([^']+)\.mp4'/g), ([, name]) => name), clips);
for (const clip of clips) {
  const mp4 = readFileSync(join(root, 'media', clip + '.mp4'));
  assert.equal(mp4.toString('ascii', 4, 8), 'ftyp');
}
if (process.argv.includes('--pages')) {
  function checkSizes(dir) {
    for (const item of readdirSync(dir, {withFileTypes:true})) {
      const path = join(dir, item.name);
      if (item.isDirectory()) checkSizes(path);
      else assert(statSync(path).size <= 25 * 1024 * 1024, 'Cloudflare Pages file limit exceeded: ' + path);
    }
  }
  checkSizes(root);
}
console.log('Verified homepage anchors, assets and four-clip order.');
