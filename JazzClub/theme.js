/* JazzClub playback state: event-driven artwork binding. */
(() => {
  "use strict";

  const PLAYER_ROOT = '[data-testid="now-playing-bar"], .Root__now-playing-bar';
  const SMALL_COVER_SELECTOR = [
    '[data-testid="cover-art-button"] img',
    'img[src*="i.scdn.co"]',
    'img[src*="scdn.co"]'
  ].join(",");
  const LARGE_PANEL_SELECTOR = '[data-testid="NPV_Panel_OpenDiv"]';
  const LARGE_COVER_SELECTOR =
    '[data-testid="NPV_Panel_OpenDiv"] [data-testid="track-visual-enhancement"] img';

  let bound = false;
  let domObserver = null;

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
    return document.querySelector(LARGE_COVER_SELECTOR);
  }

  function syncArtwork() {
    const playing = isPlaying();
    setPlaying(findSmallCover(), playing);
    setPlaying(findLargeCover(), playing);
  }

  function syncSoon() {
    requestAnimationFrame(() => requestAnimationFrame(syncArtwork));
  }

  function watchLargePanel() {
    if (domObserver || !document.body) return;

    domObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== "childList") continue;

        for (const node of mutation.addedNodes) {
          if (node.nodeType !== Node.ELEMENT_NODE) continue;

          if (
            node.matches?.(LARGE_PANEL_SELECTOR) ||
            node.querySelector?.(LARGE_PANEL_SELECTOR) ||
            node.matches?.(LARGE_COVER_SELECTOR) ||
            node.querySelector?.(LARGE_COVER_SELECTOR)
          ) {
            syncSoon();
            return;
          }
        }
      }
    });

    domObserver.observe(document.body, {
      childList: true,
      subtree: true
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

    watchLargePanel();
    syncSoon();
    return true;
  }

  // Spicetify can inject theme.js before its Player API exists.
  // Retry only during startup; playback itself remains event-driven.
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
