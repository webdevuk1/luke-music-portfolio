import { useEffect, useMemo, useState } from "react";
import {
  attachArtistNames,
  artistSiteFromArtist,
  getArtistBySlug,
  normalizePlatform,
  tracksForArtist,
} from "../lib/platform";

export function usePlatform(artistSlugFilter) {
  const [platform, setPlatform] = useState(() =>
    normalizePlatform(null)
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/platform.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setPlatform(normalizePlatform(data)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const artist = artistSlugFilter
    ? getArtistBySlug(platform, artistSlugFilter)
    : getArtistBySlug(platform, platform.featuredArtistSlug);

  const allTracks = useMemo(
    () => attachArtistNames(platform.tracks, platform.artists),
    [platform]
  );

  const tracks = useMemo(() => {
    if (!artistSlugFilter || !artist) return allTracks;
    return attachArtistNames(tracksForArtist(platform, artist.id), platform.artists);
  }, [allTracks, artist, artistSlugFilter, platform]);

  const site = useMemo(() => artistSiteFromArtist(artist), [artist]);

  return {
    loading,
    platform,
    artist,
    site,
    tracks,
    allTracks,
    artists: platform.artists,
  };
}
