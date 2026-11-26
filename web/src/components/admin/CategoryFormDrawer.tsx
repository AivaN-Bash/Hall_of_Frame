import * as React from "react";
import { api, ApiError } from "@/lib/api";
import type { Category } from "@/lib/types";
import { Drawer } from "./Drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CategoryFormDrawerProps {
  open: boolean;
  onClose: () => void;
  category?: Category | null;
  onSaved: (saved: Category) => void;
}

export function CategoryFormDrawer({
  open,
  onClose,
  category,
  onSaved,
}: CategoryFormDrawerProps) {
  const isEditing = Boolean(category);
  const [name, setName] = React.useState("");
  const [sortOrder, setSortOrder] = React.useState("0");
  const [artSeed, setArtSeed] = React.useState("7");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setError(null);
    if (category) {
      setName(category.name);
      setSortOrder(String(category.sortOrder));
      setArtSeed(String(category.artSeed));
    } else {
      setName("");
      setSortOrder("0");
      setArtSeed(String(Math.floor(Math.random() * 90) + 1));
    }
  }, [open, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      name: name.trim(),
      sortOrder: Number(sortOrder) || 0,
      artSeed: Math.max(1, Number(artSeed) || 1),
    };
    try {
      const saved =
        isEditing && category
          ? await api.updateCategory(category.id, payload)
          : await api.createCategory(payload);
      onSaved(saved);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={isEditing ? `Edit "${category?.name}"` : "New Collection"}
      description="Each folder uses its art seed for unique palette-matched marble art."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-[var(--hof-danger-bg)] px-4 py-3 text-xs text-[var(--danger)]">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--hof-text-soft)]">
            Collection Name *
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Music"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--hof-text-soft)]">
              Order
            </label>
            <Input
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--hof-text-soft)]">
              Art Seed
            </label>
            <Input
              type="number"
              min={1}
              value={artSeed}
              onChange={(e) => setArtSeed(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[var(--hof-border-subtle)] pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : isEditing ? "Save Changes" : "Create Collection"}
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
