import * as React from "react";
import { api, ApiError } from "@/lib/api";
import { useSite } from "@/lib/site";
import { Drawer } from "./Drawer";
import { ImageUploadField } from "./ImageUploadField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SiteSettingsDrawerProps {
  open: boolean;
  onClose: () => void;
  focusSection?: "hero" | "about";
}

const TEXTAREA_CLASS =
  "w-full rounded-lg border border-[var(--hof-border-subtle)] bg-[var(--hof-card)] px-3 py-2 text-sm text-[var(--hof-text)] placeholder:text-[var(--hof-muted)] focus:border-[var(--hof-accent-light)] focus:outline-none";

export function SiteSettingsDrawer({
  open,
  onClose,
  focusSection = "hero",
}: SiteSettingsDrawerProps) {
  const { site, refreshSite } = useSite();

  const [siteName, setSiteName] = React.useState("");
  const [greeting, setGreeting] = React.useState("");
  const [heroName, setHeroName] = React.useState("");
  const [heroBio, setHeroBio] = React.useState("");
  const [portraitUrl, setPortraitUrl] = React.useState("");
  const [aboutBio, setAboutBio] = React.useState("");
  const [aboutPurpose, setAboutPurpose] = React.useState("");
  const [currentlyWatchingPlaying, setCurrentlyWatchingPlaying] = React.useState("");

  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open || !site) return;
    setError(null);
    setSiteName(site.siteName);
    setGreeting(site.greeting);
    setHeroName(site.heroName);
    setHeroBio(site.heroBio);
    setPortraitUrl(site.portraitUrl || "");
    setAboutBio(site.aboutBio);
    setAboutPurpose(site.aboutPurpose);
    setCurrentlyWatchingPlaying(site.currentlyWatchingPlaying);
  }, [open, site]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await api.updateSite({
        siteName: siteName.trim(),
        greeting: greeting.trim(),
        heroName: heroName.trim(),
        heroBio: heroBio.trim(),
        portraitUrl: portraitUrl.trim(),
        aboutBio: aboutBio.trim(),
        aboutPurpose: aboutPurpose.trim(),
        currentlyWatchingPlaying: currentlyWatchingPlaying.trim(),
      });
      await refreshSite();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update site settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={focusSection === "about" ? "Edit About Page" : "Edit Hero & Site Settings"}
      description="Updates the global nav, home hero, and About page."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-[var(--hof-danger-bg)] px-4 py-3 text-xs text-[var(--danger)]">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <h3 className="border-b border-[var(--hof-border-subtle)] pb-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[var(--hof-accent-light)]">
            Hero &amp; Identity
          </h3>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--hof-text-soft)]">
              Site Name *
            </label>
            <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--hof-text-soft)]">
                Greeting *
              </label>
              <Input value={greeting} onChange={(e) => setGreeting(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--hof-text-soft)]">
                Hero Name *
              </label>
              <Input value={heroName} onChange={(e) => setHeroName(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--hof-text-soft)]">
              Hero Bio *
            </label>
            <textarea
              rows={2}
              value={heroBio}
              onChange={(e) => setHeroBio(e.target.value)}
              className={TEXTAREA_CLASS}
              required
            />
          </div>
          <ImageUploadField
            label="Portrait (upload or URL)"
            value={portraitUrl}
            onChange={setPortraitUrl}
          />
        </div>

        <div className="space-y-4">
          <h3 className="border-b border-[var(--hof-border-subtle)] pb-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[var(--hof-accent-light)]">
            About Page
          </h3>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--hof-text-soft)]">
              About Me *
            </label>
            <textarea
              rows={3}
              value={aboutBio}
              onChange={(e) => setAboutBio(e.target.value)}
              className={TEXTAREA_CLASS}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--hof-text-soft)]">
              Why This Site *
            </label>
            <textarea
              rows={3}
              value={aboutPurpose}
              onChange={(e) => setAboutPurpose(e.target.value)}
              className={TEXTAREA_CLASS}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--hof-text-soft)]">
              Currently Watching / Playing *
            </label>
            <textarea
              rows={2}
              value={currentlyWatchingPlaying}
              onChange={(e) => setCurrentlyWatchingPlaying(e.target.value)}
              className={TEXTAREA_CLASS}
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[var(--hof-border-subtle)] pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
