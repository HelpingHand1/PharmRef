import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import { NAV_STATES } from "../styles/constants";
import type { NavigateTo, NavigateToData, NavStateKey } from "../types";

function stateToHash(
  navState: NavStateKey,
  diseaseId: string | null,
  subcategoryId: string | null,
  monographId: string | null,
): string {
  if (navState === "audit") return "#/audit";
  if (navState === NAV_STATES.CALCULATORS) return "#/calculators";
  if (navState === NAV_STATES.COMPARE) return "#/compare";
  if (navState === NAV_STATES.MONOGRAPH && diseaseId && monographId) return `#/${diseaseId}/drug/${monographId}`;
  if (navState === NAV_STATES.SUBCATEGORY && diseaseId && subcategoryId) return `#/${diseaseId}/${subcategoryId}`;
  if (navState === NAV_STATES.DISEASE_OVERVIEW && diseaseId) return `#/${diseaseId}`;
  return "#/";
}

function hashToState(hash: string): {
  nav: NavStateKey;
  diseaseId: string | null;
  subcategoryId: string | null;
  monographId: string | null;
} {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);

  if (parts.length === 0) {
    return { nav: NAV_STATES.HOME, diseaseId: null, subcategoryId: null, monographId: null };
  }

  if (parts[0] === "compare") {
    return { nav: NAV_STATES.COMPARE, diseaseId: null, subcategoryId: null, monographId: null };
  }

  if (parts[0] === "audit") {
    return { nav: "audit", diseaseId: null, subcategoryId: null, monographId: null };
  }

  if (parts[0] === "calculators") {
    return { nav: NAV_STATES.CALCULATORS, diseaseId: null, subcategoryId: null, monographId: null };
  }

  if (parts[1] === "drug" && parts[2]) {
    return {
      nav: NAV_STATES.MONOGRAPH,
      diseaseId: parts[0],
      subcategoryId: null,
      monographId: parts[2],
    };
  }

  if (parts[1]) {
    return {
      nav: NAV_STATES.SUBCATEGORY,
      diseaseId: parts[0],
      subcategoryId: parts[1],
      monographId: null,
    };
  }

  return {
    nav: NAV_STATES.DISEASE_OVERVIEW,
    diseaseId: parts[0],
    subcategoryId: null,
    monographId: null,
  };
}

function resolveId(
  explicitId: string | null | undefined,
  item: { id: string } | null | undefined,
  fallback: string | null,
): string | null {
  if (explicitId !== undefined) return explicitId;
  if (item !== undefined) return item?.id ?? null;
  return fallback;
}

export function useNavigation() {
  const [navState, setNavState] = useState<NavStateKey>(NAV_STATES.HOME);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [selectedMonographId, setSelectedMonographId] = useState<string | null>(null);
  const isHashNavigation = useRef(false);

  useEffect(() => {
    const applyHash = () => {
      isHashNavigation.current = true;
      const next = hashToState(window.location.hash || "#/");
      setNavState(next.nav);
      setSelectedDiseaseId(next.diseaseId);
      setSelectedSubcategoryId(next.subcategoryId);
      setSelectedMonographId(next.monographId);
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);

    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  useEffect(() => {
    if (isHashNavigation.current) {
      isHashNavigation.current = false;
      return;
    }

    const nextHash = stateToHash(navState, selectedDiseaseId, selectedSubcategoryId, selectedMonographId);
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
  }, [navState, selectedDiseaseId, selectedSubcategoryId, selectedMonographId]);

  const navigateTo = useCallback<NavigateTo>(
    (state: NavStateKey, data: NavigateToData = {}) => {
      startTransition(() => {
        setNavState(state);

        if (state === NAV_STATES.HOME || state === NAV_STATES.COMPARE || state === "audit" || state === NAV_STATES.CALCULATORS) {
          setSelectedDiseaseId(null);
          setSelectedSubcategoryId(null);
          setSelectedMonographId(null);
          window.scrollTo({ top: 0, behavior: "auto" });
          return;
        }

        const nextDiseaseId = resolveId(data.diseaseId, data.disease, selectedDiseaseId);
        const nextSubcategoryId =
          state === NAV_STATES.SUBCATEGORY
            ? resolveId(data.subcategoryId, data.subcategory, selectedSubcategoryId)
            : null;
        const nextMonographId =
          state === NAV_STATES.MONOGRAPH
            ? resolveId(data.monographId, data.monograph, selectedMonographId)
            : null;

        setSelectedDiseaseId(nextDiseaseId);
        setSelectedSubcategoryId(nextSubcategoryId);
        setSelectedMonographId(nextMonographId);
        window.scrollTo({ top: 0, behavior: "auto" });
      });
    },
    [selectedDiseaseId, selectedMonographId, selectedSubcategoryId],
  );

  return {
    navState,
    navigateTo,
    selectedDiseaseId,
    selectedMonographId,
    selectedSubcategoryId,
  };
}
