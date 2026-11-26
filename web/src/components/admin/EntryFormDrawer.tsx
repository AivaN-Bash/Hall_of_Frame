import * as React from "react";
import { api, ApiError } from "@/lib/api";
import { useSite } from "@/lib/site";
import type { Category, EntryDetail, Tier } from "@/lib/types";
import { Drawer } from "./Drawer";
import { ImageUploadField } from "./ImageUploadField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EntryFormDrawerProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  initialCategoryId?: number;
  entry?: EntryDetail | null;
  onSaved: (saved: EntryDetail) => void;
}

const ACCENT_TOKENS = [
  "--hof-accent-light",
  "--hof-text",
  "--hof-text-soft",
  "--hof-muted",
  "--hof-accent",
];

const TIERS: Tier[] = ["S", "A", "B", "C"];

const TEXTAREA_CLASS =
  "w-full rounded-lg border border-[var(--hof-border-subtle)] bg-[var(--hof-card)] px-3 py-2 text-sm text-[var(--hof-text)] placeholder:text-[var(--hof-muted)] focus:border-[var(--hof-accent-light)] focus:outline-none";

const SELECT_CLASS =
  "h-10 w-full rounded-lg border border-[var(--hof-border-subtle)] bg-[var(--hof-card)] px-3 text-sm text-[var(--hof-text)] focus:border-[var(--hof-accent-light)] focus:outline-none";

