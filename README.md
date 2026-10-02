# JazzClub

JazzClub is a custom Spicetify theme that turns Spotify Desktop into a late-night jazz club and premium vintage hi-fi listening room.

> Spotify after midnight, inside a premium jazz listening room.

## Design

- deep black and dark walnut surfaces
- warm amber and restrained brass accents
- cream typography
- physical-vinyl-inspired artwork
- hi-fi-inspired bottom player
- subtle tactile controls
- performance-conscious animation

Black, walnut and cream remain dominant; amber and gold are reserved for interaction, lighting and hardware details.

## Features

- Complete dark walnut / black visual system
- Warm amber and brass accent palette
- Restyled navigation, cards, track lists, menus and controls
- Hi-fi-inspired bottom player
- Current-track artwork treated as a vinyl record
- Event-driven vinyl rotation while playback is active
- Vinyl stops when playback is paused
- prefers-reduced-motion support
- No external dependencies
- Minimal JavaScript with no polling loop

## Installation

Copy the JazzClub folder into:

%appdata%\\spicetify\\Themes\\

Then run:

spicetify config current_theme JazzClub color_scheme JazzClub
spicetify apply

For development, spicetify update can hot-reload theme changes.

## Structure

- color.ini — palette and custom CSS variables
- user.css — visual design
- theme.js — playback-aware vinyl state
- README.md — documentation
- LICENSE — MIT license

## Compatibility

Spotify and Spicetify can change their internal UI structure. JazzClub favors semantic/data attributes and keeps JavaScript limited to the now-playing area.

If Spotify changes the now-playing artwork structure, the cover selector in theme.js is the main place that should need adjustment.

## License

MIT.
