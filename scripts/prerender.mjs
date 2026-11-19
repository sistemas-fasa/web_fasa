import { build } from 'vite';
import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { site, branches, openingHoursSpecification, categoryPages } from '../src/site-content.js';

const root = resolve(import.meta.dirname, '..');
const cache = join(root, '.prerender');
await mkdir(cache, { recursive: true });
const result = await build({
  root,
  logLevel: 'warn',
  build: {
    ssr: 'src/App.jsx',
    write: false,
    minify: false,
    rollupOptions: { output: { entryFileNames: 'site.mjs' } },
  },
});
const entry = result.output.find(item => item.type === 'chunk' && item.isEntry);
if (!entry) throw new Error('No se generó la entrada de prerenderizado.');
const entryPath = join(cache, 'site.mjs');
await writeFile(entryPath, entry.code);
const { default: Site } = await import(pathToFileURL(entryPath).href);
const template = await readFile(join(root, 'dist/index.html'), 'utf8');
const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const routes = [{ path: '/', title: site.title, description: site.description, name: site.name }];
for (const category of categoryPages) {
  routes.push({ ...category, path: '/rubros/' + category.slug + '/' });
}

for (const route of routes) {
  const canonical = site.origin + route.path;
  const structured = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HardwareStore',
        '@id': site.origin + '/#negocio',
        name: site.name,
        legalName: site.legalName,
        branchOf: { '@id': site.origin + '/#empresa' },
        url: site.origin + '/',
        description: site.description,
        areaServed: { '@type': 'AdministrativeArea', name: site.region },
        telephone: site.telephone,
        email: site.email,
        image: site.origin + '/media/compartir.jpg',
        logo: site.origin + '/media/logo.png',
        hasMap: site.maps,
        sameAs: [site.instagram],
        address: {
          '@type': 'PostalAddress',
          streetAddress: site.address,
          addressLocality: site.city,
          addressRegion: site.region,
          addressCountry: 'AR',
        },
        openingHoursSpecification,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'ventas',
          telephone: '+5493743400209',
          url: site.whatsapp,
          availableLanguage: 'es',
        },
      },
      {
        '@type': 'WebSite',
        '@id': site.origin + '/#sitio',
        url: site.origin + '/',
        name: site.name,
        inLanguage: 'es-AR',
        publisher: { '@id': site.origin + '/#negocio' },
      },
      {
        '@type': 'WebPage',
        '@id': canonical + '#pagina',
        url: canonical,
        name: route.title,
        description: route.description,
        inLanguage: 'es-AR',
        isPartOf: { '@id': site.origin + '/#sitio' },
        about: { '@id': site.origin + '/#negocio' },
        ...(route.path === '/' ? {} : { breadcrumb: { '@id': canonical + '#breadcrumb' } }),
      },
    ],
  };
  structured['@graph'].push(
    {
      '@type': 'Organization',
      '@id': site.origin + '/#empresa',
      name: site.legalName,
      url: site.origin + '/',
      logo: site.origin + '/media/logo.png',
      sameAs: [site.instagram],
      subOrganization: branches.map(branch => ({ '@id': site.origin + '/#' + branch.id })),
    },
    ...branches.slice(1).map(branch => ({
      '@type': 'HardwareStore',
      '@id': site.origin + '/#' + branch.id,
      name: site.name + ' — ' + branch.city,
      branchOf: { '@id': site.origin + '/#empresa' },
      url: site.origin + '/#sucursales',
      telephone: branch.telephone,
      hasMap: branch.maps,
      logo: site.origin + '/media/logo.png',
      areaServed: { '@type': 'AdministrativeArea', name: site.region },
      address: {
        '@type': 'PostalAddress',
        streetAddress: branch.address,
        addressLocality: branch.city,
        addressRegion: site.region,
        addressCountry: 'AR',
      },
      openingHoursSpecification,
    })),
  );
  if (route.path !== '/') {
    structured['@graph'].push({
      '@type': 'BreadcrumbList',
      '@id': canonical + '#breadcrumb',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: site.origin + '/' },
        { '@type': 'ListItem', position: 2, name: route.name, item: canonical },
      ],
    });
  }

  const tags = [
    '<link rel="canonical" href="' + canonical + '" />',
    '<meta name="robots" content="index,follow,max-image-preview:large" />',
    '<meta property="og:type" content="website" />',
    '<meta property="og:locale" content="es_AR" />',
    '<meta property="og:site_name" content="' + escape(site.name) + '" />',
    '<meta property="og:title" content="' + escape(route.title) + '" />',
    '<meta property="og:description" content="' + escape(route.description) + '" />',
    '<meta property="og:url" content="' + canonical + '" />',
    '<meta property="og:image" content="' + site.origin + '/media/compartir.jpg" />',
    '<meta property="og:image:width" content="1760" />',
    '<meta property="og:image:height" content="990" />',
    '<meta property="og:image:alt" content="Fachada de Ferretería Avenida en Puerto Rico, Misiones" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    '<meta name="twitter:title" content="' + escape(route.title) + '" />',
    '<meta name="twitter:description" content="' + escape(route.description) + '" />',
    '<meta name="twitter:image" content="' + site.origin + '/media/compartir.jpg" />',
    '<script type="application/ld+json">' + JSON.stringify(structured).replaceAll('<', '\u003c') + '</script>',
  ].join('\n    ');
  const markup = renderToString(createElement(Site, { path: route.path }));
  const html = template
    .replace(/<title>.*?<\/title>/, '<title>' + escape(route.title) + '</title>')
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, '<meta name="description" content="' + escape(route.description) + '" />')
    .replace('</head>', tags + '\n  </head>')
    .replace('<div id="root"></div>', '<div id="root">' + markup + '</div>');
  const folder = join(root, 'dist', route.path);
  await mkdir(folder, { recursive: true });
  await writeFile(join(folder, 'index.html'), html);
}

const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  routes.map(route => '  <url><loc>' + site.origin + route.path + '</loc></url>').join('\n') + '\n</urlset>\n';
await writeFile(join(root, 'dist/sitemap.xml'), sitemap);
console.log('HTML prerenderizado y metadatos generados para ' + routes.length + ' páginas.');
