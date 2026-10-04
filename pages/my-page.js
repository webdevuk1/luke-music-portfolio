import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import AppNav from "../components/AppNav";
import AppShell from "../components/AppShell";
import { loadPendingSubmissions, normalizePlatform } from "../lib/platform";

export default function MyPageShell() {
  const [platform, setPlatform] = useState(() => normalizePlatform(null));
  const [pending, setPending] = useState([]);

  useEffect(() => {
    fetch("/platform.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setPlatform(normalizePlatform(data)))
      .catch(() => {});
    setPending(loadPendingSubmissions());
  }, []);

  return (
    <>
      <Head>
        <title>My page — lowkey</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AppNav platform={platform} />
      <AppShell
        title="My page"
        subtitle="How your public creator page will look once your profile and tracks are approved."
      >
        <div className="grid gap-6 lg:grid-cols-[240px_1fr] max-w-4xl">
          <div className="rounded-xl border border-dashed border-ink-border bg-ink-panel/50 p-6 text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-ink-raised border border-ink-border flex items-center justify-center text-ink-muted text-xs">
              Photo
            </div>
            <p className="mt-4 font-display text-2xl text-white uppercase">Your name</p>
            <p className="text-sm text-primary-400 mt-1">your-store-name</p>
            <span className="inline-block mt-3 text-[10px] uppercase tracking-wide px-2 py-1 rounded border border-ink-border text-ink-muted">
              Awaiting profile approval
            </span>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-ink-border bg-ink-panel p-5">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wide">Your tracks</h2>
              <p className="text-xs text-ink-muted mt-1">
                Approved songs list here — same layout as Luke&apos;s library.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="rounded-lg border border-dashed border-ink-border px-4 py-6 text-center text-sm text-ink-subtle">
                  No approved tracks yet
                </li>
                {pending.slice(0, 3).map((p) => (
                  <li
                    key={p.id}
                    className="rounded-lg border border-ink-border bg-ink-raised px-4 py-3 flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm text-white">{p.title}</p>
                      <p className="text-[11px] text-ink-muted">Pending review</p>
                    </div>
                    <span className="text-[10px] uppercase text-amber-400/90">Shell</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/submit"
              className="inline-flex rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold uppercase tracking-wide px-6 py-3"
            >
              Submit a track
            </Link>
          </div>
        </div>
      </AppShell>
    </>
  );
}
