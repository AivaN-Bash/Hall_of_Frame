import * as React from "react";
import { Link } from "react-router-dom";
import { FolderPlus, Settings2 } from "lucide-react";
import HelixRibbonHero, { type HelixProject } from "@/components/home/HelixRibbonHero";
import GlassFolder, { HOF_FOLDER_ART, type FolderFile } from "@/components/home/GlassFolder";
import { EntryFormDrawer } from "@/components/admin/EntryFormDrawer";
import { CategoryFormDrawer } from "@/components/admin/CategoryFormDrawer";
import { SiteSettingsDrawer } from "@/components/admin/SiteSettingsDrawer";
import { Button } from "@/components/ui/button";
import { api, resolveAssetUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useSite } from "@/lib/site";
import type { Category, EntrySummary } from "@/lib/types";

export default function HomePage() {
  const { site, loading: siteLoading } = useSite();
  const { isAdmin } = useAuth();

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [entries, setEntries] = React.useState<EntrySummary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [entryDrawerOpen, setEntryDrawerOpen] = React.useState(false);
  const [entryDrawerCatId, setEntryDrawerCatId] = React.useState<number | undefined>();
  const [catDrawerOpen, setCatDrawerOpen] = React.useState(false);
  const [siteDrawerOpen, setSiteDrawerOpen] = React.useState(false);

  const loadData = React.useCallback(async () => {
    try {
      const [cats, allEntries] = await Promise.all([
        api.getCategories(),
        api.getEntries({ sort: "rank" }),
      ]);
      setCategories(cats);
      setEntries(allEntries);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load content");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  const heroProjects: HelixProject[] = React.useMemo(() => {
    const heroOrder = ["dark", "frieren", "queen", "metaphor", "vinland", "catch-me"];
    const rankOf = (slug: string) => {
      const idx = heroOrder.findIndex((key) => slug.toLowerCase().includes(key));
      return idx === -1 ? heroOrder.length : idx;
    };
    const paletteFor = (slug: string): string | undefined => {
      const s = slug.toLowerCase();
      if (s.includes("dark")) return "linear-gradient(135deg, #f5c518 0%, #d94e34 45%, #5a8f94 78%, #f5c518 100%)";
      if (s.includes("frieren")) return "linear-gradient(135deg, #f0f2f5 0%, #7ec8f8 45%, #e9c46a 78%, #f0f2f5 100%)";
      if (s.includes("queen")) return "linear-gradient(135deg, #f5ebd6 0%, #e07a38 45%, #2a9d8f 78%, #f5ebd6 100%)";
      if (s.includes("metaphor")) return "linear-gradient(135deg, #f3c64f 0%, #e63946 45%, #4ea8de 78%, #f3c64f 100%)";
      if (s.includes("vinland")) return "linear-gradient(135deg, #eab64d 0%, #8ecae6 45%, #52b788 78%, #eab64d 100%)";
      if (s.includes("catch-me")) return "linear-gradient(135deg, #f26a36 0%, #f5f3f1 45%, #5fa8d3 78%, #f26a36 100%)";
      if (s.includes("abyss")) return "linear-gradient(135deg, #f4d35e 0%, #38d9a9 45%, #c77dff 78%, #f4d35e 100%)";
      if (s.includes("persona")) return "linear-gradient(135deg, #ffe119 0%, #ff9f1c 45%, #d8e2dc 78%, #ffe119 100%)";
      return undefined;
    };
    const featured = entries.filter((e) => e.featured);
    const nonFeatured = entries.filter((e) => !e.featured);
    const ordered = [...featured, ...nonFeatured]
      .sort((a, b) => rankOf(a.slug) - rankOf(b.slug))
      .slice(0, 12);
    return ordered.map((e) => ({
      src: resolveAssetUrl(e.posterUrl),
      title: e.title,
      href: `/entry/${e.slug}`,
      accent: e.accentColor || undefined,
      gradient: paletteFor(e.slug),
    }));
  }, [entries]);

  if (loading || siteLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="animate-pulse text-sm text-[var(--hof-muted)]">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-sm text-[var(--danger)]">{error}</p>
      </div>
    );
  }

  const totalCount = site?.entryCount ?? entries.length;
  const countLabel = `( ${totalCount} ${totalCount === 1 ? "entry" : "entries"} )`;

  return (
    <div className="pb-20">
      <HelixRibbonHero
        showNav={false}
        greeting={site?.greeting || "Hey, I'm"}
        name={site?.heroName || "Phawat"}
        portrait={site?.portraitUrl ? resolveAssetUrl(site.portraitUrl) : undefined}
        portraitAlt={site?.heroName || "Portrait"}
        bio={
          site?.heroBio ||
          "My personal archive of films, series, anime, games, and music worth remembering."
        }
        count={countLabel}
        projects={heroProjects}
        background="var(--hof-bg)"
        foreground="var(--hof-text)"
      />

      {/* Collections Section */}
      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6">
        <div className="mb-12 flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--hof-border-subtle)] pb-4">
          <div>
            <h2
              className="font-display uppercase tracking-normal text-[var(--hof-text)]"
              style={{ fontSize: "var(--hof-step-3)", lineHeight: "var(--hof-leading-tight)" }}
            >
              Collections
            </h2>
            <p
              className="mt-1.5 text-[var(--hof-muted)]"
              style={{ fontSize: "var(--hof-step--1)", lineHeight: "var(--hof-leading-body)" }}
            >
              Open a folder to fan out its entries, or browse a full category.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {isAdmin && (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setSiteDrawerOpen(true)}
                  className="gap-1.5"
                >
                  <Settings2 className="h-3.5 w-3.5" />
                  Edit Hero
                </Button>
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
              </>
            )}
            <Link
              to="/collections"
              className="text-xs font-semibold uppercase tracking-wider text-[var(--hof-accent-light)] transition-colors hover:text-[var(--hof-text)]"
            >
              See all collections &rarr;
            </Link>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-[var(--hof-border-subtle)] bg-[var(--hof-surface)] px-6 py-12 text-center">
            <p className="text-base font-semibold text-[var(--hof-text)]">Nothing here yet.</p>
            <p className="mt-2 text-sm text-[var(--hof-muted)]">
              {isAdmin
                ? "Create your first folder above, then add your first entry with the + on a folder."
                : "No collections have been published yet."}
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
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-base font-semibold tracking-[0.03em] text-[var(--hof-text-soft)] transition-colors hover:text-[var(--hof-accent-light)] sm:text-sm sm:px-2 sm:py-1.5"
                  >
                    Browse {cat.name} &rarr;
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {totalCount === 0 && categories.length > 0 && (
          <div className="mx-auto mt-12 max-w-md rounded-2xl border border-[var(--hof-border-subtle)] bg-[var(--hof-surface)] px-6 py-8 text-center">
            <p className="text-sm font-medium text-[var(--hof-text)]">No entries yet.</p>
            <p className="mt-1.5 text-xs text-[var(--hof-muted)]">
              {isAdmin
                ? "Add your first entry with the + on a folder."
                : "Check back soon for new additions."}
            </p>
          </div>
        )}
      </section>

      {isAdmin && (
        <>
          <EntryFormDrawer
            open={entryDrawerOpen}
            onClose={() => setEntryDrawerOpen(false)}
            categories={categories}
            initialCategoryId={entryDrawerCatId}
            onSaved={() => void loadData()}
          />
          <CategoryFormDrawer
            open={catDrawerOpen}
            onClose={() => setCatDrawerOpen(false)}
            onSaved={() => void loadData()}
          />
          <SiteSettingsDrawer
            open={siteDrawerOpen}
            onClose={() => setSiteDrawerOpen(false)}
            focusSection="hero"
          />
        </>
      )}
    </div>
  );
}
