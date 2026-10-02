/* JazzClub playback state: event-driven artwork binding. */
(() => {
  "use strict";

  const PLAYER_ROOT = '[data-testid="now-playing-bar"], .Root__now-playing-bar';
  const SMALL_COVER_SELECTOR = [
    '[data-testid="cover-art-button"] img',
    'img[src*="i.scdn.co"]',
    'img[src*="scdn.co"]'
  ].join(",");

  // Spotify has changed the parent structure around the large Now Playing
  // artwork. Prefer the known stable child and use the panel as a fallback.
  const LARGE_COVER_SELECTORS = [
    '[data-testid="NPV_Panel_OpenDiv"] [data-testid="track-visual-enhancement"] img',
    '[data-testid="track-visual-enhancement"] img'
  ];

  let bound = false;
  let domObserver = null;
  let scheduled = false;

  function isPlaying() {
    return Boolean(window.Spicetify?.Player?.isPlaying?.());
  }

  function setPlaying(img, playing) {
    if (!img) return;
    img.classList.add("jazzclub-vinyl-art");
    img.classList.toggle("is-playing", playing);
  }

  function findSmallCover() {
    const root = document.querySelector(PLAYER_ROOT);
    return root?.querySelector(SMALL_COVER_SELECTOR) ?? null;
  }

  function findLargeCover() {
    for (const selector of LARGE_COVER_SELECTORS) {
      const img = document.querySelector(selector);
      if (img) return img;
    }
    return null;
  }

  function syncArtwork() {
    scheduled = false;
    const playing = isPlaying();
    setPlaying(findSmallCover(), playing);
    setPlaying(findLargeCover(), playing);
  }

  function syncSoon() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(syncArtwork);
    });
  }

  function watchDom() {
    if (domObserver || !document.body) return;

    domObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList" || mutation.type === "attributes") {
          syncSoon();
          return;
        }
      }
    });

    domObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src", "class", "style"]
    });

    syncSoon();
  }

  function bindPlayer() {
    const player = window.Spicetify?.Player;
    if (!player?.addEventListener || bound) return Boolean(player?.addEventListener);

    bound = true;
    player.addEventListener("onplaypause", syncArtwork);
    player.addEventListener("songchange", syncSoon);
    player.addEventListener("appready", syncSoon);

    watchDom();
    syncSoon();
    return true;
  }

  // Spicetify can inject theme.js before its Player API exists.
  // Startup retries are bounded; after binding, artwork stays event/DOM-driven.
  function start() {
    if (bindPlayer()) return;

    let attempts = 0;
    const retry = () => {
      if (bindPlayer() || ++attempts >= 50) return;
      setTimeout(retry, 100);
    };
    retry();
  }

  start();
})();
