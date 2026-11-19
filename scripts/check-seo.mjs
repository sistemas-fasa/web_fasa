import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { site, branches, categoryPages } from '../src/site-content.js';

const dist = resolve(import.meta.dirname, '../dist');
const routes = ['/', ...categoryPages.map(category => '/rubros/' + category.slug + '/')];
const titles = new Set();
const sitemap = await readFile(join(dist, 'sitemap.xml'), 'utf8');

for (const path of routes) {
  const html = await readFile(join(dist, path, 'index.html'), 'utf8');
  const canonical = site.origin + path;
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert.ok(title, path + ': falta el título');
  assert.ok(!titles.has(title), path + ': título repetido');
  titles.add(title);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, path + ': debe tener un H1');
  assert.ok(html.includes('<link rel="canonical" href="' + canonical + '"'), path + ': canonical incorrecta');
  assert.ok(html.includes('property="og:image"'), path + ': falta imagen social');
  assert.ok(html.includes(site.address), path + ': falta dirección en HTML');
  assert.ok(html.includes('7:15 a 12:00'), path + ': faltan horarios en HTML');
  assert.ok(html.includes('/rubros/herramientas/'), path + ': faltan enlaces a rubros');
  assert.ok(sitemap.includes('<loc>' + canonical + '</loc>'), path + ': falta en sitemap');
  const match = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/);
  assert.ok(match, path + ': faltan datos estructurados');
  const graph = JSON.parse(match[1])['@graph'];
  const business = graph.find(item => item['@type'] === 'HardwareStore');
  assert.equal(business.telephone, site.telephone);
  for (const branch of branches) {
    const entry = graph.find(item => item['@id'] === site.origin + '/#' + branch.id);
    assert.ok(entry, path + ': falta sucursal ' + branch.city);
    assert.equal(entry.telephone, branch.telephone);
    assert.equal(entry.hasMap, branch.maps);
    assert.equal(entry.address.streetAddress, branch.address);
    assert.equal(entry.address.addressLocality, branch.city);
    assert.equal(entry.openingHoursSpecification.length, 3);
    assert.ok(html.includes(branch.address), path + ': falta dirección visible');
    assert.ok(html.includes(branch.phoneLabel), path + ': falta teléfono visible');
  }
  assert.equal(business.areaServed.name, site.region);
  assert.ok(html.includes(site.delivery), path + ': falta información de entregas');
  assert.equal(business.hasMap, site.maps);
  assert.ok(business.sameAs.includes(site.instagram));
  assert.equal(business.openingHoursSpecification.length, 3);
  assert.equal(graph.find(item => item['@type'] === 'WebPage').url, canonical);
  console.log('OK ' + path);
}

await access(join(dist, 'media/compartir.jpg'));
await access(join(dist, 'media/web.config'));
const robots = await readFile(join(dist, 'robots.txt'), 'utf8');
assert.ok(robots.includes('Allow: /'));
assert.ok(robots.includes('Sitemap: ' + site.origin + '/sitemap.xml'));
assert.ok(!robots.includes('Disallow: /'));
console.log('OK sitemap, robots, imagen social y MIME WebP para IIS.');
