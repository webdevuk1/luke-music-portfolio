import Link from "next/link";
import { useRouter } from "next/router";

const LINKS = [
  { href: "/", label: "Home", hint: "Featured creator & full library" },
  { href: "/artists", label: "Creators", hint: "Approved profiles" },
  { href: "/submit", label: "Submit", hint: "Send a demo for review" },
  { href: "/my-page", label: "My page", hint: "Your public page (shell)" },
];

export default function AppShell({ children, title, subtitle }) {
  const router = useRouter();

  return (
    <div className="min-h-screen pt-14 bg-ink">
      <aside className="fixed left-0 top-14 z-30 flex h-[calc(100vh-3.5rem)] w-72 flex-col border-r border-ink-border bg-ink-panel/98">
        <div className="px-4 py-5 border-b border-ink-border">
          <p className="text-[10px] uppercase tracking-[0.2em] text-ink-muted">Navigate</p>
          <p className="font-display text-2xl text-white uppercase mt-1 leading-none">Platform</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {LINKS.map((item) => {
            const active =
              item.href === "/"
                ? router.pathname === "/"
                : router.pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-3 border transition-colors ${
                  active
                    ? "border-primary-600/50 bg-primary-600/10 text-white"
                    : "border-transparent text-ink-muted hover:bg-ink-raised hover:text-gray-200"
                }`}
              >
                <span className="text-sm font-semibold">{item.label}</span>
                <span className="block text-[11px] mt-0.5 opacity-80">{item.hint}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-ink-border px-4 py-4">
          <p className="text-[10px] uppercase tracking-wider text-ink-subtle">Shell preview</p>
          <p className="text-[11px] text-ink-muted mt-1 leading-snug">
            Layout and navigation only — approvals and uploads are wired next.
          </p>
        </div>
      </aside>

      <main className="ml-72 min-h-[calc(100vh-3.5rem)]">
        {(title || subtitle) && (
          <div className="border-b border-ink-border bg-ink-panel/40 px-8 py-8">
            {title && (
              <h1 className="text-4xl sm:text-5xl font-display text-white uppercase">{title}</h1>
            )}
            {subtitle && <p className="mt-2 text-sm text-ink-muted max-w-2xl">{subtitle}</p>}
          </div>
        )}
        <div className="px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
