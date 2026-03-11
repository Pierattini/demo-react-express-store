import { useContext } from "react";
import { SiteConfigContext } from "../context/SiteConfigProvider";

export function useSiteConfig() {
  return useContext(SiteConfigContext);
}