/* JazzClub large artwork playback state: event-driven, no polling. */
(() => {
  "use strict";

  const ARTWORK_SELECTOR = 'img[src*="i.scdn.co"], img[src*="scdn.co"]';

  function findLargeArtwork() {
    const candidates = [...document.querySelectorAll(ARTWORK_SELECTOR)]
      .map((img) => ({
        img,
        rect: img.getBoundingClientRect()
      }))
      .filter(({ img, rect }) =>
        img.naturalWidth > 0 &&
        rect.width >= 300 &&
        rect.height >= 300 &&
        Math.abs(rect.width - rect.height) <= 4
      )
      .sort((a, b) => (b.rect.width * b.rect.height) - (a.rect.width * a.rect.height));

    return candidates[0]?.img ?? null;
  }

  function syncVinyl() {
    const cover = findLargeArtwork();
    if (!cover) return;

    const host = cover.parentElement;
    if (!host) return;

    document.querySelectorAll(".jazzclub-vinyl-host").forEach((node) => {
      if (node !== host) node.classList.remove("jazzclub-vinyl-host", "is-playing");
    });

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
    if (!window.Spicetify?.Player?.addEventListener) return;

    Spicetify.Player.addEventListener("onplaypause", syncVinyl);
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
