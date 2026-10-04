/* JazzClub Marketplace helper
 * Event-driven only: playback state + album-derived vinyl color.
 * No DOM polling, no MutationObserver, no Track Peek.
 */
(() => {
  "use strict";

  const GLOBAL_KEY = "__jazzclubMarketplaceVinyl";
  const root = document.documentElement;
  let colorRequestId = 0;
  let started = false;

  const previous = window[GLOBAL_KEY];
  if (previous && typeof previous.destroy === "function") {
    try {
      previous.destroy();
    } catch {}
  }

  const getPlayer = () => window.Spicetify?.Player;
  const getTrackUri = () => getPlayer()?.data?.item?.uri || null;

  function setPlayingState() {
    const player = getPlayer();
    if (!player) return;

    let isPlaying = false;
    try {
      isPlaying =
        typeof player.isPlaying === "function"
          ? Boolean(player.isPlaying())
          : !Boolean(player.data?.isPaused);
    } catch {
      isPlaying = !Boolean(player.data?.isPaused);
    }

    root.dataset.jazzclubPlaying = isPlaying ? "true" : "false";
  }

  function clearVinylColor() {
    root.style.removeProperty("--jazzclub-vinyl-color");
    root.style.removeProperty("--jazzclub-vinyl-color-dark");
    root.style.removeProperty("--jazzclub-vinyl-color-light");
    delete root.dataset.jazzclubVinylColored;
  }

  async function setAlbumVinylColor() {
    const uri = getTrackUri();
    const requestId = ++colorRequestId;

    if (!uri || !uri.startsWith("spotify:track:")) {
      clearVinylColor();
      return;
    }

    try {
      const graphQL = window.Spicetify?.GraphQL;
      const definition = graphQL?.Definitions?.fetchExtractedColorForTrackEntity;
      if (!graphQL?.Request || !definition) {
        clearVinylColor();
        return;
      }

      const { data } = await graphQL.Request(definition, { uri });
      if (requestId !== colorRequestId || getTrackUri() !== uri) return;

      const colors =
        data?.trackUnion?.albumOfTrack?.coverArt?.extractedColors || {};

      const raw =
        colors.colorRaw?.hex ||
        colors.colorDark?.hex ||
        colors.colorLight?.hex;

      if (!raw) {
        clearVinylColor();
        return;
      }

      const dark = colors.colorDark?.hex || raw;
      const light = colors.colorLight?.hex || raw;

      root.style.setProperty("--jazzclub-vinyl-color", raw);
      root.style.setProperty("--jazzclub-vinyl-color-dark", dark);
      root.style.setProperty("--jazzclub-vinyl-color-light", light);
      root.dataset.jazzclubVinylColored = "true";
    } catch (error) {
      console.warn("[JazzClub] Could not read album color for vinyl.", error);
      clearVinylColor();
    }
  }

  function syncSong() {
    setPlayingState();
    setAlbumVinylColor();
  }

  function destroy() {
    const player = getPlayer();
    if (player?.removeEventListener && started) {
      player.removeEventListener("songchange", syncSong);
      player.removeEventListener("onplaypause", setPlayingState);
    }
    colorRequestId += 1;
    delete root.dataset.jazzclubPlaying;
    clearVinylColor();
    started = false;
  }

  function init(attempt = 0) {
    const player = getPlayer();
    const graphQL = window.Spicetify?.GraphQL;

    if (
      !player?.addEventListener ||
      !graphQL?.Request ||
      !graphQL?.Definitions?.fetchExtractedColorForTrackEntity
    ) {
      if (attempt < 40) {
        setTimeout(() => init(attempt + 1), 250);
      }
      return;
    }

    if (started) return;
    started = true;

    player.addEventListener("songchange", syncSong);
    player.addEventListener("onplaypause", setPlayingState);

    setPlayingState();
    setAlbumVinylColor();
  }

  window[GLOBAL_KEY] = { destroy };
  init();
})();
