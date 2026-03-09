import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import { DISEASE_BY_ID, MONOGRAPH_LOOKUP, SUBCATEGORY_BY_DISEASE_ID } from "../data/derived";
import { NAV_STATES } from "../styles/constants";
import type { DiseaseState, DrugMonograph, MonographLookupResult, NavStateKey, Subcategory } from "../types";

function stateToHash(
  navState: NavStateKey,
  disease: DiseaseState | null,
  subcategory: Subcategory | null,
  monograph: DrugMonograph | null,
): string {
  if (navState === "audit") return "#/audit";
  if (navState === NAV_STATES.CALCULATORS) return "#/calculators";
  if (navState === NAV_STATES.COMPARE) return "#/compare";
  if (navState === NAV_STATES.MONOGRAPH && disease && monograph) return `#/${disease.id}/drug/${monograph.id}`;
  if (navState === NAV_STATES.SUBCATEGORY && disease && subcategory) return `#/${disease.id}/${subcategory.id}`;
  if (navState === NAV_STATES.DISEASE_OVERVIEW && disease) return `#/${disease.id}`;
  return "#/";
}

function hashToState(hash: string): {
  nav: NavStateKey;
  disease: DiseaseState | null;
  subcategory: Subcategory | null;
  monograph: DrugMonograph | null;
} {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);

  if (parts.length === 0) {
    return { nav: NAV_STATES.HOME, disease: null, subcategory: null, monograph: null };
  }

  if (parts[0] === "compare") {
    return { nav: NAV_STATES.COMPARE, disease: null, subcategory: null, monograph: null };
  }

  if (parts[0] === "audit") {
    return { nav: "audit", disease: null, subcategory: null, monograph: null };
  }

  if (parts[0] === "calculators") {
    return { nav: NAV_STATES.CALCULATORS, disease: null, subcategory: null, monograph: null };
  }

  const disease = DISEASE_BY_ID[parts[0]] ?? null;
  if (!disease) {
    return { nav: NAV_STATES.HOME, disease: null, subcategory: null, monograph: null };
  }

  if (parts.length === 1) {
    return { nav: NAV_STATES.DISEASE_OVERVIEW, disease, subcategory: null, monograph: null };
  }

  if (parts[1] === "drug" && parts[2]) {
    const monograph = MONOGRAPH_LOOKUP[parts[2]]?.disease.id === disease.id ? MONOGRAPH_LOOKUP[parts[2]].monograph : null;
    if (monograph) {
      return { nav: NAV_STATES.MONOGRAPH, disease, subcategory: null, monograph };
    }
  }

  const subcategory = SUBCATEGORY_BY_DISEASE_ID[disease.id]?.[parts[1]] ?? null;
  if (subcategory) {
    return { nav: NAV_STATES.SUBCATEGORY, disease, subcategory, monograph: null };
  }

  return { nav: NAV_STATES.DISEASE_OVERVIEW, disease, subcategory: null, monograph: null };
}

export function useNavigation() {
  const [navState, setNavState] = useState<NavStateKey>(NAV_STATES.HOME);
  const [selectedDisease, setSelectedDisease] = useState<DiseaseState | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [selectedMonograph, setSelectedMonograph] = useState<DrugMonograph | null>(null);
  const isHashNavigation = useRef(false);

  useEffect(() => {
    const applyHash = () => {
      isHashNavigation.current = true;
      const next = hashToState(window.location.hash || "#/");
      setNavState(next.nav);
      setSelectedDisease(next.disease);
      setSelectedSubcategory(next.subcategory);
      setSelectedMonograph(next.monograph);
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

    const nextHash = stateToHash(navState, selectedDisease, selectedSubcategory, selectedMonograph);
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
  }, [navState, selectedDisease, selectedSubcategory, selectedMonograph]);

  const navigateTo = useCallback(
    (
      state: NavStateKey,
      data: Partial<MonographLookupResult> & { subcategory?: Subcategory } = {},
    ) => {
      startTransition(() => {
        setNavState(state);

        if (state === NAV_STATES.HOME || state === NAV_STATES.COMPARE || state === "audit" || state === NAV_STATES.CALCULATORS) {
          setSelectedDisease(null);
          setSelectedSubcategory(null);
          setSelectedMonograph(null);
        }

        if (data.disease !== undefined) {
          setSelectedDisease(data.disease ?? null);
        } else if (state === NAV_STATES.DISEASE_OVERVIEW) {
          setSelectedDisease(selectedDisease);
        }

        if (state === NAV_STATES.DISEASE_OVERVIEW) {
          setSelectedSubcategory(null);
          setSelectedMonograph(null);
        }

        if (data.subcategory !== undefined) {
          setSelectedSubcategory(data.subcategory ?? null);
        } else if (state !== NAV_STATES.SUBCATEGORY) {
          setSelectedSubcategory(null);
        }

        if (data.monograph !== undefined) {
          setSelectedMonograph(data.monograph ?? null);
        } else if (state !== NAV_STATES.MONOGRAPH) {
          setSelectedMonograph(null);
        }

        window.scrollTo({ top: 0, behavior: "auto" });
      });
    },
    [selectedDisease],
  );

  return {
    navState,
    navigateTo,
    selectedDisease,
    selectedMonograph,
    selectedSubcategory,
  };
}
