/* JazzClub playback state: event-driven artwork binding, no polling. */
(() => {
  "use strict";

  const PLAYER_ROOT = '[data-testid="now-playing-bar"], .Root__now-playing-bar';
  const SMALL_COVER_SELECTORS = [
    'img[src*="i.scdn.co"]',
    'img[src*="scdn.co"]',
    'img[alt*="cover" i]',
    'img[alt*="album" i]',
    'img'
  ];
  const LARGE_COVER_SELECTOR =
    '[data-testid="NPV_Panel_OpenDiv"] [data-testid="track-visual-enhancement"] img';

  function findSmallCover() {
    const root = document.querySelector(PLAYER_ROOT);
    if (!root) return null;

    for (const selector of SMALL_COVER_SELECTORS) {
      const img = root.querySelector(selector);
      if (img && img.naturalWidth > 0) return img;
    }

    return root.querySelector("img");
  }

  function syncSmallVinyl() {
    const cover = findSmallCover();
    if (!cover) return;

    const host = cover.parentElement;
    if (!host) return;

    host.classList.add("jazzclub-vinyl-host");
    host.classList.toggle(
      "is-playing",
      Boolean(window.Spicetify?.Player?.isPlaying())
    );
  }

  function syncLargeVinyl() {
    const cover = document.querySelector(LARGE_COVER_SELECTOR);
    if (!cover) return;

    const host = cover.parentElement;
    if (!host) return;

    document.querySelectorAll(".jazzclub-large-vinyl-host").forEach((node) => {
      if (node !== host) {
        node.classList.remove("jazzclub-large-vinyl-host", "is-playing");
      }
    });

    host.classList.add("jazzclub-large-vinyl-host");
    host.classList.toggle(
      "is-playing",
      Boolean(window.Spicetify?.Player?.isPlaying())
    );
  }

  function syncAll() {
    syncSmallVinyl();
    syncLargeVinyl();
  }

  function syncSoon() {
    requestAnimationFrame(() => requestAnimationFrame(syncAll));
  }

  function init() {
    if (!window.Spicetify?.Player?.addEventListener) return;

    Spicetify.Player.addEventListener("onplaypause", syncAll);
    Spicetify.Player.addEventListener("songchange", syncSoon);
    Spicetify.Player.addEventListener("appready", syncSoon);

    syncSoon();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
