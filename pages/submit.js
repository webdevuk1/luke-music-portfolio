import Head from "next/head";
import { useEffect, useState } from "react";
import AppNav from "../components/AppNav";
import AppShell from "../components/AppShell";
import {
  loadPendingSubmissions,
  normalizePlatform,
  savePendingSubmission,
} from "../lib/platform";

const emptyForm = {
  artistName: "",
  artistSlug: "",
  title: "",
  subtitle: "",
  genre: "Hip Hop",
  bpm: "",
  mood: "",
  about: "",
  audioUrl: "",
};

export default function SubmitPage() {
  const [platform, setPlatform] = useState(() => normalizePlatform(null));
  const [form, setForm] = useState(emptyForm);
  const [pending, setPending] = useState([]);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch("/platform.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setPlatform(normalizePlatform(data)))
      .catch(() => {});
    setPending(loadPendingSubmissions());
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const slug =
      form.artistSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-") ||
      form.artistName.trim().toLowerCase().replace(/\s+/g, "-");
    const entry = {
      id: `pending-${Date.now()}`,
      status: "pending",
      submittedAt: new Date().toISOString(),
      artistName: form.artistName.trim(),
      artistSlug: slug,
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      genre: form.genre.trim(),
      bpm: Number(form.bpm) || 0,
      mood: form.mood.trim(),
      about: form.about.trim(),
      audioUrl: form.audioUrl.trim(),
    };
    savePendingSubmission(entry);
    setPending(loadPendingSubmissions());
    setForm(emptyForm);
    setSent(true);
  };

  return (
    <>
      <Head>
        <title>Submit a track — lowkey</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AppNav platform={platform} />
      <AppShell
        title="Submit a track"
        subtitle="Share a demo for review. After approval it appears on your creator page, in search, and with download enabled."
      >
        <div className="max-w-xl">
          {sent && (
            <p className="mb-6 rounded-lg border border-primary-600/40 bg-primary-600/10 px-4 py-3 text-sm text-primary-200">
              Received — pending approval. You can submit another below.
            </p>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            {[
              ["artistName", "Your name", "text"],
              ["artistSlug", "Page URL slug (optional)", "text"],
              ["title", "Track title", "text"],
              ["subtitle", "Type / subtitle", "text"],
              ["genre", "Genre", "text"],
              ["bpm", "BPM", "number"],
              ["mood", "Mood", "text"],
              ["audioUrl", "Audio URL (MP3 link)", "url"],
            ].map(([key, label, type]) => (
              <label key={key} className="block">
                <span className="text-xs uppercase tracking-wide text-ink-subtle">{label}</span>
                <input
                  required={key !== "artistSlug"}
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-ink-border bg-ink-panel px-3 py-2 text-sm text-white focus:border-primary-600 focus:outline-none"
                />
              </label>
            ))}
            <label className="block">
              <span className="text-xs uppercase tracking-wide text-ink-subtle">About this track</span>
              <textarea
                required
                rows={4}
                value={form.about}
                onChange={(e) => setForm((f) => ({ ...f, about: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-ink-border bg-ink-panel px-3 py-2 text-sm text-white focus:border-primary-600 focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold uppercase tracking-wide text-sm py-3"
            >
              Send for approval
            </button>
          </form>

          {pending.length > 0 && (
            <div className="mt-12 border-t border-ink-border pt-8">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wide">Your pending (this device)</h2>
              <ul className="mt-4 space-y-3">
                {pending.map((p) => (
                  <li
                    key={p.id}
                    className="rounded-lg border border-ink-border bg-ink-panel px-4 py-3 text-sm"
                  >
                    <p className="text-white font-medium">{p.title}</p>
                    <p className="text-ink-muted text-xs mt-1">{p.artistName} · awaiting approval</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="mt-10 text-xs text-ink-subtle">
            Approvals are added manually to <code className="text-primary-300">platform.json</code> for now.
          </p>
        </div>
      </AppShell>
    </>
  );
}
