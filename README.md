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

JazzClub Marketplace loads the **complete official Spotify Spice Vinyl deploy
build** from Grason Chan.

The large Now Playing vinyl is no longer redrawn by JazzClub CSS. Current
Spotify places the NPV outside `#main`, while Spotify Spice's current
stylesheet still scopes the large record to
`#main [data-testid='track-visual-enhancement']`.

JazzClub's compatibility bridge now finds the stylesheet that Spotify Spice
itself injects at runtime, clones that exact stylesheet, and changes **only**
that obsolete scope so the same original Vinyl rules also apply inside the
current right-sidebar NPV. It also restores the historical `.cover-art` and
`.cover-art-image` class names that Spotify Spice expects.

Therefore the large record's grooves, shine, 1.5× disc geometry, shadows,
rotation, RPM, playback state and album-derived color are all Spotify Spice's
own code.

The mini-player record uses the same Spotify Spice public Vinyl variables and
state because upstream Spotify Spice does not include a mini-player selector.

The standalone installers additionally enable Full App Display and Lyrics Plus.

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
