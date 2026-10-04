/** Helpers for platform.json — approved catalog, search, and artist pages. */

export function normalizePlatform(raw) {
  if (!raw) return { artists: [], tracks: [], featuredArtistSlug: "luke" };
  const artists = (raw.artists ?? []).filter((a) => a.status === "approved");
  const approvedIds = new Set(artists.map((a) => a.id));
  const tracks = (raw.tracks ?? []).filter(
    (t) => t.status === "approved" && approvedIds.has(t.artistId)
  );
  return {
    featuredArtistSlug: raw.featuredArtistSlug ?? artists[0]?.slug ?? "luke",
    artists,
    tracks: tracks.map(enrichTrack),
  };
}

function enrichTrack(track) {
  return {
    ...track,
    downloadUrl: track.downloadUrl ?? track.audioUrl,
    downloadable: track.downloadable !== false && track.status === "approved",
  };
}

export function getArtistBySlug(platform, slug) {
  return platform.artists.find((a) => a.slug === slug) ?? null;
}

export function tracksForArtist(platform, artistId) {
  return platform.tracks.filter((t) => t.artistId === artistId);
}

export function attachArtistNames(tracks, artists) {
  const byId = new Map(artists.map((a) => [a.id, a]));
  return tracks.map((t) => ({
    ...t,
    artistName: byId.get(t.artistId)?.name,
    artistSlug: byId.get(t.artistId)?.slug,
  }));
}

export function searchPlatform(platform, query) {
  const q = query.trim().toLowerCase();
  if (!q) return { artists: [], tracks: [] };
  const artists = platform.artists.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.slug.toLowerCase().includes(q) ||
      (a.storeName ?? "").toLowerCase().includes(q)
  );
  const tracks = platform.tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.subtitle.toLowerCase().includes(q) ||
      t.genre.toLowerCase().includes(q) ||
      t.mood.toLowerCase().includes(q)
  );
  return { artists, tracks: attachArtistNames(tracks, platform.artists) };
}

export function artistSiteFromArtist(artist) {
  if (!artist) return null;
  return {
    artistName: artist.name,
    storeName: artist.storeName,
    tagline: artist.tagline,
    aboutLuke: artist.bio,
    portraitUrl: artist.portraitUrl,
    heroLoopTrackId: artist.heroLoopTrackId,
  };
}

const PENDING_KEY = "luke_portfolio_pending_submissions";

export function loadPendingSubmissions() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(PENDING_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function savePendingSubmission(entry) {
  const list = loadPendingSubmissions();
  list.unshift(entry);
  localStorage.setItem(PENDING_KEY, JSON.stringify(list.slice(0, 20)));
}
