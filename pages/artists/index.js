import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import AppNav from "../../components/AppNav";
import AppShell from "../../components/AppShell";
import { normalizePlatform } from "../../lib/platform";

export default function ArtistsDirectory() {
  const [platform, setPlatform] = useState(() => normalizePlatform(null));

  useEffect(() => {
    fetch("/platform.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setPlatform(normalizePlatform(data)))
      .catch(() => {});
  }, []);

  return (
    <>
      <Head>
        <title>Creators — lowkey</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AppNav platform={platform} />
      <AppShell
        title="Creators"
        subtitle="Approved artists with public pages. Each profile lists every approved track with playback and downloads."
      >
        <ul className="space-y-4 max-w-2xl">
          {platform.artists.map((a) => (
            <li key={a.id}>
              <Link
                href={`/artist/${a.slug}`}
                className="flex items-center gap-4 rounded-xl border border-ink-border bg-ink-panel p-4 hover:border-primary-600/50 transition-colors"
              >
                <img
                  src={a.portraitUrl}
                  alt=""
                  className="h-14 w-14 rounded-full object-cover border border-ink-border bg-ink-raised"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-2xl text-white uppercase leading-none">{a.name}</p>
                  <p className="text-sm text-primary-400 mt-1">{a.storeName}</p>
                  <p className="text-xs text-ink-muted mt-2 line-clamp-2">{a.bio}</p>
                </div>
                <span className="text-xs text-ink-subtle shrink-0">View →</span>
              </Link>
            </li>
          ))}
        </ul>
      </AppShell>
    </>
  );
}
