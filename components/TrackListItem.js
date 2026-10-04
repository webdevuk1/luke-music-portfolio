export default function TrackListItem({
  track,
  selected,
  isFavorite,
  onSelect,
  onToggleFavorite,
  showArtistName = false,
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(track)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(track);
        }
      }}
      className={`w-full text-left rounded-lg border p-3 transition-all cursor-pointer ${
        selected
          ? "border-primary-600 bg-primary-600/10 ring-1 ring-primary-600/35"
          : "border-ink-border bg-ink-raised/80 hover:border-ink-muted hover:bg-ink-hover"
      }`}
    >
      <div className="flex gap-3">
        <div
          className={`shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br ${track.accent} flex items-center justify-center shadow-lg`}
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="font-semibold text-white truncate">{track.title}</p>
            <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded bg-primary-600/20 text-primary-300 border border-primary-600/35">
              {track.badge}
            </span>
          </div>
          <p className="text-xs text-ink-muted truncate">{track.subtitle}</p>
          {showArtistName && track.artistName && (
            <p className="text-[11px] text-primary-400/90 truncate mt-0.5">{track.artistName}</p>
          )}
          <p className="text-[11px] text-ink-subtle mt-1 truncate">
            {track.genre} · {track.bpm} BPM · {track.mood}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(track.id);
          }}
          className="shrink-0 p-1 text-ink-subtle hover:text-primary-400"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg
            className={`w-5 h-5 ${isFavorite ? "text-primary-400 fill-primary-400" : ""}`}
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
