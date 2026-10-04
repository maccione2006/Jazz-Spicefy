param(
  [switch]$ThemeOnly
)

$ErrorActionPreference = "Stop"

function Require-Command([string]$Name) {
  if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
    throw "'$Name' non trovato nel PATH. Installa Spicetify prima di continuare."
  }
}

Require-Command "spicetify"

$sourceTheme = Join-Path $PSScriptRoot "JazzClub"
if (-not (Test-Path $sourceTheme)) {
  throw "Cartella JazzClub non trovata accanto a install.ps1."
}

$configPath = (& spicetify -c | Out-String).Trim()
if (-not $configPath) {
  throw "Spicetify non ha restituito il percorso di config-xpui.ini."
}

$spicetifyHome = Split-Path -Parent $configPath
$themesRoot = Join-Path $spicetifyHome "Themes"
$targetTheme = Join-Path $themesRoot "JazzClub"

New-Item -ItemType Directory -Path $themesRoot -Force | Out-Null

if (Test-Path $targetTheme) {
  $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $backup = Join-Path $themesRoot "JazzClub.backup-$stamp"
  Copy-Item $targetTheme $backup -Recurse -Force
  Write-Host "Backup creato: $backup" -ForegroundColor DarkGray
  Remove-Item $targetTheme -Recurse -Force
}

Copy-Item $sourceTheme $targetTheme -Recurse -Force

spicetify config current_theme JazzClub color_scheme JazzClub inject_css 1 replace_colors 1 inject_theme_js 1

if (-not $ThemeOnly) {
  spicetify config extensions fullAppDisplay.js
  spicetify config custom_apps lyrics-plus
}

spicetify apply

Write-Host ""
Write-Host "JazzClub installato con successo." -ForegroundColor Green
Write-Host "Tema: $targetTheme"
if (-not $ThemeOnly) {
  Write-Host "Full App Display + Lyrics Plus abilitati."
}
Write-Host "Track Peek non e' incluso."
