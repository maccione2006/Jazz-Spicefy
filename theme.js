/* JazzClub playback state: event-driven, no polling. */
(() => {
  "use strict";

  const PLAYER_ROOT = '[data-testid="now-playing-bar"], .Root__now-playing-bar';
  const COVER_SELECTOR = 'img[src^="https://i.scdn.co/"]';

  function findCover() {
    const root = document.querySelector(PLAYER_ROOT);
    return root ? root.querySelector(COVER_SELECTOR) : null;
  }

  function syncVinyl() {
    const cover = findCover();
    if (!cover || !cover.parentElement) return;

    const host = cover.parentElement;
    host.classList.add("jazzclub-vinyl-host");
    host.classList.toggle(
      "is-playing",
      Boolean(Spicetify.Player && Spicetify.Player.isPlaying())
    );
  }

  function syncSoon() {
    requestAnimationFrame(() => requestAnimationFrame(syncVinyl));
  }

  function init() {
    if (!window.Spicetify || !Spicetify.Player) return;
    Spicetify.Player.addEventListener("onplaypause", syncVinyl);
    Spicetify.Player.addEventListener("songchange", syncSoon);
    syncSoon();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
