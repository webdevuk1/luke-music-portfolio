import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import PortfolioShell from "../components/PortfolioShell";
import { usePlatform } from "../hooks/usePlatform";

function useFavorites() {
  const [favorites, setFavorites] = useState(() => new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem("luke_portfolio_favorites");
      if (raw) setFavorites(new Set(JSON.parse(raw)));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "luke_portfolio_favorites",
        JSON.stringify([...favorites])
      );
    } catch {
      /* ignore */
    }
  }, [favorites]);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return { favorites, toggleFavorite };
}

function useTrackSelection(tracks) {
  const [selectedId, setSelectedId] = useState(null);
  const [recentIds, setRecentIds] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = new URLSearchParams(window.location.search).get("track");
    if (id && tracks.some((t) => t.id === id)) setSelectedId(id);
  }, [tracks]);

  const syncUrl = useCallback((trackId) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (trackId) url.searchParams.set("track", trackId);
    else url.searchParams.delete("track");
    window.history.replaceState({}, "", url.pathname + url.search);
  }, []);

  const handleSelect = useCallback(
    (track) => {
      setSelectedId(track.id);
      setRecentIds((prev) =>
        [track.id, ...prev.filter((id) => id !== track.id)].slice(0, 8)
      );
      syncUrl(track.id);
    },
    [syncUrl]
  );

  const clearSelection = useCallback(() => {
    setSelectedId(null);
    syncUrl(null);
  }, [syncUrl]);

  const goHome = useCallback(() => {
    setSelectedId(null);
    syncUrl(null);
  }, [syncUrl]);

  return {
    selectedId,
    recentIds,
    handleSelect,
    clearSelection,
    goHome,
  };
}

export default function ListeningRoom({
  artistSlug = null,
  pageTitle,
  sidebarTitle,
}) {
  const { platform, site, tracks, artist, loading } = usePlatform(artistSlug);
  const { favorites, toggleFavorite } = useFavorites();
  const {
    selectedId,
    recentIds,
    handleSelect,
    clearSelection,
    goHome,
  } = useTrackSelection(tracks);

  const focusLibrary = useCallback(() => {
    document.getElementById("demo-library")?.scrollIntoView({ behavior: "smooth" });
    document.getElementById("demo-library-search")?.focus();
  }, []);

  const siteWithSlug = site
    ? { ...site, artistSlug: artist?.slug ?? platform.featuredArtistSlug }
    : site;

  if (loading) {
    return (
      <div className="min-h-screen pt-14 flex items-center justify-center text-ink-muted text-sm">
        Loading catalog…
      </div>
    );
  }

  if (artistSlug && !artist) {
    return (
      <div className="min-h-screen pt-14 flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-white font-medium">Creator not found.</p>
        <Link href="/artists" className="text-primary-400 text-sm hover:underline">
          Browse creators
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          {pageTitle ??
            `${site?.artistName ?? "Luke"} — ${site?.tagline ?? "Music portfolio"}`}
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <PortfolioShell
        platform={platform}
        site={siteWithSlug}
        tracks={tracks}
        artist={artistSlug ? artist : null}
        selectedId={selectedId}
        onSelect={handleSelect}
        onClearSelection={clearSelection}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        recentIds={recentIds}
        onGoHome={goHome}
        onOpenLibrary={focusLibrary}
        sidebarTitle={sidebarTitle}
      />
    </>
  );
}
