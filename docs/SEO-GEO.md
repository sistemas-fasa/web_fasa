# SEO y GEO de Ferretería Avenida

## Alcance implementado

El build genera HTML completo para estas cinco URLs:

- https://ferreteriaavenida.com.ar/
- https://ferreteriaavenida.com.ar/rubros/construccion/
- https://ferreteriaavenida.com.ar/rubros/terminaciones/
- https://ferreteriaavenida.com.ar/rubros/instalaciones/
- https://ferreteriaavenida.com.ar/rubros/herramientas/

El contenido se genera al compilar y React lo hidrata en el navegador. Ferozo sirve archivos estáticos. La portada conserva su secuencia visual. Las tarjetas conservan el detalle modal y desde ese detalle se puede abrir la página del rubro. Las preguntas frecuentes también enlazan a los cuatro rubros mediante enlaces HTML normales.

Cada página tiene título y descripción propios, URL canónica, Open Graph, tarjeta social, una única etiqueta H1 y JSON-LD. Los datos estructurados incluyen HardwareStore, WebSite y WebPage. Los rubros agregan BreadcrumbList.

El build también genera sitemap.xml. robots.txt permite rastrear el sitio y señala ese sitemap. Las imágenes, CSS y JavaScript permanecen accesibles.

## Datos comerciales confirmados por el propietario

- Empresa: Ferretería Avenida S.A.
- Dirección: Facundo Quiroga 298, Puerto Rico, Misiones, Argentina.
- Teléfono: (03743) 420344.
- WhatsApp: 3743-400209.
- Correo: ventas@ferreteriaavenida.com.ar.
- Horarios de lunes a viernes: 7:15 a 12:00 y 15:00 a 19:00.
- Sábados: 7:15 a 12:00.
- Maps: https://maps.app.goo.gl/WGwjqiw6ojnehB89A
- Instagram: https://www.instagram.com/avenida.fasa/
- Portal de Ventas: https://ventas.ferreteriaavenida.com.ar/
- Sucursal Capioví: Av. Los Próceres, Capioví, Misiones.
- Teléfono de Capioví: (03743) 47-6743.
- Maps de Capioví: https://maps.app.goo.gl/gkpBxn3uHG7arnFp8
- Horarios de Capioví: los mismos de Puerto Rico, confirmados por el propietario.

Ambos locales aparecen en la sección Sucursales, con dirección, teléfono, horario y enlace de Maps propios. Cada local tiene un nodo HardwareStore distinto, vinculado a la misma Organization. La foto de fachada de Puerto Rico no se presenta como fotografía de la sucursal.

Los horarios están visibles y coinciden con openingHoursSpecification. Los horarios de feriados se consultan con el local. El propietario confirmó entregas a distintos puntos de Misiones. Se comunica esa cobertura y se solicita consultar las condiciones por localidad. Los datos estructurados incluyen Misiones como área atendida. No se agregaron localidades específicas, plazos, costos, coordenadas, calificaciones ni planes de pago.

La selección de modelos, precios, existencias y las líneas de agua y griferías requieren validación comercial. Las ambientaciones ilustrativas siguen identificadas. Las imágenes oficiales de herramientas representan referencias de fabricantes.

## Temas de búsqueda y páginas

| Intención | Página |
| --- | --- |
| Ferretería en Puerto Rico, Misiones; Ferretería Avenida; contacto y horarios | Inicio |
| Hierros, chapas y materiales de construcción en Misiones | Construcción |
| Cerámicas, sanitarios y pinturas en Misiones | Terminaciones |
| Materiales para instalaciones en Misiones | Instalaciones |
| Herramientas Milwaukee y Hamilton en Misiones | Herramientas |

Estas son intenciones editoriales basadas en el negocio y sus rubros. No se midieron volúmenes de búsqueda, posiciones ni dificultad de palabras clave.

