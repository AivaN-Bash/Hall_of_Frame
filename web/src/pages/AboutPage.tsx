import * as React from "react";
import { Pencil } from "lucide-react";
import { SiteSettingsDrawer } from "@/components/admin/SiteSettingsDrawer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useSite } from "@/lib/site";

export default function AboutPage() {
  const { site, loading } = useSite();
  const { isAdmin } = useAuth();
  const [editOpen, setEditOpen] = React.useState(false);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="animate-pulse text-[var(--hof-muted)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="mb-10 flex items-center justify-between gap-4">
        <h1 className="font-display uppercase tracking-tight text-[var(--hof-text)]" style={{ fontSize: 'var(--hof-step-4)', lineHeight: 'var(--hof-leading-tight)' }}>
          About
        </h1>
        {isAdmin && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setEditOpen(true)}
            className="gap-1.5"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit About
          </Button>
        )}
      </div>

      <div className="space-y-8 text-[var(--hof-text-soft)]" style={{ fontSize: 'var(--hof-step-0)', lineHeight: 'var(--hof-leading-relaxed)' }}>
        {site?.aboutBio && (
          <section>
            <h2 className="section-label mb-3 text-[var(--hof-accent-light)]">
              About Me
            </h2>
            <p className="whitespace-pre-line">{site.aboutBio}</p>
          </section>
        )}

        {site?.aboutPurpose && (
          <section>
            <h2 className="section-label mb-3 text-[var(--hof-accent-light)]">
              Why This Site
            </h2>
            <p className="whitespace-pre-line">{site.aboutPurpose}</p>
          </section>
        )}

        {site?.currentlyWatchingPlaying && (
          <section>
            <h2 className="section-label mb-3 text-[var(--hof-accent-light)]">
              Currently
            </h2>
            <p className="whitespace-pre-line">{site.currentlyWatchingPlaying}</p>
          </section>
        )}
      </div>

      {isAdmin && (
        <SiteSettingsDrawer
          open={editOpen}
          onClose={() => setEditOpen(false)}
          focusSection="about"
        />
      )}
    </div>
  );
}
