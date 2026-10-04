import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import DemoLibrarySidebar from "../components/DemoLibrarySidebar";
import HomeHero from "../components/HomeHero";
import MainPanel from "../components/MainPanel";
import { DEMO_TRACKS } from "../data/tracks";

const DEFAULT_SITE = {
  artistName: "Luke",
  storeName: "lowkey beats",
  tagline: "Music portfolio",
  aboutLuke:
    "Producer and songwriter sharing sketches, demos, and works-in-progress — built for collaborators, artists, and A&R who want to hear the ideas behind the records.",
  portraitUrl: "/luke-portrait.svg",
  heroLoopTrackId: "care",
};

export default function Home() {
  const [site, setSite] = useState(DEFAULT_SITE);
  const [tracks, setTracks] = useState(DEMO_TRACKS);
  const [selectedId, setSelectedId] = useState(null);
  const [favorites, setFavorites] = useState(() => new Set());
  const [recentIds, setRecentIds] = useState([]);

  useEffect(() => {
    fetch("/catalog.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.tracks?.length) return;
        setSite({
          artistName: data.artistName ?? DEFAULT_SITE.artistName,
          storeName: data.storeName ?? DEFAULT_SITE.storeName,
          tagline: data.tagline ?? DEFAULT_SITE.tagline,
          aboutLuke: data.aboutLuke ?? data.intro ?? DEFAULT_SITE.aboutLuke,
          portraitUrl: data.portraitUrl ?? DEFAULT_SITE.portraitUrl,
          heroLoopTrackId: data.heroLoopTrackId ?? DEFAULT_SITE.heroLoopTrackId,
        });
        setTracks(data.tracks);
      })
      .catch(() => {});
  }, []);

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = new URLSearchParams(window.location.search).get("track");
    if (id && tracks.some((t) => t.id === id)) setSelectedId(id);
  }, [tracks]);

  const heroTrack = useMemo(() => {
    const id = site.heroLoopTrackId;
    return tracks.find((t) => t.id === id) ?? tracks[0] ?? null;
  }, [tracks, site.heroLoopTrackId]);

  const selectedTrack = useMemo(
    () => tracks.find((t) => t.id === selectedId) ?? null,
    [tracks, selectedId]
  );

  const syncUrl = useCallback((trackId) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (trackId) url.searchParams.set("track", trackId);
    else url.searchParams.delete("track");
    window.history.replaceState({}, "", url.pathname + url.search);
  }, []);

  const goHome = useCallback(() => {
    setSelectedId(null);
    syncUrl(null);
  }, [syncUrl]);

  const focusLibrary = useCallback(() => {
    document.getElementById("demo-library")?.scrollIntoView({ behavior: "smooth" });
    document.getElementById("demo-library-search")?.focus();
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

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <>
      <Head>
        <title>{site.artistName} — {site.tagline}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content={`${site.artistName} — demo library and listening room`}
        />
      </Head>

      <div className="min-h-screen">
        <DemoLibrarySidebar
          tracks={tracks}
          selectedId={selectedId}
          onSelect={handleSelect}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          recentIds={recentIds}
          onGoHome={goHome}
          storeName={site.storeName}
        />

        <main className="ml-80 lg:ml-96 min-h-screen py-6 sm:py-10">
          {selectedTrack ? (
            <MainPanel
              site={site}
              track={selectedTrack}
              onClearSelection={clearSelection}
            />
          ) : (
            <HomeHero site={site} heroTrack={heroTrack} onOpenLibrary={focusLibrary} />
          )}
        </main>
      </div>
    </>
  );
}
