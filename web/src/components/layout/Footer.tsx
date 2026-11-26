import { Link } from "react-router-dom";
import { useSite } from "@/lib/site";

export function Footer() {
  const { site } = useSite();

  return (
    <footer className="border-t border-[var(--hof-border-subtle)] bg-[var(--hof-surface)] py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="space-y-1">
          <p className="text-sm font-bold uppercase tracking-wider text-[var(--hof-text)]">
            {site?.siteName || "Hall of Fame"}
          </p>
          <p className="max-w-md text-xs leading-relaxed text-[var(--hof-muted)]">
            {site?.aboutBio ||
              "A personal archive of films, series, anime, games, and music worth remembering."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-[var(--hof-text-soft)]">
          <Link to="/" className="hover:text-[var(--hof-text)]">
            Home
          </Link>
          <Link to="/collections" className="hover:text-[var(--hof-text)]">
            Collections
          </Link>
          <Link to="/about" className="hover:text-[var(--hof-text)]">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
