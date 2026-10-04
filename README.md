# JazzClub

JazzClub is a cross-platform Spicetify theme that turns Spotify Desktop into a late-night jazz club and premium vintage hi-fi listening room.

> Spotify after midnight, inside a premium jazz listening room.

## Highlights

- deep black and dark walnut surfaces
- vivid warm amber and restrained brass accents
- cream typography
- hi-fi-inspired bottom player
- stable mini-vinyl artwork with playback-aware rotation
- bundled Spotify Spice Vinyl engine for RPM/settings and album-derived vinyl color
- dark vinyl-style Play/Pause knob with an amber ring
- amber Spotify / Encore buttons, including hover and focus states
- amber current-track equalizer
- walnut/amber sticky playlist and album headers
- unified back/forward navigation pill
- JazzClub styling for Spicetify Full App Display and Lyrics Plus
- performance-conscious, event-driven JavaScript
- no polling loops
- no Track Peek

JazzClub deliberately leaves Spotify's track-row layout and visibility untouched.

## Requirements

- Spotify Desktop
- Spicetify CLI

## Marketplace installation

JazzClub Marketplace now uses the **official Spotify Spice Vinyl engine** by
Grason Chan for both records. `JazzClub/marketplace.js` loads Spotify Spice's
official `deploy/extensions/vinyl.js` build and defaults colored vinyl to ON
for first-time JazzClub users. `JazzClub/marketplace.css` maps the same
Spotify Spice variables, grooves, playback state and album-derived color onto:

- the mini vinyl in the bottom player
- the large vinyl in the Now Playing View

The large-vinyl CSS is a compatibility mapping for current Spotify's
`track-visual-enhancement > cover-drop-target > img` markup, because the
current Spotify Spice master source still targets the older `.cover-art`
class there.

The standalone installers below use `JazzClub/user.css` and additionally enable the bundled
Spotify Spice Vinyl extension, Full App Display and Lyrics Plus.

## Quick install

Download or clone this repository, then run the installer from the repository root.

### Windows

PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1
```

Theme only, without enabling Full App Display / Lyrics Plus:

```powershell
powershell -ExecutionPolicy Bypass -File .\install.ps1 -ThemeOnly
```

### Linux

```bash
chmod +x install.sh
./install.sh
```

Theme only:

```bash
./install.sh --theme-only
```

### macOS

The same installer is used on macOS:

```bash
chmod +x install.sh
./install.sh
```

If Spotify is installed in `/Applications`, Spicetify may require:

```bash
spicetify config spotify_path "/Applications/Spotify.app/Contents/Resources"
```

## What the installer does

The default installer:

1. locates your Spicetify config directory using `spicetify -c`
2. copies `JazzClub/` into the correct `Themes/JazzClub` directory
3. copies the bundled `Extensions/vinyl.js` into the correct Spicetify Extensions directory
4. enables the Vinyl extension
5. enables CSS, theme colors and `theme.js`
6. sets `JazzClub` as the current theme and color scheme
7. enables Spicetify's built-in `fullAppDisplay.js`
8. enables the built-in `lyrics-plus` custom app
9. runs `spicetify apply`

It does **not** install or enable Track Peek.

## Manual installation

Copy the `JazzClub` directory to:

| Platform | Theme directory |
| --- | --- |
| Windows | `%appdata%\spicetify\Themes\JazzClub` |
| Linux | `~/.config/spicetify/Themes/JazzClub` |
| macOS | `~/.config/spicetify/Themes/JazzClub` |

Then run:

```bash
spicetify config current_theme JazzClub color_scheme JazzClub inject_css 1 replace_colors 1 inject_theme_js 1
spicetify apply
```

For the optional immersive experience:

```bash
spicetify config extensions fullAppDisplay.js
spicetify config custom_apps lyrics-plus
spicetify apply
```

## Structure

```text
Jazz-Spicefy/
├── JazzClub/
│   ├── color.ini
│   ├── user.css
│   └── theme.js
├── Extensions/
│   └── vinyl.js
├── install.ps1
├── install.sh
├── CHANGELOG.md
├── LICENSE
├── THIRD_PARTY_NOTICES.md
└── README.md
```

## Compatibility

JazzClub targets current Spotify Desktop + current Spicetify. Spotify can change internal UI selectors over time, so small CSS maintenance may occasionally be required.

The theme favors semantic/data attributes and established Spicetify classes. JavaScript is limited to playback-aware mini-vinyl state and does not use a polling loop.

## Track Peek

Track Peek is intentionally **not included** in this release.

## Third-party component

JazzClub bundles the MIT-licensed Vinyl extension build from **spotify-spice** by Grason Chan. The original copyright and license notice are preserved in `THIRD_PARTY_NOTICES.md`.

## License

JazzClub: MIT. See `THIRD_PARTY_NOTICES.md` for bundled third-party code.
