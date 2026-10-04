import { useEffect, useRef, useState } from "react";

export default function MainPanel({ site, track, onClearSelection }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setPlaying(false);
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [track?.id]);

  if (!track) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-6">
        <div className="w-full max-w-lg rounded-xl border border-dashed border-ink-border bg-ink-panel/50 px-8 py-12">
          <div className="mx-auto w-14 h-14 rounded-full bg-ink-raised flex items-center justify-center mb-4 ring-1 ring-ink-border">
            <svg className="w-7 h-7 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
            </svg>
          </div>
          <p className="text-gray-200 font-medium">Pick a demo from the library</p>
          <p className="text-ink-muted text-sm mt-1">Title, notes, and full playback show up here</p>
        </div>
      </div>
    );
  }

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play();
      setPlaying(true);
    }
  };

  return (
    <div className="animate-[fadeIn_0.25s_ease-out] max-w-2xl mx-auto w-full px-4 py-8 sm:py-12">
      <button
        type="button"
        onClick={onClearSelection}
        className="text-sm text-ink-muted hover:text-primary-400 mb-6 inline-flex items-center gap-1"
      >
        ← Back to library
      </button>

      <div
        className={`rounded-2xl bg-gradient-to-br ${track.accent} p-1 shadow-xl`}
      >
        <div className="rounded-[14px] bg-ink-panel p-8 sm:p-10 ring-1 ring-black/40">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs uppercase tracking-widest text-ink-muted">{track.subtitle}</p>
            {track.badge && (
              <span className="text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded bg-primary-600/20 text-primary-300 border border-primary-600/35">
                {track.badge}
              </span>
            )}
          </div>
          <h1 className="mt-2 text-4xl sm:text-5xl font-display text-white uppercase">{track.title}</h1>

          <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="rounded-lg bg-ink-raised border border-ink-border px-3 py-2">
              <dt className="text-[10px] uppercase tracking-wider text-ink-subtle">Genre</dt>
              <dd className="text-sm text-white mt-0.5">{track.genre}</dd>
            </div>
            <div className="rounded-lg bg-ink-raised border border-ink-border px-3 py-2">
              <dt className="text-[10px] uppercase tracking-wider text-ink-subtle">BPM</dt>
              <dd className="text-sm text-white mt-0.5">{track.bpm}</dd>
            </div>
            <div className="rounded-lg bg-ink-raised border border-ink-border px-3 py-2">
              <dt className="text-[10px] uppercase tracking-wider text-ink-subtle">Mood</dt>
              <dd className="text-sm text-white mt-0.5">{track.mood}</dd>
            </div>
            <div className="rounded-lg bg-ink-raised border border-ink-border px-3 py-2">
              <dt className="text-[10px] uppercase tracking-wider text-ink-subtle">Type</dt>
              <dd className="text-sm text-white mt-0.5">{track.subtitle}</dd>
            </div>
          </dl>

          <h2 className="mt-8 text-sm font-semibold text-gray-200">About this track</h2>
          <p className="mt-2 text-ink-muted leading-relaxed">{track.about}</p>

          <audio
            ref={audioRef}
            src={track.audioUrl}
            onTimeUpdate={() => {
              const el = audioRef.current;
              if (el?.duration) setProgress((el.currentTime / el.duration) * 100);
            }}
            onEnded={() => {
              setPlaying(false);
              setProgress(0);
            }}
          />

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="button"
              onClick={togglePlay}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold uppercase tracking-wide text-sm px-8 py-3 shadow-lg shadow-primary-900/40 transition-colors min-w-[160px]"
            >
              {playing ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play
                </>
              )}
            </button>
            <div className="flex-1 w-full h-1.5 rounded-full bg-ink-raised overflow-hidden ring-1 ring-ink-border">
              <div
                className="h-full bg-primary-500 transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
