import * as React from "react";
import { Link } from "react-router-dom";
import { FolderPlus } from "lucide-react";
import GlassFolder, { HOF_FOLDER_ART, type FolderFile } from "@/components/home/GlassFolder";
import { EntryFormDrawer } from "@/components/admin/EntryFormDrawer";
import { CategoryFormDrawer } from "@/components/admin/CategoryFormDrawer";
import { Button } from "@/components/ui/button";
import { api, resolveAssetUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Category } from "@/lib/types";

export default function CollectionsPage() {
  const { isAdmin } = useAuth();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [entryDrawerOpen, setEntryDrawerOpen] = React.useState(false);
  const [entryDrawerCatId, setEntryDrawerCatId] = React.useState<number | undefined>();
  const [catDrawerOpen, setCatDrawerOpen] = React.useState(false);

  const loadCategories = React.useCallback(async () => {
    try {
      const cats = await api.getCategories();
      setCategories(cats);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load collections");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="animate-pulse text-sm text-[var(--hof-muted)]">Loading collections...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-[var(--danger)]">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="mb-12 flex flex-col items-center gap-4 text-center">
        <h1 className="font-display text-4xl uppercase tracking-tight text-[var(--hof-text)] sm:text-5xl">
          Collections
        </h1>
        <p className="text-sm text-[var(--hof-muted)]">
          Click a folder to fan out its highlights, or open the full category.
        </p>
        {isAdmin && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setCatDrawerOpen(true)}
            className="gap-1.5"
          >
            <FolderPlus className="h-3.5 w-3.5" />
            New Folder
          </Button>
        )}
      </div>

      {categories.length === 0 ? (
        <div className="mx-auto max-w-md rounded-2xl border border-[var(--hof-border-subtle)] bg-[var(--hof-surface)] px-6 py-12 text-center">
          <p className="text-sm text-[var(--hof-muted)]">
            {isAdmin ? "No collections yet. Click New Folder above." : "No collections yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 justify-items-center gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, idx) => {
            const files: FolderFile[] = cat.entries.map((entry) => ({
              name: entry.title,
              meta: `${entry.tier}${entry.releaseYear ? ` · ${entry.releaseYear}` : ""}`,
              image: entry.posterUrl ? resolveAssetUrl(entry.posterUrl) : undefined,
              href: `/entry/${entry.slug}`,
            }));
            const folderKey = `${cat.id}-${cat.entryCount}-${cat.entries.map((e) => e.id).join(",")}`;

            return (
              <div key={cat.id} className="flex flex-col items-center gap-4">
                <GlassFolder
                  key={folderKey}
                  label={cat.name}
                  meta={`${cat.entryCount} ${cat.entryCount === 1 ? "entry" : "entries"}`}
                  tone="dark"
                  art={HOF_FOLDER_ART}
                  seed={cat.artSeed}
                  files={files}
                  action={isAdmin ? "add" : "none"}
                  onAddClick={() => {
                    setEntryDrawerCatId(cat.id);
                    setEntryDrawerOpen(true);
                  }}
                  width={310}
                  appearDelay={idx * 80}
                />
                <Link
                  to={`/collections/${cat.slug}`}
                  className="text-xs font-medium text-[var(--hof-muted)] transition-colors hover:text-[var(--hof-text)]"
                >
                  View all in {cat.name} ({cat.entryCount}) &rarr;
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {isAdmin && (
        <>
          <EntryFormDrawer
            open={entryDrawerOpen}
            onClose={() => setEntryDrawerOpen(false)}
            categories={categories}
            initialCategoryId={entryDrawerCatId}
            onSaved={() => void loadCategories()}
          />
          <CategoryFormDrawer
            open={catDrawerOpen}
            onClose={() => setCatDrawerOpen(false)}
            onSaved={() => void loadCategories()}
          />
        </>
      )}
    </div>
  );
}
