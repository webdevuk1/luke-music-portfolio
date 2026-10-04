import { useMemo, useState } from "react";
import TrackListItem from "./TrackListItem";

const TABS = [
  { id: "all", label: "All" },
  { id: "favorites", label: "Favorites" },
  { id: "recent", label: "Recent" },
];

export default function DemoLibrarySidebar({
  tracks,
  selectedId,
  onSelect,
  favorites,
  onToggleFavorite,
  recentIds,
  onGoHome,
  storeName,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");

  const genres = useMemo(
    () => [...new Set(tracks.map((t) => t.genre))].sort(),
    [tracks]
  );

  const filtered = useMemo(() => {
    let list = tracks;
    if (activeTab === "favorites") {
      list = list.filter((t) => favorites.has(t.id));
    } else if (activeTab === "recent") {
      const order = new Map(recentIds.map((id, i) => [id, i]));
      list = list
        .filter((t) => order.has(t.id))
        .sort((a, b) => order.get(a.id) - order.get(b.id));
    }
    if (genreFilter !== "all") {
      list = list.filter((t) => t.genre === genreFilter);
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        t.genre.toLowerCase().includes(q) ||
        t.mood.toLowerCase().includes(q)
    );
  }, [tracks, activeTab, favorites, recentIds, searchQuery, genreFilter]);

  return (
    <aside
      id="demo-library"
      className="fixed left-0 top-0 z-40 flex h-screen w-80 lg:w-96 flex-col border-r border-ink-border bg-ink-panel/98 backdrop-blur-md shadow-beat"
    >
      <div className="border-b border-ink-border px-4 py-4 gap-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] uppercase tracking-[0.2em] text-ink-muted font-medium">
            {storeName ?? "Demo library"}
          </p>
          {onGoHome && (
            <button
              type="button"
              onClick={onGoHome}
              className="text-xs text-ink-muted hover:text-primary-400 transition-colors shrink-0"
            >
              Home
            </button>
          )}
        </div>
        <h2 className="text-2xl font-display text-white leading-none mt-1">Tracks</h2>
      </div>

      <div className="px-3 py-3 border-b border-ink-border">
        <div className="flex rounded-lg bg-ink-raised p-1 gap-0.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-md py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                activeTab === tab.id
                  ? "bg-ink-panel text-white shadow-sm ring-1 ring-ink-border"
                  : "text-ink-muted hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 space-y-3 border-b border-ink-border">
        <input
          id="demo-library-search"
          type="search"
          placeholder="Search tracks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-ink-border bg-ink px-3 py-2.5 text-sm text-white placeholder-ink-subtle focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600/50"
        />
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setGenreFilter("all")}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium border transition-colors ${
              genreFilter === "all"
                ? "border-primary-600 bg-primary-600/15 text-primary-300"
                : "border-ink-border text-ink-muted hover:border-ink-muted hover:text-gray-300"
            }`}
          >
            All genres
          </button>
          {genres.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => setGenreFilter(genre)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                genreFilter === genre
                  ? "border-primary-600 bg-primary-600/15 text-primary-300"
                  : "border-ink-border text-ink-muted hover:border-ink-muted hover:text-gray-300"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3 space-y-2">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-ink-muted py-8">No tracks match.</p>
        ) : (
          filtered.map((track) => (
            <TrackListItem
              key={track.id}
              track={track}
              selected={selectedId === track.id}
              isFavorite={favorites.has(track.id)}
              onSelect={onSelect}
              onToggleFavorite={onToggleFavorite}
            />
          ))
        )}
      </div>

      <p className="border-t border-ink-border px-4 py-3 text-[11px] leading-snug text-ink-subtle">
        Select a track for details and playback.
      </p>
    </aside>
  );
}
