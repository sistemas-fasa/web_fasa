# Promocional de Ferretería Avenida

Proyecto independiente de la web. Video vertical 1080 × 1920, 30 fps, 26,5 segundos.

## Vista previa

Desde esta carpeta: `npm run dev -- --no-open`.
Composición principal: **Avenida-Redes**. Las seis escenas están disponibles individualmente en la carpeta Escenas de Remotion Studio.

## Exportar para redes

En Studio, usar **Render**, elegir **H.264 / MP4** y mantener 1080 × 1920, 30 fps. También se puede ejecutar:

```powershell
npx remotion render src/index.ts Avenida-Redes out/avenida-redes.mp4 --codec=h264 --crf=18
```

## Recursos

- Fotografías, logo y ambientaciones: recursos existentes de la web en `public/media/`.
- `web-rubros.png` y `web-portal.png`: capturas reales de la versión local actualizada.
- `narracion.wav`: voz sintética generada con HeyGen, Rocío, español, voz pública `84854979e66846989bc6c5855f53268f`. Duración informada: 24,7946 segundos. Sin cambios de velocidad. La voz no corresponde a una persona de la empresa.
- `musica.wav`: base instrumental original sintetizada para esta pieza, 96 BPM. Se mezcla al 16 % con entrada y salida gradual.
- Las imágenes de productos y ambientaciones son de referencia; no se anuncian precios ni existencias.

## Texto de la locución

Tu próximo proyecto empieza en Avenida. Ahora, también desde nuestra web. Explorá construcción, terminaciones, instalaciones y herramientas. Consultanos por WhatsApp por precios, disponibilidad o un presupuesto. Y si ya tenés cuenta, ingresá al Portal de Ventas. Estamos en Puerto Rico y Capioví, Misiones. Entrá a ferretería avenida punto com punto ar. Tu proyecto, más cerca.

## Texto sugerido para acompañar la publicación

Tu próximo proyecto empieza en Avenida. 🏠
Explorá nuestros rubros y consultanos por WhatsApp por precios, disponibilidad o presupuestos.

🌐 ferreteriaavenida.com.ar
📍 Puerto Rico y Capioví, Misiones

#FerreteríaAvenida #Misiones #PuertoRico #Capioví #Construcción

## Publicación

Este proyecto no forma parte del contenido que se sube al hosting. Para redes se comparte el MP4 exportado. La pieza muestra la versión actualizada de la web: conviene publicar primero esa versión.

## Versión cuadrada para Instagram

Composición **Avenida-Instagram**, 1080 × 1080 (1:1), 30 fps y 26,5 segundos. Las seis escenas se reorganizan para el encuadre cuadrado. Conserva la locución y la música. Archivo exportado: `out/Avenida-Instagram.mp4` (H.264, AAC, yuv420p). La versión vertical permanece en `out/Avenida-Redes.mp4`.
