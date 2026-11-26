import * as React from "react";
import { Link, Navigate } from "react-router-dom";
import { FolderPlus, Pencil, Plus, Settings2, Star, Trash2 } from "lucide-react";
import { CategoryFormDrawer } from "@/components/admin/CategoryFormDrawer";
import { EntryFormDrawer } from "@/components/admin/EntryFormDrawer";
import { SiteSettingsDrawer } from "@/components/admin/SiteSettingsDrawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useSite } from "@/lib/site";
import type { Category, EntryDetail, EntrySummary } from "@/lib/types";

export default function AdminPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const { refreshSite } = useSite();

  const [entries, setEntries] = React.useState<EntrySummary[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [query, setQuery] = React.useState("");
  const [catFilter, setCatFilter] = React.useState<string>("all");

  const [entryDrawerOpen, setEntryDrawerOpen] = React.useState(false);
  const [editingEntry, setEditingEntry] = React.useState<EntryDetail | null>(null);
  const [catDrawerOpen, setCatDrawerOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
  const [siteDrawerOpen, setSiteDrawerOpen] = React.useState(false);

  const [confirmDeleteEntryId, setConfirmDeleteEntryId] = React.useState<number | null>(null);
  const [confirmDeleteCatId, setConfirmDeleteCatId] = React.useState<number | null>(null);

  const [rankDraft, setRankDraft] = React.useState<Record<number, number>>({});
  const [catOrderDraft, setCatOrderDraft] = React.useState<Record<number, number>>({});
  const [savingOrder, setSavingOrder] = React.useState(false);

  const loadAll = React.useCallback(async () => {
    try {
      const [cats, ents] = await Promise.all([
        api.getCategories(),
        api.getEntries({ sort: "rank" }),
      ]);
      setCategories(cats);
      setEntries(ents);
      setRankDraft(Object.fromEntries(ents.map((e) => [e.id, e.rankOrder])));
      setCatOrderDraft(Object.fromEntries(cats.map((c) => [c.id, c.sortOrder])));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (isAdmin) {
      void loadAll();
    }
  }, [isAdmin, loadAll]);

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="animate-pulse text-[var(--hof-muted)]">Checking auth...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const filteredEntries = entries.filter((e) => {
    if (catFilter !== "all" && e.categorySlug !== catFilter) return false;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.categoryName.toLowerCase().includes(q) ||
        (e.tagline ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleEditEntry = async (slug: string) => {
    try {
      const detail = await api.getEntryBySlug(slug);
      setEditingEntry(detail);
      setEntryDrawerOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load entry");
    }
  };

  const handleToggleFeatured = async (summary: EntrySummary) => {
    try {
      const detail = await api.getEntryBySlug(summary.slug);
      await api.updateEntry(detail.id, {
        categoryId: detail.categoryId,
        title: detail.title,
        releaseYear: detail.releaseYear,
        posterUrl: detail.posterUrl,
        accentColor: detail.accentColor,
        tagline: detail.tagline,
        rating: detail.rating,
        tier: detail.tier,
        whyHooked: detail.whyHooked,
        favoriteMoment: detail.favoriteMoment,
        favoriteQuoteOrChar: detail.favoriteQuoteOrChar,
        featured: !detail.featured,
        rankOrder: detail.rankOrder,
        tags: detail.tags.map((t) => t.name),
      });
      await loadAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to toggle featured");
    }
  };

  const handleDeleteEntry = async (id: number) => {
    try {
      await api.deleteEntry(id);
      setConfirmDeleteEntryId(null);
      await Promise.all([loadAll(), refreshSite()]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete entry");
    }
  };

  const handleSaveEntryRanks = async () => {
    if (entries.length === 0) return;
    setSavingOrder(true);
    try {
      await api.reorderEntries(
        entries.map((e) => ({ id: e.id, rankOrder: rankDraft[e.id] ?? e.rankOrder })),
      );
      await loadAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save entry order");
    } finally {
      setSavingOrder(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await api.deleteCategory(id);
      setConfirmDeleteCatId(null);
      await Promise.all([loadAll(), refreshSite()]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete category");
    }
  };

  const handleSaveCategoryOrder = async () => {
    if (categories.length === 0) return;
    setSavingOrder(true);
    try {
      await api.reorderCategories(
        categories.map((c) => ({ id: c.id, sortOrder: catOrderDraft[c.id] ?? c.sortOrder })),
      );
      await loadAll();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save category order");
    } finally {
      setSavingOrder(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--hof-border-subtle)] pb-6">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-tight text-[var(--hof-text)] sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-1 text-xs text-[var(--hof-muted)]">
            Manage entries, collections, hero copy, and your About page.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSiteDrawerOpen(true)}
            className="gap-1.5"
          >
            <Settings2 className="h-3.5 w-3.5" />
            Site &amp; About
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setEditingCategory(null);
              setCatDrawerOpen(true);
            }}
            className="gap-1.5"
          >
            <FolderPlus className="h-3.5 w-3.5" />
            New Collection
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              setEditingEntry(null);
              setEntryDrawerOpen(true);
            }}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            New Entry
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-[var(--hof-danger-bg)] px-4 py-3 text-sm text-[var(--danger)]">
          {error}
        </div>
      )}

      {loading ? (
        <p className="animate-pulse text-sm text-[var(--hof-muted)]">Loading dashboard...</p>
      ) : (
        <>
          {/* Entries Section */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--hof-text)]">
                Entries ({filteredEntries.length})
              </h2>
              <div className="flex flex-wrap items-center gap-2.5">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search entries..."
                  className="h-9 w-52 text-xs"
                />
                <select
                  value={catFilter}
                  onChange={(e) => setCatFilter(e.target.value)}
                  className="h-9 rounded-lg border border-[var(--hof-border-subtle)] bg-[var(--hof-card)] px-3 text-xs text-[var(--hof-text)]"
                >
                  <option value="all">All collections</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {entries.length > 0 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={savingOrder}
                    onClick={handleSaveEntryRanks}
                  >
                    Save Ranks
                  </Button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[var(--hof-border-subtle)] bg-[var(--hof-surface)]">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[var(--hof-border-subtle)] text-[11px] font-bold uppercase tracking-wider text-[var(--hof-muted)]">
                  <tr>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Collection</th>
                    <th className="px-4 py-3">Tier</th>
                    <th className="px-4 py-3">Rating</th>
                    <th className="px-4 py-3">Rank</th>
                    <th className="px-4 py-3">Featured</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--hof-border-subtle)]">
                  {filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-xs text-[var(--hof-muted)]">
                        No matching entries.
                      </td>
                    </tr>
                  ) : (
                    filteredEntries.map((e) => (
                      <tr key={e.id} className="hover:bg-[var(--hof-card)]/40">
                        <td className="px-4 py-3 font-medium text-[var(--hof-text)]">
                          <Link to={`/entry/${e.slug}`} className="hover:underline">
                            {e.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--hof-muted)]">
                          {e.categoryName}
                        </td>
                        <td className="px-4 py-3">
                          <Badge>{e.tier}</Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--hof-text-soft)]">
                          {e.rating != null ? `${e.rating}/10` : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min={0}
                            value={rankDraft[e.id] ?? e.rankOrder}
                            onChange={(ev) =>
                              setRankDraft((prev) => ({
                                ...prev,
                                [e.id]: Number(ev.target.value) || 0,
                              }))
                            }
                            className="h-8 w-16 rounded border border-[var(--hof-border-subtle)] bg-[var(--hof-card)] px-2 text-xs text-[var(--hof-text)]"
                            aria-label={`Rank order for ${e.title}`}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => void handleToggleFeatured(e)}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                              e.featured
                                ? "bg-[var(--hof-accent-deep)] text-[var(--hof-text)]"
                                : "bg-[var(--hof-card)] text-[var(--hof-muted)]"
                            }`}
                            aria-label={`Toggle featured for ${e.title}`}
                          >
                            <Star className="h-3 w-3" />
                            {e.featured ? "Featured" : "Standard"}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => void handleEditEntry(e.slug)}
                              aria-label={`Edit ${e.title}`}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            {confirmDeleteEntryId === e.id ? (
                              <>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="danger"
                                  onClick={() => void handleDeleteEntry(e.id)}
                                >
                                  Confirm
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setConfirmDeleteEntryId(null)}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => setConfirmDeleteEntryId(e.id)}
                                className="text-[var(--danger)] hover:bg-[var(--hof-danger-bg)]"
                                aria-label={`Delete ${e.title}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Collections Section */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--hof-text)]">
                Collections ({categories.length})
              </h2>
              {categories.length > 0 && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={savingOrder}
                  onClick={handleSaveCategoryOrder}
                >
                  Save Folder Order
                </Button>
              )}
            </div>

            <div className="overflow-x-auto rounded-xl border border-[var(--hof-border-subtle)] bg-[var(--hof-surface)]">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[var(--hof-border-subtle)] text-[11px] font-bold uppercase tracking-wider text-[var(--hof-muted)]">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Entries</th>
                    <th className="px-4 py-3">Order</th>
                    <th className="px-4 py-3">Art Seed</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--hof-border-subtle)]">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-[var(--hof-card)]/40">
                      <td className="px-4 py-3 font-medium text-[var(--hof-text)]">
                        <Link to={`/collections/${cat.slug}`} className="hover:underline">
                          {cat.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--hof-muted)]">
                        {cat.entryCount}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min={0}
                          value={catOrderDraft[cat.id] ?? cat.sortOrder}
                          onChange={(ev) =>
                            setCatOrderDraft((prev) => ({
                              ...prev,
                              [cat.id]: Number(ev.target.value) || 0,
                            }))
                          }
                          className="h-8 w-16 rounded border border-[var(--hof-border-subtle)] bg-[var(--hof-card)] px-2 text-xs text-[var(--hof-text)]"
                          aria-label={`Sort order for ${cat.name}`}
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[var(--hof-muted)]">
                        #{cat.artSeed}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingCategory(cat);
                              setCatDrawerOpen(true);
                            }}
                            aria-label={`Edit ${cat.name}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          {confirmDeleteCatId === cat.id ? (
                            <>
                              <Button
                                type="button"
                                size="sm"
                                variant="danger"
                                onClick={() => void handleDeleteCategory(cat.id)}
                              >
                                Confirm
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => setConfirmDeleteCatId(null)}
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => setConfirmDeleteCatId(cat.id)}
                              className="text-[var(--danger)] hover:bg-[var(--hof-danger-bg)]"
                              aria-label={`Delete ${cat.name}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <EntryFormDrawer
        open={entryDrawerOpen}
        onClose={() => setEntryDrawerOpen(false)}
        categories={categories}
        entry={editingEntry}
        onSaved={() => void loadAll()}
      />
      <CategoryFormDrawer
        open={catDrawerOpen}
        onClose={() => setCatDrawerOpen(false)}
        category={editingCategory}
        onSaved={() => void loadAll()}
      />
      <SiteSettingsDrawer
        open={siteDrawerOpen}
        onClose={() => setSiteDrawerOpen(false)}
        focusSection="hero"
      />
    </div>
  );
}
