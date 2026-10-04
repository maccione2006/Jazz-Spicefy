#!/usr/bin/env bash
set -euo pipefail

THEME_ONLY=0
if [[ "${1:-}" == "--theme-only" ]]; then
  THEME_ONLY=1
elif [[ -n "${1:-}" ]]; then
  echo "Uso: ./install.sh [--theme-only]" >&2
  exit 2
fi

if ! command -v spicetify >/dev/null 2>&1; then
  echo "Errore: 'spicetify' non trovato nel PATH." >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_THEME="$SCRIPT_DIR/JazzClub"

if [[ ! -d "$SOURCE_THEME" ]]; then
  echo "Errore: cartella JazzClub non trovata accanto a install.sh." >&2
  exit 1
fi

CONFIG_PATH="$(spicetify -c | tr -d '\r\n')"
if [[ -z "$CONFIG_PATH" ]]; then
  echo "Errore: Spicetify non ha restituito il percorso di config-xpui.ini." >&2
  exit 1
fi

SPICETIFY_HOME="$(dirname "$CONFIG_PATH")"
THEMES_ROOT="$SPICETIFY_HOME/Themes"
TARGET_THEME="$THEMES_ROOT/JazzClub"

mkdir -p "$THEMES_ROOT"

if [[ -d "$TARGET_THEME" ]]; then
  STAMP="$(date +%Y%m%d-%H%M%S)"
  BACKUP="$THEMES_ROOT/JazzClub.backup-$STAMP"
  cp -R "$TARGET_THEME" "$BACKUP"
  echo "Backup creato: $BACKUP"
  rm -rf "$TARGET_THEME"
fi

cp -R "$SOURCE_THEME" "$TARGET_THEME"

SOURCE_VINYL="$SCRIPT_DIR/Extensions/vinyl.js"
EXTENSIONS_ROOT="$SPICETIFY_HOME/Extensions"
if [[ -f "$SOURCE_VINYL" ]]; then
  mkdir -p "$EXTENSIONS_ROOT"
  cp "$SOURCE_VINYL" "$EXTENSIONS_ROOT/vinyl.js"
fi

spicetify config current_theme JazzClub color_scheme JazzClub inject_css 1 replace_colors 1 inject_theme_js 1

if [[ -f "$SOURCE_VINYL" ]]; then
  spicetify config extensions vinyl.js
fi

if [[ "$THEME_ONLY" -eq 0 ]]; then
  spicetify config extensions fullAppDisplay.js
  spicetify config custom_apps lyrics-plus
fi

spicetify apply

echo
echo "JazzClub installato con successo."
echo "Tema: $TARGET_THEME"
if [[ "$THEME_ONLY" -eq 0 ]]; then
  echo "Full App Display + Lyrics Plus abilitati."
fi
echo "Vinyl engine installato e abilitato."
echo "Track Peek non e' incluso."
