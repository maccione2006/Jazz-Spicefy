/* JazzClub playback state: robust event-driven artwork binding, no polling. */
(() => {
  "use strict";

  const PLAYER_ROOT = '[data-testid="now-playing-bar"], .Root__now-playing-bar';
  const COVER_SELECTORS = [
    'img[src*="i.scdn.co"]',
    'img[src*="scdn.co"]',
    'img[alt*="cover" i]',
    'img[alt*="album" i]',
    'img'
  ];

  function findCover() {
    const root = document.querySelector(PLAYER_ROOT);
    if (!root) return null;

    for (const selector of COVER_SELECTORS) {
      const img = root.querySelector(selector);
      if (img && img.naturalWidth > 0) return img;
    }
    return root.querySelector("img");
  }

  function syncVinyl() {
    const cover = findCover();
    if (!cover) return;

    const host = cover.parentElement;
    if (!host) return;

    host.classList.add("jazzclub-vinyl-host");
    host.classList.toggle(
      "is-playing",
      Boolean(window.Spicetify?.Player?.isPlaying())
    );
  }

  function syncSoon() {
    requestAnimationFrame(() => requestAnimationFrame(syncVinyl));
  }

  function init() {
    if (!window.Spicetify?.Player) return;

    Spicetify.Player.addEventListener("onplaypause", syncVinyl);
    Spicetify.Player.addEventListener("songchange", syncSoon);

    if (Spicetify.Player.addEventListener) {
      Spicetify.Player.addEventListener("appready", syncSoon);
    }

    syncSoon();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