export function EntryFormDrawer({
  open,
  onClose,
  categories,
  initialCategoryId,
  entry,
  onSaved,
}: EntryFormDrawerProps) {
  const { refreshSite } = useSite();
  const isEditing = Boolean(entry);

  const [categoryId, setCategoryId] = React.useState<number>(0);
  const [title, setTitle] = React.useState("");
  const [releaseYear, setReleaseYear] = React.useState("");
  const [posterUrl, setPosterUrl] = React.useState("");
  const [accentColor, setAccentColor] = React.useState("");
  const [tagline, setTagline] = React.useState("");
  const [rating, setRating] = React.useState("");
  const [tier, setTier] = React.useState<Tier>("S");
  const [whyHooked, setWhyHooked] = React.useState("");
  const [favoriteMoment, setFavoriteMoment] = React.useState("");
  const [favoriteQuoteOrChar, setFavoriteQuoteOrChar] = React.useState("");
  const [tagsText, setTagsText] = React.useState("");
  const [featured, setFeatured] = React.useState(false);
  const [rankOrder, setRankOrder] = React.useState("0");

  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setError(null);
    if (entry) {
      setCategoryId(entry.categoryId);
      setTitle(entry.title);
      setReleaseYear(entry.releaseYear ? String(entry.releaseYear) : "");
      setPosterUrl(entry.posterUrl || "");
      setAccentColor(entry.accentColor || "");
      setTagline(entry.tagline || "");
      setRating(entry.rating !== null ? String(entry.rating) : "");
      setTier(entry.tier);
      setWhyHooked(entry.whyHooked);
      setFavoriteMoment(entry.favoriteMoment || "");
      setFavoriteQuoteOrChar(entry.favoriteQuoteOrChar || "");
      setTagsText(entry.tags.map((t) => t.name).join(", "));
      setFeatured(entry.featured);
      setRankOrder(String(entry.rankOrder));
    } else {
      setCategoryId(initialCategoryId || categories[0]?.id || 0);
      setTitle("");
      setReleaseYear("");
      setPosterUrl("");
      const defaultAccent = getComputedStyle(document.documentElement)
        .getPropertyValue("--hof-accent-light")
        .trim();
      setAccentColor(defaultAccent || "");
      setTagline("");
      setRating("");
      setTier("S");
      setWhyHooked("");
      setFavoriteMoment("");
      setFavoriteQuoteOrChar("");
      setTagsText("");
      setFeatured(false);
      setRankOrder("0");
    }
  }, [open, entry, initialCategoryId, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      setError("Please select a category.");
      return;
    }
    setSaving(true);
    setError(null);

    const parsedYear = releaseYear.trim() ? Number(releaseYear) : null;
    const parsedRating = rating.trim() ? Number(rating) : null;
    const parsedRank = rankOrder.trim() ? Number(rankOrder) : 0;
    const tags = tagsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      categoryId,
      title: title.trim(),
      releaseYear: parsedYear,
      posterUrl: posterUrl.trim() || null,
      accentColor: accentColor.trim() || null,
      tagline: tagline.trim() || null,
      rating: parsedRating,
      tier,
      whyHooked: whyHooked.trim(),
      favoriteMoment: favoriteMoment.trim() || null,
      favoriteQuoteOrChar: favoriteQuoteOrChar.trim() || null,
      featured,
      rankOrder: Number.isFinite(parsedRank) ? parsedRank : 0,
      tags,
    };

    try {
      const saved = isEditing && entry
        ? await api.updateEntry(entry.id, payload)
        : await api.createEntry(payload);
      await refreshSite();
      onSaved(saved);
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        const fieldMsg = err.fieldErrors
          ? Object.values(err.fieldErrors).join(" · ")
          : "";
        setError(fieldMsg || err.message);
      } else {
        setError("Failed to save entry.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEditing ? `Edit "${entry?.title}"` : "New Entry"}
      description="Changes appear on the public site immediately."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-[var(--hof-danger-bg)] px-4 py-3 text-xs text-[var(--danger)]">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--hof-text-soft)]">
              Title *
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. DARK"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--hof-text-soft)]">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className={SELECT_CLASS}
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--hof-text-soft)]">
              Year
            </label>
            <Input
              type="number"
              min={1888}
              max={2100}
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              placeholder="2017"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--hof-text-soft)]">
              Tier *
            </label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value as Tier)}
              className={SELECT_CLASS}
            >
              {TIERS.map((t) => (
                <option key={t} value={t}>
                  Tier {t}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--hof-text-soft)]">
              Rating (0–10)
            </label>
            <Input
              type="number"
              step="0.1"
              min={0}
              max={10}
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="9.8"
            />
          </div>
        </div>

        <ImageUploadField
          label="Poster (upload or URL)"
          value={posterUrl}
          onChange={setPosterUrl}
        />

        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--hof-text-soft)]">
            Accent Colour
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              placeholder="#a678a2"
              className="w-32 font-mono text-xs"
            />
            {ACCENT_TOKENS.map((token) => (
              <button
                key={token}
                type="button"
                title={token}
                onClick={() => {
                  const val = getComputedStyle(document.documentElement)
                    .getPropertyValue(token)
                    .trim();
                  if (val) setAccentColor(val);
                }}
                className="h-7 w-7 rounded-full border border-[var(--hof-border-subtle)] transition-transform hover:scale-110"
                style={{ backgroundColor: `var(${token})` }}
                aria-label={`Use palette color ${token}`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--hof-text-soft)]">
            Tagline
          </label>
          <Input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="One-line hook"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--hof-text-soft)]">
            Why it hooked me *
          </label>
          <textarea
            rows={5}
            value={whyHooked}
            onChange={(e) => setWhyHooked(e.target.value)}
            placeholder="Write what stayed with you..."
            className={TEXTAREA_CLASS}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--hof-text-soft)]">
            Favorite moment (spoiler-blurred)
          </label>
          <textarea
            rows={3}
            value={favoriteMoment}
            onChange={(e) => setFavoriteMoment(e.target.value)}
            placeholder="Blurred until the visitor clicks Reveal..."
            className={TEXTAREA_CLASS}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--hof-text-soft)]">
            Favorite character or quote
          </label>
          <textarea
            rows={2}
            value={favoriteQuoteOrChar}
            onChange={(e) => setFavoriteQuoteOrChar(e.target.value)}
            placeholder="Character name or memorable quote"
            className={TEXTAREA_CLASS}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--hof-text-soft)]">
              Tags (comma-separated)
            </label>
            <Input
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="mystery, sci-fi, time-loop"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--hof-text-soft)]">
              Rank order
            </label>
            <Input
              type="number"
              min={0}
              value={rankOrder}
              onChange={(e) => setRankOrder(e.target.value)}
            />
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 self-end pb-2 text-sm text-[var(--hof-text)]">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 accent-[var(--hof-accent-light)]"
            />
            Featured in Hero grid
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[var(--hof-border-subtle)] pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Entry"}
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
