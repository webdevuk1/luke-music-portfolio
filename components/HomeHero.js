import { useEffect, useMemo, useRef, useState } from "react";

export default function HomeHero({ site, heroTrack, onOpenLibrary }) {
  const audioRef = useRef(null);
  const [loopPlaying, setLoopPlaying] = useState(false);

  const portraitSrc = site?.portraitUrl ?? "/luke-portrait.svg";

  useEffect(() => {
    setLoopPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [heroTrack?.id]);

  const toggleLoop = () => {
    const el = audioRef.current;
    if (!el || !heroTrack?.audioUrl) return;
    if (loopPlaying) {
      el.pause();
      setLoopPlaying(false);
    } else {
      el.play();
      setLoopPlaying(true);
    }
  };

  const loopLabel = useMemo(() => {
    if (!heroTrack) return "Featured loop";
    return `${heroTrack.title} — loop`;
  }, [heroTrack]);

  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center justify-center px-4 py-2 text-center overflow-hidden">
      <div className="relative mb-2 sm:mb-3 shrink-0">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary-600/50 to-primary-900/40 blur-lg" />
        <img
          src={portraitSrc}
          alt={`${site?.artistName ?? "Luke"} portrait`}
          className="relative h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-full object-cover border-2 border-ink-border shadow-beat bg-ink-panel"
        />
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-white uppercase leading-none shrink-0">
        {site?.artistName ?? "Luke"}
      </h1>
      <p className="mt-1 text-[11px] sm:text-xs uppercase tracking-[0.2em] text-primary-400 shrink-0">
        {site?.tagline ?? "Music portfolio"}
      </p>
      <p className="mt-2 max-w-md text-ink-muted text-xs sm:text-sm leading-snug line-clamp-2 sm:line-clamp-3 min-h-0 px-1">
        {site?.aboutLuke ?? site?.intro}
      </p>

      <div className="mt-3 sm:mt-4 w-full max-w-md shrink-0 space-y-2">
        {heroTrack?.audioUrl && (
          <div className="rounded-xl border border-ink-border bg-ink-panel px-3 py-2.5 text-left flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[9px] uppercase tracking-[0.15em] text-ink-subtle">Featured loop</p>
              <p className="text-sm text-white font-semibold truncate">{heroTrack.title}</p>
              <p className="text-[11px] text-ink-muted truncate">{heroTrack.subtitle}</p>
            </div>
            <audio ref={audioRef} src={heroTrack.audioUrl} loop />
            <button
              type="button"
              onClick={toggleLoop}
              className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-lg border border-ink-border bg-ink-raised hover:border-primary-600 hover:text-primary-300 text-white text-xs font-medium px-3 py-2 transition-colors"
            >
              {loopPlaying ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play
                </>
              )}
            </button>
            <p className="sr-only">{loopLabel}</p>
          </div>
        )}

        <button
          type="button"
          onClick={onOpenLibrary}
          className="w-full inline-flex items-center justify-center rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold uppercase tracking-wide text-xs sm:text-sm px-6 py-2.5 shadow-lg shadow-primary-900/40 transition-colors"
        >
          Browse tracks
        </button>
      </div>
    </div>
  );
}
