# Ferretería Avenida — primera idea

Primera propuesta visual navegable para la web institucional de **Ferretería Avenida S.A.**, Puerto Rico, Misiones.

El prototipo explora la identidad roja, blanca y negra de Avenida, combina fotografías reales del local con escenas por rubro y dirige a los clientes al [Portal de Ventas](https://ventas.ferreteriaavenida.com.ar/).

## Ejecutar localmente

Requiere Node.js 22.12 o superior y npm. Desarrollado con Node.js 24.

```bash
npm ci
npm run dev
```

Abrir la dirección que informa Vite.

## Compilar y revisar

```bash
npm run build
npm run preview -- --port 4173 --strictPort
```

La vista previa queda disponible en http://127.0.0.1:4173/. El sitio compilado se genera en `dist/`.

## Qué incluye esta propuesta

- Recorrido de entrada ligado al scroll, reversible al subir:
  1. **Fachada** retocada en luz de tarde, con vidrieras y lámparas encendidas.
  2. **Puerta**: la cámara avanza, las dos hojas se abren y el salón se ve a través del marco hasta ocupar la pantalla.
  3. **Salón y rubros**: la panorámica real se recorre de izquierda a derecha. Hay carteles de pasillo sobre zonas del local: Instalaciones, Construcción, Mostrador, Herramientas y Terminaciones.
- Una barra «Ya estás adentro» con los cuatro rubros acompaña el salón. Cada cartel o botón abre el detalle modal, que se cierra con Cerrar o Escape.
- Barra de etapas (Fachada · Puerta · Salón · Rubros) y botón «Saltar recorrido». El encabezado se oculta mientras se cruza la puerta.
- Con animaciones desactivadas o sin JavaScript, la fachada y el salón se muestran como bloques fijos. La panorámica se desplaza horizontalmente.
- Aparición de fotografías ligada al scroll en el resto de la página.
- Fotografía del mostrador junto a la presentación institucional.
- Dos composiciones de campaña de ejemplo.
- Enlaces al Portal de Ventas, WhatsApp, teléfono, correo y ubicación.
- Diseño adaptable a celular y escritorio.

Los efectos están activados explícitamente en esta propuesta, incluso cuando el navegador indica movimiento reducido. Al pie hay un botón **Animaciones activadas · Desactivar**. La elección se aplica a la vista actual y se reinicia al recargar.

### Capas del recorrido

`scripts/build-entrada.py` genera las capas a partir de las fotos originales de `referencias/marca/`, excluida de Git. Requiere Python con Pillow y numpy.

- `entrada-fachada.webp`: fachada retocada, sin los carteles «Cerrado» ni «Ambiente climatizado» y sin la mayor parte del estacionamiento.
- `entrada-puerta-izq.webp` y `entrada-puerta-der.webp`: hojas de la puerta para animarlas.
- `showroom-panoramica.webp`: panorámica del salón.

```bash
python scripts/build-entrada.py
```

El script imprime las coordenadas de la puerta. Si cambia la foto o el recorte, copiarlas en la constante `ENTRY` de `src/App.jsx`. La ubicación de los carteles del salón está en `hotspots`, en porcentajes de la panorámica, y falta validarla con el local.

Para la versión definitiva conviene tomar:
- La fachada de frente, centrada en la puerta, con trípode y a la tarde.
- Una panorámica del salón sin clientes reconocibles, a la altura de los ojos.
- Una foto por sector: corralón, cerámicas, pinturas, electricidad y herramientas.

## SEO y GEO

El build prerenderiza inicio y cuatro páginas de rubro como HTML completo. React mantiene las interacciones del sitio. Incluye títulos y descripciones por página, canónicas, datos estructurados del negocio, vista previa social, horarios, preguntas frecuentes, robots.txt y sitemap.xml.

```bash
npm run build
npm run check:seo
```

Los datos comerciales y el contenido editorial de los rubros están en `src/site-content.js`. La presentación de horarios del pie está en `src/App.jsx` y el marcado de horarios en `scripts/prerender.mjs`; mantenerlos sincronizados si cambian.

Ver [implementación, publicación y pendientes de SEO/GEO](docs/SEO-GEO.md).

## Tecnología y archivos

React y Vite, con CSS e IntersectionObserver para las animaciones. El prototipo funciona sin backend.

- `src/main.jsx` inicia o hidrata React.
- `src/App.jsx` contiene las páginas, rubros, enlaces y lógica de movimiento.
- `src/site-content.js` contiene datos del negocio, preguntas y contenido de rubros.
- `scripts/prerender.mjs` genera HTML, metadatos, JSON-LD y sitemap al compilar.
- `scripts/check-seo.mjs` verifica los archivos generados.
- `src/styles.css` contiene el diseño adaptable y los efectos.
- `public/media/` contiene los archivos visuales utilizados.
- `index.html` contiene título, idioma y descripción general.

## Marca e imágenes

El logo oficial y las fotos del local fueron provistos por Ferretería Avenida. Se conservan las proporciones y colores del logo.

Los titulares usan Archivo Black y los textos Instrument Sans, cargados desde Google Fonts. El archivo de la tipografía institucional **Clarendon BLK BT** está pendiente de incorporación y de verificar su licencia para uso web.

Las escenas de construcción, instalaciones y baño fueron generadas como ambientaciones ilustrativas. Se identifican así en pantalla y no representan modelos ni existencias confirmadas. La escena de instalaciones propone agua, conexiones y griferías, además de electricidad, pendiente de validación comercial.

Las imágenes de herramientas son referencias de los fabricantes:

- [Milwaukee M18 FUEL, kit 3697-22](https://www.milwaukeetool.com/products/details/m18-fuel-2-tool-combo-kit/3697-22).
- [Hamilton, set de pinzas JPA002](https://hamilton.com.ar/producto/set-de-pinzas/).

Antes de publicar, corresponde validar modelos comercializados y autorización de uso de los materiales de fabricantes.

Los recursos originales y documentos internos de marca permanecen en `referencias/`, excluidos de Git. El repositorio contiene las imágenes optimizadas necesarias para ejecutar esta propuesta.

## Estado y próximos pasos

Esta versión es una primera idea visual. Quedan pendientes:

- Aprobar textos, rubros, líneas comerciales y material gráfico definitivo.
- Incorporar el pie corporativo aprobado y la fuente institucional.
- Implementar el panel de administración para imágenes, campañas, ofertas y destacados.
- Incorporar persistencia con PHP y MySQL/MariaDB en Ferozo.
- Implementar fichas de productos y completar Search Console, Bing y redirecciones del dominio.
- Validar el recorrido de solicitud de alta con el proyecto `revendedores`.
- Revisar rendimiento, accesibilidad y despliegue final con la cuenta real del hosting.

La solicitud de alta y las credenciales de clientes se gestionan en el Portal de Ventas. Esta propuesta enlaza al portal existente.

## Publicación por FTP

Para publicar esta vista estática, ejecutar `npm run build` y subir **el contenido de `dist/`** al directorio web del dominio mediante FTP/FTPS. Este paquete se compila en la computadora o en CI y el hosting sirve los archivos resultantes.

La web está configurada para la raíz del dominio. La versión visual inicial se publicó manualmente. Cada actualización requiere subir el contenido nuevo de `dist/`, incluidas las carpetas `rubros/`, `assets/`, `media/`, `robots.txt` y `sitemap.xml`. Las mejoras SEO/GEO quedan pendientes de esa publicación. No subir `node_modules/`, las referencias internas ni credenciales.

En hosting Windows con IIS, incluir `media/web.config`, generado junto a las imágenes. Configura el tipo MIME `image/webp` para servir los archivos WebP. Si las imágenes existen pero responden con un error HTTP 404.3, comprobar que este archivo esté en `public_html/media/web.config`.

## Verificaciones realizadas

Compilación de producción y revisión local con Chromium/Edge. Se comprobaron navegación por rubros, imágenes, menú, Escape, enlaces al portal, ausencia de desbordes a 1440, 390 y 320 px, y el efecto de aparición al hacer scroll. También se verificó su funcionamiento con movimiento reducido del navegador y el control de desactivación.
