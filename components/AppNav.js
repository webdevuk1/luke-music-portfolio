import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { attachArtistNames, searchPlatform } from "../lib/platform";

export default function AppNav({ platform, onPickTrack }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const results = useMemo(() => {
    if (!platform?.artists?.length) return { artists: [], tracks: [] };
    return searchPlatform(platform, query);
  }, [platform, query]);

  const tracksWithNames = useMemo(
    () => attachArtistNames(results.tracks, platform?.artists ?? []),
    [results.tracks, platform?.artists]
  );

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const showResults = open && query.trim().length > 0;
  const hasHits = results.artists.length > 0 || tracksWithNames.length > 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-ink-border bg-ink/95 backdrop-blur-md">
      <div className="flex h-full items-center gap-3 px-4 lg:px-6">
        <Link
          href="/"
          className="shrink-0 font-display text-xl text-white uppercase tracking-wide hover:text-primary-400 transition-colors"
        >
          lowkey
        </Link>

        <nav className="hidden sm:flex items-center gap-4 text-xs font-semibold uppercase tracking-wide text-ink-muted ml-2">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/artists" className="hover:text-white transition-colors">
            Creators
          </Link>
          <Link href="/submit" className="hover:text-white transition-colors">
            Submit
          </Link>
          <Link href="/my-page" className="hover:text-white transition-colors">
            My page
          </Link>
        </nav>

        <div ref={wrapRef} className="relative flex-1 max-w-xl ml-auto">
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search creators and tracks..."
            className="w-full rounded-lg border border-ink-border bg-ink-panel px-3 py-2 text-sm text-white placeholder-ink-subtle focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600/50"
            aria-label="Search creators and tracks"
          />
          {showResults && (
            <div className="absolute top-full mt-2 w-full rounded-xl border border-ink-border bg-ink-panel shadow-beat max-h-80 overflow-y-auto custom-scrollbar">
              {!hasHits ? (
                <p className="px-4 py-3 text-sm text-ink-muted">No matches.</p>
              ) : (
                <>
                  {results.artists.length > 0 && (
                    <div className="px-3 py-2 border-b border-ink-border">
                      <p className="text-[10px] uppercase tracking-wider text-ink-subtle px-1 mb-1">
                        Creators
                      </p>
                      {results.artists.map((a) => (
                        <Link
                          key={a.id}
                          href={`/artist/${a.slug}`}
                          onClick={() => {
                            setOpen(false);
                            setQuery("");
                          }}
                          className="block rounded-lg px-2 py-2 hover:bg-ink-raised text-sm text-white"
                        >
                          {a.name}
                          <span className="text-ink-muted ml-2 text-xs">{a.storeName}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                  {tracksWithNames.length > 0 && (
                    <div className="px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wider text-ink-subtle px-1 mb-1">
                        Tracks
                      </p>
                      {tracksWithNames.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setOpen(false);
                            setQuery("");
                            if (onPickTrack) {
                              onPickTrack(t);
                            } else {
                              router.push(
                                `/artist/${t.artistSlug}?track=${encodeURIComponent(t.id)}`
                              );
                            }
                          }}
                          className="w-full text-left rounded-lg px-2 py-2 hover:bg-ink-raised"
                        >
                          <span className="text-sm text-white">{t.title}</span>
                          <span className="text-xs text-ink-muted ml-2">{t.artistName}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
