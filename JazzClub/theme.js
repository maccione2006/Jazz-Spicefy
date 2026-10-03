/* JazzClub playback state: event-driven small + large vinyl, no continuous polling. */
(() => {
  "use strict";

  const PLAYER_ROOT = '[data-testid="now-playing-bar"], .Root__now-playing-bar';
  const LARGE_PANEL = '[data-testid="NPV_Panel_OpenDiv"]';
  const LARGE_OPEN_TRIGGERS = [
    '[data-testid="cover-art-button"]',
    '[data-testid="now-playing-widget"]',
    '[aria-label*="Now Playing" i]',
    '[aria-label*="Stai ascoltando" i]'
  ].join(",");

  const COVER_SELECTORS = [
    'img[src*="i.scdn.co"]',
    'img[src*="scdn.co"]',
    'img[alt*="cover" i]',
    'img[alt*="album" i]',
    'img'
  ];

  const SONG_RETRY_DELAYS = [0, 140, 420, 800];

  let bound = false;
  let songEpoch = 0;
  let songRetryTimer = 0;
  let panelRetryTimer = 0;

  const large = {
    host: null,
    vinyl: null,
    label: null,
    currentSrc: "",
    requestedSrc: "",
    loadToken: 0
  };

  function isPlaying() {
    return Boolean(window.Spicetify?.Player?.isPlaying?.());
  }

  function findSmallCover() {
    const root = document.querySelector(PLAYER_ROOT);
    if (!root) return null;

    for (const selector of COVER_SELECTORS) {
      const img = root.querySelector(selector);
      if (img && img.naturalWidth > 0) return img;
    }

    return root.querySelector("img");
  }

  function findSmallHost() {
    return findSmallCover()?.parentElement ?? null;
  }

  function ensureLargeNodes() {
    if (large.vinyl && large.label) return;

    large.vinyl = document.createElement("div");
    large.vinyl.className = "jazzclub-large-vinyl";

    large.label = document.createElement("img");
    large.label.className = "jazzclub-large-vinyl-label";
    large.label.alt = "";
    large.label.draggable = false;
    large.label.decoding = "async";

    large.vinyl.appendChild(large.label);
  }

  function normalizeCover(value) {
    if (typeof value !== "string" || !value) return "";

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    const prefix = "spotify:image:";
    if (value.startsWith(prefix)) {
      return "https://i.scdn.co/image/" + value.slice(prefix.length);
    }

    return "";
  }

  function getCoverCandidates() {
    const item = window.Spicetify?.Player?.data?.item;
    const metadata = item?.metadata ?? {};
    const small = findSmallCover();

    const candidates = [
      item?.album?.images?.[0]?.url,
      item?.images?.[0]?.url,
      metadata.image_xlarge_url,
      metadata.image_large_url,
      metadata.image_url,
      metadata.image_small_url,
      small?.currentSrc,
      small?.src
    ]
      .map(normalizeCover)
      .filter(Boolean);

    return [...new Set(candidates)];
  }

  function getBestCoverSource() {
    const candidates = getCoverCandidates();

    return (
      candidates.find(
        src =>
          src !== large.currentSrc &&
          src !== large.requestedSrc
      ) ||
      candidates[0] ||
      ""
    );
  }

  function findLargeHost() {
    const panel = document.querySelector(LARGE_PANEL);
    if (!panel) return null;

    const media = [...panel.querySelectorAll("video, img")]
      .map(el => ({
        el,
        rect: el.getBoundingClientRect()
      }))
      .filter(({ rect }) =>
        rect.width >= 150 &&
        rect.height >= 150
      )
      .sort((a, b) =>
        (b.rect.width * b.rect.height) -
        (a.rect.width * a.rect.height)
      );

    for (const { el } of media) {
      let best = null;

      for (
        let node = el.parentElement;
        node && node !== panel;
        node = node.parentElement
      ) {
        const rect = node.getBoundingClientRect();

        if (
          rect.width >= 150 &&
          rect.height >= 150 &&
          Math.abs(rect.width - rect.height) <= 8
        ) {
          best = node;
        }
      }

      if (best) return best;
    }

    return null;
  }

  function attachLargeHost(host) {
    if (!host) return false;

    ensureLargeNodes();

    if (large.host !== host) {
      large.host?.classList.remove(
        "jazzclub-large-vinyl-anchor",
        "jazzclub-large-vinyl-host"
      );

      large.host = host;
      host.classList.add("jazzclub-large-vinyl-anchor");
      host.appendChild(large.vinyl);
    } else {
      host.classList.add("jazzclub-large-vinyl-anchor");

      if (large.vinyl.parentElement !== host) {
        host.appendChild(large.vinyl);
      }
    }

    if (large.currentSrc) {
      host.classList.add("jazzclub-large-vinyl-host");
    }

    return true;
  }

  function syncPlayback() {
    const playing = isPlaying();

    const smallHost = findSmallHost();
    if (smallHost) {
      smallHost.classList.add("jazzclub-vinyl-host");
      smallHost.classList.toggle("is-playing", playing);
    }

    if (large.vinyl) {
      large.vinyl.classList.toggle("is-playing", playing);
    }
  }

  function commitCover(src, token, epoch) {
    if (
      token !== large.loadToken ||
      epoch !== songEpoch
    ) {
      return;
    }

    ensureLargeNodes();

    large.label.src = src;
    large.currentSrc = src;
    large.requestedSrc = "";

    const host = findLargeHost();
    if (host) {
      attachLargeHost(host);
      host.classList.add("jazzclub-large-vinyl-host");
    }

    syncPlayback();
  }

  function requestCover(src, epoch) {
    if (
      !src ||
      src === large.currentSrc ||
      src === large.requestedSrc
    ) {
      return;
    }

    large.requestedSrc = src;

    const token = ++large.loadToken;
    const preload = new Image();

    preload.decoding = "async";

    preload.onload = () => {
      commitCover(src, token, epoch);
    };

    preload.onerror = () => {
      if (
        token === large.loadToken &&
        epoch === songEpoch
      ) {
        large.requestedSrc = "";
      }
    };

    preload.src = src;
  }

  function refreshLarge(epoch = songEpoch) {
    const host = findLargeHost();
    if (host) {
      attachLargeHost(host);
    }

    const src = getBestCoverSource();
    if (src) {
      requestCover(src, epoch);
    }

    syncPlayback();

    return Boolean(host);
  }

  function clearSongRetry() {
    if (songRetryTimer) {
      clearTimeout(songRetryTimer);
      songRetryTimer = 0;
    }
  }

  function scheduleSongRefresh() {
    clearSongRetry();

    const epoch = ++songEpoch;
    const previousSrc = large.currentSrc;
    large.requestedSrc = "";

    let index = 0;

    const attempt = () => {
      if (epoch !== songEpoch) return;

      refreshLarge(epoch);

      if (
        large.currentSrc &&
        large.currentSrc !== previousSrc
      ) {
        return;
      }

      index += 1;
      if (index >= SONG_RETRY_DELAYS.length) return;

      const wait =
        SONG_RETRY_DELAYS[index] -
        SONG_RETRY_DELAYS[index - 1];

      songRetryTimer = window.setTimeout(
        attempt,
        wait
      );
    };

    attempt();
  }

  function syncSoon() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        syncPlayback();
        refreshLarge(songEpoch);
      });
    });
  }

  function onUiClick(event) {
    const target =
      event.target instanceof Element
        ? event.target
        : null;

    if (!target?.closest(LARGE_OPEN_TRIGGERS)) {
      return;
    }

    if (panelRetryTimer) {
      clearTimeout(panelRetryTimer);
    }

    panelRetryTimer = window.setTimeout(() => {
      if (!refreshLarge(songEpoch)) {
        panelRetryTimer = window.setTimeout(
          () => refreshLarge(songEpoch),
          180
        );
      }
    }, 80);
  }

  function bindPlayer() {
    const player = window.Spicetify?.Player;

    if (!player?.addEventListener || bound) {
      return Boolean(player?.addEventListener);
    }

    bound = true;

    player.addEventListener("onplaypause", syncSoon);
    player.addEventListener("songchange", scheduleSongRefresh);
    player.addEventListener("appready", syncSoon);

    document.addEventListener(
      "click",
      onUiClick,
      true
    );

    syncSoon();
    return true;
  }

  function start() {
    if (bindPlayer()) return;

    let attempts = 0;

    const retry = () => {
      if (bindPlayer() || ++attempts >= 40) {
        return;
      }

      setTimeout(retry, 100);
    };

    retry();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      start,
      { once: true }
    );
  } else {
    start();
  }
})();
