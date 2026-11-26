import * as React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import { EntryFormDrawer } from "@/components/admin/EntryFormDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api, resolveAssetUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useSite } from "@/lib/site";
import type { Category, EntryDetail } from "@/lib/types";

export default function EntryPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { refreshSite } = useSite();

  const [entry, setEntry] = React.useState<EntryDetail | null>(null);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [editOpen, setEditOpen] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    if (!slug) return;
    let active = true;
    setLoading(true);
    setConfirmDelete(false);
    api
      .getEntryBySlug(slug)
      .then((e) => {
        if (active) {
          setEntry(e);
          setError(null);
        }
      })
      .catch((e) => {
        if (active) setError(e instanceof Error ? e.message : "Entry not found");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  React.useEffect(() => {
    if (!isAdmin) return;
    api.getCategories().then(setCategories).catch(() => undefined);
  }, [isAdmin]);

  const handleDelete = async () => {
    if (!entry) return;
    setDeleting(true);
    try {
      await api.deleteEntry(entry.id);
      await refreshSite();
      navigate(`/collections/${entry.categorySlug}`, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete entry");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="animate-pulse text-[var(--hof-muted)]">Loading...</p>
      </div>
    );
  }
  if (error || !entry) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-[var(--danger)]">{error || "Entry not found"}</p>
      </div>
    );
  }

  const accent = entry.accentColor || "var(--hof-accent-light)";

  return (
    <article
      className="mx-auto max-w-3xl px-4 py-12 sm:px-6"
      style={{ ["--entry-accent" as string]: accent }}
    >
      {/* Header */}
      <header className="mb-10 space-y-4">
        {entry.posterUrl && (
          <div className="mx-auto mb-6 aspect-[3/2] max-w-lg overflow-hidden rounded-xl border border-[var(--hof-border-subtle)]">
            <img
              src={resolveAssetUrl(entry.posterUrl)}
              alt={entry.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              style={{
                borderColor: accent,
                backgroundColor: `color-mix(in srgb, ${accent} 20%, transparent)`,
              }}
            >
              {entry.tier}
            </Badge>
            <Link
              to={`/collections/${entry.categorySlug}`}
              className="text-xs font-semibold text-[var(--hof-muted)] hover:text-[var(--hof-text)]"
            >
              {entry.categoryName}
            </Link>
            {entry.releaseYear && (
              <span className="text-xs text-[var(--hof-muted)]">{entry.releaseYear}</span>
            )}
            {entry.rating != null && (
              <span className="text-xs font-bold" style={{ color: accent }}>
                {entry.rating}/10
              </span>
            )}
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setEditOpen(true)}
                className="gap-1.5"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              {confirmDelete ? (
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant="danger"
                    disabled={deleting}
                    onClick={handleDelete}
                  >
                    {deleting ? "Deleting..." : "Confirm Delete"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setConfirmDelete(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setConfirmDelete(true)}
                  className="gap-1.5 text-[var(--danger)] hover:bg-[var(--hof-danger-bg)]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>

        <h1 className="font-display text-4xl uppercase tracking-tight text-[var(--hof-text)] sm:text-5xl">
          {entry.title}
        </h1>
        {entry.tagline && (
          <p className="text-base italic text-[var(--hof-text-soft)]">{entry.tagline}</p>
        )}
      </header>

      {/* Body sections */}
      <div className="space-y-10">
        <section>
          <h2
            className="mb-3 text-xs font-bold uppercase tracking-[0.15em]"
            style={{ color: accent }}
          >
            Why it hooked me
          </h2>
          <div className="whitespace-pre-line text-sm leading-relaxed text-[var(--hof-text-soft)]">
            {entry.whyHooked}
          </div>
        </section>

        {entry.favoriteMoment && (
          <SpoilerSection
            accent={accent}
            title="Favorite moment"
            content={entry.favoriteMoment}
          />
        )}

        {entry.favoriteQuoteOrChar && (
          <section>
            <h2
              className="mb-3 text-xs font-bold uppercase tracking-[0.15em]"
              style={{ color: accent }}
            >
              Favorite character or quote
            </h2>
            <p className="whitespace-pre-line text-sm text-[var(--hof-text-soft)]">
              {entry.favoriteQuoteOrChar}
            </p>
          </section>
        )}

        {/* Tags */}
        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {entry.tags.map((tag) => (
              <Link
                key={tag.id}
                to={`/collections/${entry.categorySlug}?tag=${tag.slug}`}
                className="rounded-full border border-[var(--hof-accent)] bg-[var(--hof-card)] px-3 py-1 text-xs font-medium text-[var(--hof-text-soft)] transition-colors hover:bg-[var(--hof-accent-deep)]"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Related */}
        {entry.relatedEntries && entry.relatedEntries.length > 0 && (
          <section>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[var(--hof-muted)]">
              More like this
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {entry.relatedEntries.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/entry/${rel.slug}`}
                  className="overflow-hidden rounded-lg border border-[var(--hof-border-subtle)] bg-[var(--hof-card)] text-center transition-colors hover:bg-[var(--hof-card-hover)]"
                >
                  <div className="aspect-[3/2] w-full overflow-hidden bg-[var(--hof-shadow)]">
                    {rel.posterUrl ? (
                      <img
                        src={resolveAssetUrl(rel.posterUrl)}
                        alt={rel.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-lg font-bold text-[var(--hof-accent-deep)]">
                          {rel.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="truncate px-2 py-2 text-xs font-semibold text-[var(--hof-text)]">
                    {rel.title}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Prev / Next */}
        <nav className="flex items-center justify-between gap-4 border-t border-[var(--hof-border-subtle)] pt-6">
          {entry.previousEntry ? (
            <Link
              to={`/entry/${entry.previousEntry.slug}`}
              className="text-sm text-[var(--hof-accent-light)] hover:text-[var(--hof-text)]"
            >
              &larr; {entry.previousEntry.title}
            </Link>
          ) : (
            <span />
          )}
          {entry.nextEntry ? (
            <Link
              to={`/entry/${entry.nextEntry.slug}`}
              className="text-right text-sm text-[var(--hof-accent-light)] hover:text-[var(--hof-text)]"
            >
              {entry.nextEntry.title} &rarr;
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>

      {isAdmin && (
        <EntryFormDrawer
          open={editOpen}
          onClose={() => setEditOpen(false)}
          categories={categories}
          entry={entry}
          onSaved={(updated) => {
            setEntry(updated);
            if (updated.slug !== slug) {
              navigate(`/entry/${updated.slug}`, { replace: true });
            }
          }}
        />
      )}
    </article>
  );
}

function SpoilerSection({
  accent,
  title,
  content,
}: {
  accent: string;
  title: string;
  content: string;
}) {
  const [revealed, setRevealed] = React.useState(false);

  return (
    <section>
      <h2
        className="mb-3 text-xs font-bold uppercase tracking-[0.15em]"
        style={{ color: accent }}
      >
        {title} <span className="text-[var(--hof-muted)]">(spoiler)</span>
      </h2>
      <div className="relative">
        <div
          className={`whitespace-pre-line text-sm text-[var(--hof-text-soft)] transition-[filter] duration-300 ${
            revealed ? "" : "select-none blur-md"
          }`}
          aria-hidden={!revealed}
        >
          {content}
        </div>
        {!revealed && (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-lg bg-[var(--hof-shadow)]/30 text-xs font-semibold uppercase tracking-wider text-[var(--hof-text)] backdrop-blur-sm"
          >
            Click to reveal
          </button>
        )}
      </div>
    </section>
  );
}
