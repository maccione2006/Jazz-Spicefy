/* JazzClub playback state: event-driven artwork binding. */
(() => {
  "use strict";

  const PLAYER_ROOT = '[data-testid="now-playing-bar"], .Root__now-playing-bar';
  const SMALL_COVER_SELECTOR = [
    '[data-testid="cover-art-button"] img',
    'img[src*="i.scdn.co"]',
    'img[src*="scdn.co"]'
  ].join(",");
  const LARGE_COVER_SELECTOR =
    '[data-testid="NPV_Panel_OpenDiv"] [data-testid="track-visual-enhancement"] img';

  let bound = false;

  function isPlaying() {
    return Boolean(window.Spicetify?.Player?.isPlaying?.());
  }

  function setPlaying(img, playing) {
    if (!img) return;
    img.classList.toggle("jazzclub-vinyl-art", true);
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

  function bindPlayer() {
    const player = window.Spicetify?.Player;
    if (!player?.addEventListener || bound) return Boolean(player?.addEventListener);

    bound = true;
    player.addEventListener("onplaypause", syncArtwork);
    player.addEventListener("songchange", syncSoon);
    player.addEventListener("appready", syncSoon);
    syncSoon();
    return true;
  }

  // Spicetify can inject theme.js before its Player API exists.
  // Retry only during startup; playback itself remains fully event-driven.
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
