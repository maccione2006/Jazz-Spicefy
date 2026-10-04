/* JazzClub Marketplace loader for Spotify Spice Vinyl
 * Upstream Vinyl: https://github.com/grasonchan/spotify-spice
 * The official deploy build is loaded unchanged. JazzClub only sets sensible
 * defaults before loading it, then CSS adapts its variables to current Spotify
 * markup for both the mini player and Now Playing View.
 */
(() => {
  "use strict";

  const GLOBAL_KEY = "__jazzclubSpotifySpiceVinylLoader";
  const SETTINGS_KEY = "vinyl:settings";
  const SCRIPT_ID = "jazzclub-spotify-spice-vinyl";
  const UPSTREAM =
    "https://cdn.jsdelivr.net/gh/grasonchan/spotify-spice@deploy/extensions/vinyl.js";

  if (window[GLOBAL_KEY]) return;
  window[GLOBAL_KEY] = true;

  try {
    const defaults = {
      rotationEnabled: true,
      rpm: 5,
      coloredEnabled: true
    };

    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaults));
    } else {
      let current = {};
      try {
        current = JSON.parse(raw) || {};
      } catch {}

      // Preserve explicit user choices. Only fill settings that do not exist.
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify({ ...defaults, ...current })
      );
    }
  } catch (error) {
    console.warn("[JazzClub] Could not initialize Spotify Spice Vinyl settings.", error);
  }

  if (document.getElementById(SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.src = `${UPSTREAM}?jazzclub=${Date.now()}`;
  script.defer = true;
  script.dataset.source = "spotify-spice-vinyl";
  document.body.appendChild(script);
})();
