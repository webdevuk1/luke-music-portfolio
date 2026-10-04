import AppNav from "./AppNav";
import DemoLibrarySidebar from "./DemoLibrarySidebar";
import HomeHero from "./HomeHero";
import MainPanel from "./MainPanel";

export default function PortfolioShell({
  platform,
  site,
  tracks,
  artist,
  selectedId,
  onSelect,
  onClearSelection,
  favorites,
  onToggleFavorite,
  recentIds,
  onGoHome,
  onOpenLibrary,
  sidebarTitle,
}) {
  const selectedTrack = tracks.find((t) => t.id === selectedId) ?? null;

  const heroTrack =
    tracks.find((t) => t.id === site?.heroLoopTrackId) ?? tracks[0] ?? null;

  return (
    <div className="min-h-screen pt-14">
      <AppNav
        platform={platform}
        onPickTrack={(track) => {
          if (track.artistSlug && typeof window !== "undefined") {
            window.location.href = `/artist/${track.artistSlug}?track=${encodeURIComponent(track.id)}`;
            return;
          }
          onSelect(track);
        }}
      />

      <DemoLibrarySidebar
        tracks={tracks}
        selectedId={selectedId}
        onSelect={onSelect}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        recentIds={recentIds}
        onGoHome={onGoHome}
        storeName={sidebarTitle ?? site?.storeName}
        showArtistNames={!artist}
      />

      <main
        className={`ml-80 lg:ml-96 ${
          selectedTrack
            ? "min-h-[calc(100vh-3.5rem)] py-6 sm:py-10"
            : "h-[calc(100vh-3.5rem)] py-0 overflow-hidden"
        }`}
      >
        {selectedTrack ? (
          <MainPanel
            site={site}
            track={selectedTrack}
            onClearSelection={onClearSelection}
          />
        ) : (
          <HomeHero
            site={site}
            heroTrack={heroTrack}
            onOpenLibrary={onOpenLibrary}
          />
        )}
      </main>
    </div>
  );
}
