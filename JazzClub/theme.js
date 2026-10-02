/* JazzClub playback state: event-driven vinyl binding. */
(() => {
  "use strict";

  const PLAYER_ROOT = '[data-testid="now-playing-bar"], .Root__now-playing-bar';
  const SMALL_COVER_SELECTOR = [
    '[data-testid="cover-art-button"] img',
    'img[src*="i.scdn.co"]',
    'img[src*="scdn.co"]'
  ].join(",");

  const LARGE_HOST_SELECTOR =
    '[data-testid="NPV_Panel_OpenDiv"] .mxKzJhwzHi085Rmo_Nuj';

  let bound = false;
  let scheduled = false;

  function isPlaying() {
    return Boolean(window.Spicetify?.Player?.isPlaying?.());
  }

  function setPlaying(element, playing) {
    if (!element) return;
    element.classList.toggle("is-playing", playing);
  }

  function findSmallCover() {
    const root = document.querySelector(PLAYER_ROOT);
    return root?.querySelector(SMALL_COVER_SELECTOR) ?? null;
  }

  function findSmallHost() {
    return findSmallCover()?.closest(".jazzclub-vinyl-host") ?? null;
  }

  function findLargeHost() {
    return document.querySelector(LARGE_HOST_SELECTOR);
  }

  function syncArtwork() {
    scheduled = false;
    const playing = isPlaying();

    setPlaying(findSmallHost(), playing);

    const largeHost = findLargeHost();
    if (largeHost) {
      largeHost.classList.add("jazzclub-large-vinyl-host");
      setPlaying(largeHost, playing);
    }
  }

  function syncSoon() {
    if (scheduled) return;
    scheduled = true;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        syncArtwork();
      });
    });
  }

  function syncAfterSongChange() {
    syncSoon();
    setTimeout(syncSoon, 120);
  }

  function bindPlayer() {
    const player = window.Spicetify?.Player;
    if (!player?.addEventListener || bound) return Boolean(player?.addEventListener);

    bound = true;

    player.addEventListener("onplaypause", syncArtwork);
    player.addEventListener("songchange", syncAfterSongChange);
    player.addEventListener("appready", syncSoon);

    syncSoon();
    return true;
  }

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