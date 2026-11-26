import * as React from "react";
import { api } from "./api";
import type { SiteSettings } from "./types";

interface SiteContextValue {
  site: SiteSettings | null;
  loading: boolean;
  error: string | null;
  refreshSite: () => Promise<void>;
}

const SiteContext = React.createContext<SiteContextValue | null>(null);

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [site, setSite] = React.useState<SiteSettings | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const refreshSite = React.useCallback(async () => {
    try {
      setError(null);
      const data = await api.getSite();
      setSite(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load site settings");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void refreshSite();
  }, [refreshSite]);

  React.useEffect(() => {
    if (site?.siteName) {
      document.title = site.siteName;
    }
  }, [site?.siteName]);

  const value = React.useMemo(
    () => ({ site, loading, error, refreshSite }),
    [site, loading, error, refreshSite],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = React.useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside SiteProvider");
  return ctx;
}
