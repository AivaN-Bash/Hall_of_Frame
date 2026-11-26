import * as React from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Plus, Search, X } from "lucide-react";
import { EntryFormDrawer } from "@/components/admin/EntryFormDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, resolveAssetUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Category, EntrySummary, Tag } from "@/lib/types";

type SortOption = "rank" | "rating" | "newest";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdmin } = useAuth();

  const activeTag = searchParams.get("tag") || "";
  const [query, setQuery] = React.useState(searchParams.get("q") || "");
  const [sort, setSort] = React.useState<SortOption>(
    (searchParams.get("sort") as SortOption) || "rank",
  );

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [category, setCategory] = React.useState<Category | null>(null);
  const [allCategoryTags, setAllCategoryTags] = React.useState<Tag[]>([]);
  const [entries, setEntries] = React.useState<EntrySummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Load category metadata + unfiltered tags once per category slug
  const loadCategoryMeta = React.useCallback(async () => {
    if (!slug) return;
    const [cats, allInCat] = await Promise.all([
      api.getCategories(),
      api.getEntries({ category: slug, sort: "rank" }),
    ]);
    setCategories(cats);
    const found = cats.find((c) => c.slug === slug) || null;
    setCategory(found);
    if (!found) {
      setError("Category not found");
      return;
    }
    const tagMap = new Map<string, Tag>();
    for (const e of allInCat) {
      for (const t of e.tags) {
        if (!tagMap.has(t.slug)) tagMap.set(t.slug, t);
      }
    }
    setAllCategoryTags(Array.from(tagMap.values()).sort((a, b) => a.name.localeCompare(b.name)));
  }, [slug]);

  const loadFilteredEntries = React.useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const ents = await api.getEntries({
        category: slug,
        tag: activeTag || undefined,
        q: query.trim() || undefined,
        sort,
      });
      setEntries(ents);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load entries");
    } finally {
      setLoading(false);
    }
  }, [slug, activeTag, query, sort]);

  React.useEffect(() => {
    loadCategoryMeta().catch((e) => {
      setError(e instanceof Error ? e.message : "Failed to load category");
      setLoading(false);
    });
  }, [loadCategoryMeta]);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadFilteredEntries();
    }, 150);
    return () => window.clearTimeout(timer);
  }, [loadFilteredEntries]);

  const setTagFilter = (tagSlug: string) => {
    const next = new URLSearchParams(searchParams);
    if (tagSlug) next.set("tag", tagSlug);
    else next.delete("tag");
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    setQuery("");
    setSort("rank");
    setTagFilter("");
  };

  if (error && !category) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-[var(--danger)]">{error}</p>
      </div>
    );
  }

  const hasFilters = Boolean(activeTag || query.trim() || sort !== "rank");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--hof-border-subtle)] pb-6">
        <div>
          <Link
            to="/collections"
            className="text-xs font-medium text-[var(--hof-muted)] hover:text-[var(--hof-text)]"
          >
            &larr; All Collections
          </Link>
          <h1 className="mt-2 font-display text-4xl uppercase tracking-tight text-[var(--hof-text)] sm:text-5xl">
            {category?.name || slug}
          </h1>
        </div>

        {isAdmin && category && (
          <Button
            type="button"
            size="sm"
            onClick={() => setDrawerOpen(true)}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Entry
          </Button>
        )}
      </div>

      {/* Search & Sort Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[var(--hof-muted)]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles, taglines, notes..."
            className="pl-9 pr-8"
            aria-label="Search entries in this category"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 text-[var(--hof-muted)] hover:text-[var(--hof-text)]"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label
            htmlFor="category-sort"
            className="text-xs font-semibold uppercase tracking-wider text-[var(--hof-muted)]"
          >
            Sort
          </label>
          <select
            id="category-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="h-10 rounded-lg border border-[var(--hof-border-subtle)] bg-[var(--hof-card)] px-3 text-sm text-[var(--hof-text)] focus:border-[var(--hof-accent-light)] focus:outline-none"
          >
            <option value="rank">My Rank</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Tag Chips */}
      {allCategoryTags.length > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setTagFilter("")}
            className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              !activeTag
                ? "border-[var(--hof-accent-light)] bg-[var(--hof-accent-deep)] text-[var(--hof-text)]"
                : "border-[var(--hof-border-subtle)] bg-[var(--hof-surface)] text-[var(--hof-muted)] hover:text-[var(--hof-text)]"
            }`}
          >
            All
          </button>
          {allCategoryTags.map((tag) => {
            const selected = activeTag === tag.slug;
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => setTagFilter(selected ? "" : tag.slug)}
                className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  selected
                    ? "border-[var(--hof-accent-light)] bg-[var(--hof-accent-deep)] text-[var(--hof-text)]"
                    : "border-[var(--hof-border-subtle)] bg-[var(--hof-surface)] text-[var(--hof-muted)] hover:text-[var(--hof-text)]"
                }`}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <p className="animate-pulse text-sm text-[var(--hof-muted)]">Loading entries...</p>
        </div>
      ) : entries.length === 0 ? (
        <div className="mx-auto max-w-md rounded-2xl border border-[var(--hof-border-subtle)] bg-[var(--hof-surface)] px-6 py-12 text-center">
          <p className="text-sm font-medium text-[var(--hof-text)]">
            {hasFilters ? "No entries match your filters." : "Nothing here yet."}
          </p>
          {hasFilters && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={clearFilters}
              className="mt-4"
            >
              Clear filters
            </Button>
          )}
        </div>
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
              <div className="space-y-1.5 px-3 py-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="line-clamp-2 text-sm font-bold text-[var(--hof-text)]">
                    {entry.title}
                  </span>
                  <Badge className="shrink-0 text-[10px]">{entry.tier}</Badge>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[var(--hof-muted)]">
                  {entry.releaseYear && <span>{entry.releaseYear}</span>}
                  {entry.rating != null && <span>· {entry.rating}/10</span>}
                </div>
                {entry.tagline && (
                  <p className="line-clamp-2 text-xs text-[var(--hof-muted)]">{entry.tagline}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {isAdmin && category && (
        <EntryFormDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          categories={categories}
          initialCategoryId={category.id}
          onSaved={() => {
            void loadCategoryMeta();
            void loadFilteredEntries();
          }}
        />
      )}
    </div>
  );
}
