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
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="relative mb-8">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary-600/50 to-primary-900/40 blur-xl" />
        <img
          src={portraitSrc}
          alt={`${site?.artistName ?? "Luke"} portrait`}
          className="relative h-36 w-36 sm:h-44 sm:w-44 rounded-full object-cover border-2 border-ink-border shadow-beat bg-ink-panel"
        />
      </div>

      <h1 className="text-5xl sm:text-6xl font-display text-white uppercase">
        {site?.artistName ?? "Luke"}
      </h1>
      <p className="mt-2 text-sm uppercase tracking-[0.25em] text-primary-400">
        {site?.tagline ?? "Music portfolio"}
      </p>
      <p className="mt-6 max-w-lg text-ink-muted text-sm sm:text-base leading-relaxed">
        {site?.aboutLuke ?? site?.intro}
      </p>

      {heroTrack?.audioUrl && (
        <div className="mt-10 w-full max-w-md rounded-xl border border-ink-border bg-ink-panel p-5 text-left">
          <p className="text-[10px] uppercase tracking-[0.2em] text-ink-subtle mb-3">Featured loop</p>
          <p className="text-white font-semibold">{heroTrack.title}</p>
          <p className="text-sm text-ink-muted mt-0.5">{heroTrack.subtitle}</p>
          <audio ref={audioRef} src={heroTrack.audioUrl} loop />
          <button
            type="button"
            onClick={toggleLoop}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-ink-border bg-ink-raised hover:border-primary-600 hover:text-primary-300 text-white font-medium px-6 py-2.5 transition-colors w-full sm:w-auto"
          >
            {loopPlaying ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
                Pause loop
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play loop
              </>
            )}
          </button>
          <p className="sr-only">{loopLabel}</p>
        </div>
      )}

      <button
        type="button"
        onClick={onOpenLibrary}
        className="mt-10 inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold uppercase tracking-wide text-sm px-8 py-3.5 shadow-lg shadow-primary-900/40 transition-colors"
      >
        Browse tracks
      </button>
    </div>
  );
}
