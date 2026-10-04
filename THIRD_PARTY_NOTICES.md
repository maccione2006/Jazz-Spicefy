# Third-party notices

## spotify-spice — Vinyl extension

JazzClub bundles `Extensions/vinyl.js` from the `deploy` branch of spotify-spice.

- Author: Grason Chan
- Repository: https://github.com/grasonchan/spotify-spice
- Component used: Vinyl extension only
- Track Peek: not included

The bundled component is distributed under the following MIT License:

MIT License

Copyright (c) 2021 Grason Chan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


## Current Marketplace integration

The Marketplace build loads the official Spotify Spice Vinyl extension from
`deploy/extensions/vinyl.js`. JazzClub's compatibility CSS reuses the
extension's public CSS variables and visual recipe for current Spotify DOM,
including `--vinyl-shine`, `--vinyl-groove`, `--vinyl-base`,
`--vinyl-duration`, `--vinyl-play-state`, and the colored-vinyl state.

The large Now Playing View adapter changes selectors only; the vinyl visual
formula, playback state, RPM/settings behavior, and album-color engine remain
from Spotify Spice.

## Full Vinyl feature set

JazzClub's Marketplace and standalone packages now use the complete official
Spotify Spice Vinyl deploy build. No Vinyl features are reimplemented or
removed. JazzClub adds only:

1. first-run defaults enabling rotation and colored vinyl;
2. CSS selector compatibility for current Spotify's Now Playing View markup.

Spotify Spice remains the source of the Vinyl settings UI, playback state,
RPM behavior, album-color extraction/cache, gradients, grooves and Full App
Display Vinyl behavior.
