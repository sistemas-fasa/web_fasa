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

- Entrada a pantalla completa con la fachada sola. El scroll acerca la vista a la puerta, da paso al salón y muestra los cuatro rubros. El encabezado aparece al llegar a las opciones.
- Indicación «Deslizá para entrar» sobre la fachada y una única selección de rubros sobre el salón. Cada tarjeta abre un detalle modal, que se cierra con el botón Cerrar o Escape.
- Secuencia de entrada y aparición de fotografías ligadas a la posición del scroll, con recorte, zoom y texto. Al subir, se reproducen en sentido inverso.
- Fotografía del mostrador junto a la presentación institucional.
- Dos composiciones de campaña de ejemplo.
- Enlaces al Portal de Ventas, WhatsApp, teléfono, correo y ubicación.
- Diseño adaptable a celular y escritorio.

Los efectos están activados explícitamente en esta propuesta, incluso cuando el navegador indica movimiento reducido. Al pie hay un botón **Animaciones activadas · Desactivar**. La elección se aplica a la vista actual y se reinicia al recargar.

## Tecnología y archivos

React y Vite, con CSS e IntersectionObserver para las animaciones. El prototipo funciona sin backend.

- `src/main.jsx` contiene la página, rubros, enlaces y lógica de movimiento.
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
- Definir las fichas públicas, metadatos por página y SEO.
- Validar el recorrido de solicitud de alta con el proyecto `revendedores`.
- Revisar rendimiento, accesibilidad y despliegue final con la cuenta real del hosting.

La solicitud de alta y las credenciales de clientes se gestionan en el Portal de Ventas. Esta propuesta enlaza al portal existente.

## Publicación por FTP

Para publicar esta vista estática, ejecutar `npm run build` y subir **el contenido de `dist/`** al directorio web del dominio mediante FTP/FTPS. Este paquete se compila en la computadora o en CI y el hosting sirve los archivos resultantes.

La web está configurada para la raíz del dominio. No subir `node_modules/`, las referencias internas ni credenciales. El despliegue real en Ferozo todavía está pendiente.

## Verificaciones realizadas

Compilación de producción y revisión local con Chromium/Edge. Se comprobaron navegación por rubros, imágenes, menú, Escape, enlaces al portal, ausencia de desbordes a 1440, 390 y 320 px, y el efecto de aparición al hacer scroll. También se verificó su funcionamiento con movimiento reducido del navegador y el control de desactivación.
