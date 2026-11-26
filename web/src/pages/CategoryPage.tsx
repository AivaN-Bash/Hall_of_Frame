import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { api, resolveAssetUrl } from "@/lib/api";
import type { Category, EntrySummary } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = React.useState<Category | null>(null);
  const [entries, setEntries] = React.useState<EntrySummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!slug) return;
    let active = true;
    setLoading(true);
    Promise.all([
      api.getCategories(),
      api.getEntries({ category: slug }),
    ])
      .then(([cats, ents]) => {
        if (!active) return;
        const found = cats.find((c) => c.slug === slug) || null;
        setCategory(found);
        setEntries(ents);
        if (!found) setError("Category not found");
      })
      .catch((e) => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="animate-pulse text-[var(--hof-muted)]">Loading...</p>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-[var(--danger)]">{error || "Category not found"}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="mb-10 text-center font-display text-4xl uppercase tracking-tight text-[var(--hof-text)]">
        {category.name}
      </h1>

      {entries.length === 0 ? (
        <p className="text-center text-sm text-[var(--hof-muted)]">Nothing here yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {entries.map((entry) => (
            <Link
              key={entry.id}
              to={`/entry/${entry.slug}`}
              className="group overflow-hidden rounded-xl border border-[var(--hof-border-subtle)] bg-[var(--hof-card)] transition-colors hover:bg-[var(--hof-card-hover)]"
            >
              <div className="aspect-[3/2] w-full overflow-hidden bg-[var(--hof-shadow)]">
                {entry.posterUrl ? (
                  <img
                    src={resolveAssetUrl(entry.posterUrl)}
                    alt={entry.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--hof-surface)] to-[var(--hof-shadow)]">
                    <span className="text-3xl font-bold text-[var(--hof-accent-deep)]">
                      {entry.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-1 px-3 py-3">
                <div className="flex items-start justify-between gap-1">
                  <span className="line-clamp-2 text-sm font-bold text-[var(--hof-text)]">
                    {entry.title}
                  </span>
                  <Badge className="shrink-0 text-[10px]">{entry.tier}</Badge>
                </div>
                {entry.tagline && (
                  <p className="line-clamp-2 text-xs text-[var(--hof-muted)]">{entry.tagline}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