Las páginas explican qué se puede consultar y qué información ayuda a identificar un material o pedir presupuesto. Las preguntas frecuentes responden ubicación, horario, productos, contacto y acceso al portal. Esto facilita tanto la lectura humana como la extracción de información por buscadores y asistentes.

## Publicación manual en Ferozo

1. Ejecutar npm ci si se está preparando una computadora nueva.
2. Ejecutar npm run build.
3. Ejecutar npm run check:seo.
4. Respaldar la versión publicada.
5. Subir el contenido completo de dist al directorio público del dominio. Incluir index.html, assets, media, rubros, robots.txt y sitemap.xml.
6. Conservar media/web.config para habilitar WebP en IIS.
7. Abrir las cinco URLs directamente y verificar que respondan con HTTP 200.
8. Verificar robots.txt, sitemap.xml y la vista previa al compartir.

Las páginas de rubro son directorios con index.html. El hosting debe servir index.html como documento predeterminado en esos directorios. No hace falta instalar Node en Ferozo.

La imagen para compartir es media/compartir.jpg, tomada de la fotografía real de la fachada.

## Acciones pendientes en servicios externos

### Dominio y HTTPS

En la revisión pública previa al cambio, HTTP, HTTPS y el host www respondían por separado con 200. La versión generada declara https://ferreteriaavenida.com.ar/ como canónica.

Configurar desde Ferozo una redirección permanente de HTTP a HTTPS y de www al dominio sin www, conservando la ruta y los parámetros. Verificar primero el certificado para ambos nombres y el mecanismo de redirección disponible en esa cuenta. No se reemplazó la configuración raíz de IIS con reglas que dependan de módulos sin comprobar.

### Google Search Console

Verificar la propiedad de dominio por DNS, o usar una propiedad de prefijo HTTPS con el método de verificación que permita el hosting. Una vez subida la versión, enviar https://ferreteriaavenida.com.ar/sitemap.xml y usar Inspección de URLs en inicio y los rubros.

Revisar indexación, páginas excluidas, búsquedas y errores de rastreo. Comparar consultas locales e impresiones a lo largo del tiempo. La lectura HTML y los datos estructurados se validaron localmente. La inspección y validación de Google en la versión publicada quedan pendientes.

### Perfil de Empresa de Google

Mantener nombre, dirección, teléfono, horarios y web consistentes con el sitio. Revisar horarios especiales en feriados, categorías y fotografías reales. Incorporar enlaces a los rubros donde correspondan.

Los cambios en la ficha requieren acceso del propietario. No se modificó la ficha desde este trabajo.

### Bing Webmaster Tools

Verificar el dominio o importar la propiedad autorizada de Search Console. Enviar el mismo sitemap y revisar rastreo e indexación. El acceso de los crawlers depende también de las reglas del hosting, de cualquier firewall y de la infraestructura que se coloque delante del sitio.

### Medición

No se agregaron identificadores de Analytics ni verificaciones inventadas. Cuando se disponga de la propiedad y su identificación real, se puede medir el acceso al portal y los clics de consulta. Search Console y Bing permiten evaluar la visibilidad orgánica.

## Validación local

npm run check:seo comprueba páginas generadas, H1, títulos únicos, canónicas, enlaces internos, datos del negocio, horarios, JSON-LD, sitemap, robots y los archivos de imagen social y configuración MIME.

Se revisaron las cinco páginas con JavaScript habilitado y deshabilitado, y anchos de 1440, 390 y 320 píxeles. Se verificaron también las interacciones del inicio y la hidratación de React.

## Referencias oficiales

- Google y funciones de IA: https://developers.google.com/search/docs/appearance/ai-features
- SEO con JavaScript: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Datos de negocios locales: https://developers.google.com/search/docs/appearance/structured-data/local-business
- HardwareStore: https://schema.org/HardwareStore
- Bing Webmaster Guidelines: https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a

Google mantiene las prácticas de SEO como base para sus funciones de IA. No exige un archivo de IA ni un esquema especial para esas experiencias. La información verificable, el contenido accesible y la coherencia del negocio forman la base de esta implementación.
