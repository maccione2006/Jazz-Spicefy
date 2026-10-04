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
  const MIGRATION_KEY = "jazzclub:spotify-spice-vinyl:v2";
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
    let current = {};
    if (raw) {
      try {
        current = JSON.parse(raw) || {};
      } catch {}
    }

    const migrated = localStorage.getItem(MIGRATION_KEY) === "1";
    const next = { ...defaults, ...current };

    // Spotify Spice defaults colored vinyl to OFF. JazzClub's intended design
    // uses album-derived color, so enable it once for this migration. Users can
    // change it afterwards in Vinyl settings and their choice will persist.
    if (!migrated) {
      next.coloredEnabled = true;
      next.rotationEnabled = true;
      localStorage.setItem(MIGRATION_KEY, "1");
    }

    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
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
