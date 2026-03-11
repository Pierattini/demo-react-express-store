import { createContext, useEffect, useState } from "react";
import { getSiteConfig } from "../lib/site";
import type { SiteConfig } from "../types/SiteConfig";

type SiteConfigContextType = {
  site: SiteConfig | null;
  loading: boolean;
};

const SiteConfigContext = createContext<SiteConfigContextType>({
  site: null,
  loading: true
});

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {

  const [site, setSite] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSiteConfig()
      .then((data) => setSite(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SiteConfigContext.Provider value={{ site, loading }}>
      {children}
    </SiteConfigContext.Provider>
  );
}
