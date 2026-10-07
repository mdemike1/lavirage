#!/bin/sh
# Genera las imágenes de marca a partir de las plantillas HTML de esta carpeta:
#   assets/og.jpg               1200 × 630  imagen para compartir (Open Graph / X)
#   assets/apple-touch-icon.png  180 × 180  icono de inicio en iOS
#   assets/favicon-32.png         32 × 32   favicon PNG de respaldo
#
# Requisitos: macOS con Google Chrome y sips (viene con el sistema).
# Necesita conexión: la plantilla del og carga las fuentes de Google Fonts.
# Uso: sh scripts/genera-imagenes.sh   (desde la raíz del repo)
set -e

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
DIR="$(cd "$(dirname "$0")" && pwd)"
RAIZ="$(dirname "$DIR")"
TMP="$(mktemp -d)"

captura () { # plantilla ancho alto salida.png
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --virtual-time-budget=10000 --window-size="$2,$3" \
    --screenshot="$4" "file://$DIR/$1" >/dev/null 2>&1
}

captura og.html 1200 630 "$TMP/og.png"
sips -s format jpeg -s formatOptions 88 "$TMP/og.png" --out "$RAIZ/assets/og.jpg" >/dev/null

# Chrome headless no baja de ~500 px de ventana: se renderiza grande y se reduce
captura icono.html 600 600 "$TMP/icono.png"
sips -z 180 180 "$TMP/icono.png" --out "$RAIZ/assets/apple-touch-icon.png" >/dev/null
sips -z 32 32 "$TMP/icono.png" --out "$RAIZ/assets/favicon-32.png" >/dev/null

rm -rf "$TMP"
sips -g pixelWidth -g pixelHeight "$RAIZ/assets/og.jpg" "$RAIZ/assets/apple-touch-icon.png" "$RAIZ/assets/favicon-32.png"
