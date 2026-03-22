import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import { NAV_STATES } from "../styles/constants";
import type { BreakpointWorkspacePreset, NavigateTo, NavigateToData, NavStateKey } from "../types";
import { hashToState, resolveBreakpointPreset, stateToHash } from "../utils/navigationState";

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
  const [selectedPathogenId, setSelectedPathogenId] = useState<string | null>(null);
  const [selectedBreakpointPreset, setSelectedBreakpointPreset] = useState<BreakpointWorkspacePreset | null>(null);
  const isHashNavigation = useRef(false);

  useEffect(() => {
    const applyHash = () => {
      isHashNavigation.current = true;
      const next = hashToState(window.location.hash || "#/");
      setNavState(next.nav);
      setSelectedDiseaseId(next.diseaseId);
      setSelectedSubcategoryId(next.subcategoryId);
      setSelectedMonographId(next.monographId);
      setSelectedPathogenId(next.pathogenId);
      setSelectedBreakpointPreset(next.breakpointPreset);
      window.scrollTo({ top: 0, behavior: "auto" });
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

    const nextHash = stateToHash(
      navState,
      selectedDiseaseId,
      selectedSubcategoryId,
      selectedMonographId,
      selectedPathogenId,
      selectedBreakpointPreset,
    );
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
  }, [
    navState,
    selectedBreakpointPreset,
    selectedDiseaseId,
    selectedSubcategoryId,
    selectedMonographId,
    selectedPathogenId,
  ]);

  const navigateTo = useCallback<NavigateTo>(
    (state: NavStateKey, data: NavigateToData = {}) => {
      startTransition(() => {
        setNavState(state);

        if (state === NAV_STATES.HOME || state === NAV_STATES.COMPARE || state === "audit" || state === NAV_STATES.CALCULATORS) {
          setSelectedDiseaseId(null);
          setSelectedSubcategoryId(null);
          setSelectedMonographId(null);
          setSelectedPathogenId(null);
          setSelectedBreakpointPreset(null);
          window.scrollTo({ top: 0, behavior: "auto" });
          return;
        }

        if (state === NAV_STATES.PATHOGEN || state === NAV_STATES.BREAKPOINTS) {
          const nextPathogenId = resolveId(data.pathogenId, data.pathogen, selectedPathogenId);
          setSelectedDiseaseId(null);
          setSelectedSubcategoryId(null);
          setSelectedMonographId(null);
          setSelectedPathogenId(nextPathogenId);
          setSelectedBreakpointPreset(state === NAV_STATES.BREAKPOINTS ? resolveBreakpointPreset(data) : null);
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
        setSelectedPathogenId(null);
        setSelectedBreakpointPreset(null);
        window.scrollTo({ top: 0, behavior: "auto" });
      });
    },
    [selectedDiseaseId, selectedMonographId, selectedPathogenId, selectedSubcategoryId],
  );

  return {
    navState,
    navigateTo,
    selectedDiseaseId,
    selectedMonographId,
    selectedBreakpointPreset,
    selectedPathogenId,
    selectedSubcategoryId,
  };
}
