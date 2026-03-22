import { useCallback, useEffect } from "react";
import { NAV_STATES } from "../styles/constants";
import { usePersistedState } from "../utils/persistence";
import type { DiseaseState, DrugMonograph, NavigateTo, NavStateKey, PathogenReference, RecentView, Subcategory } from "../types";

const MAX_RECENTS = 6;

function upsertRecentView(current: RecentView[], nextItem: RecentView) {
  return [
    nextItem,
    ...current.filter((item) => {
      if (item.type !== nextItem.type) return true;
      if (item.type === "disease" && nextItem.type === "disease") return item.diseaseId !== nextItem.diseaseId;
      if (item.type === "subcategory" && nextItem.type === "subcategory") {
        return !(item.diseaseId === nextItem.diseaseId && item.subcategoryId === nextItem.subcategoryId);
      }
      if (item.type === "monograph" && nextItem.type === "monograph") {
        return !(item.diseaseId === nextItem.diseaseId && item.monographId === nextItem.monographId);
      }
      if (item.type === "pathogen" && nextItem.type === "pathogen") {
        return item.pathogenId !== nextItem.pathogenId;
      }
      return true;
    }),
  ].slice(0, MAX_RECENTS);
}

export function useRecentViews(
  navState: NavStateKey,
  selectedDisease: DiseaseState | null,
  selectedSubcategory: Subcategory | null,
  selectedMonograph: DrugMonograph | null,
  selectedPathogen: PathogenReference | null,
  navigateTo: NavigateTo,
) {
  const [recentViews, setRecentViews] = usePersistedState<RecentView[]>("recentViews", []);

  useEffect(() => {
    if (navState === NAV_STATES.DISEASE_OVERVIEW && selectedDisease) {
      setRecentViews((current) =>
        upsertRecentView(current, {
          type: "disease",
          diseaseId: selectedDisease.id,
          label: selectedDisease.name,
          meta: `${selectedDisease.subcategories.length} subcategories · ${selectedDisease.drugMonographs.length} monographs`,
          icon: selectedDisease.icon,
        }),
      );
    }

    if (navState === NAV_STATES.SUBCATEGORY && selectedDisease && selectedSubcategory) {
      setRecentViews((current) =>
        upsertRecentView(current, {
          type: "subcategory",
          diseaseId: selectedDisease.id,
          subcategoryId: selectedSubcategory.id,
          label: selectedSubcategory.name,
          meta: selectedDisease.name,
          icon: "📋",
        }),
      );
    }

    if (navState === NAV_STATES.MONOGRAPH && selectedDisease && selectedMonograph) {
      setRecentViews((current) =>
        upsertRecentView(current, {
          type: "monograph",
          diseaseId: selectedDisease.id,
          monographId: selectedMonograph.id,
          label: selectedMonograph.name,
          meta: selectedDisease.name,
          icon: "💊",
        }),
      );
    }

    if (navState === NAV_STATES.PATHOGEN && selectedPathogen) {
      setRecentViews((current) =>
        upsertRecentView(current, {
          type: "pathogen",
          pathogenId: selectedPathogen.id,
          label: selectedPathogen.name,
          meta: selectedPathogen.phenotype,
          icon: "🧬",
        }),
      );
    }
  }, [navState, selectedDisease, selectedMonograph, selectedPathogen, selectedSubcategory, setRecentViews]);

  const openRecent = useCallback(
    (recent: RecentView) => {
      if (recent.type === "disease") {
        navigateTo(NAV_STATES.DISEASE_OVERVIEW, { diseaseId: recent.diseaseId });
        return;
      }

      if (recent.type === "subcategory") {
        navigateTo(NAV_STATES.SUBCATEGORY, {
          diseaseId: recent.diseaseId,
          subcategoryId: recent.subcategoryId,
        });
        return;
      }

      if (recent.type === "pathogen") {
        navigateTo(NAV_STATES.PATHOGEN, {
          pathogenId: recent.pathogenId,
        });
        return;
      }

      navigateTo(NAV_STATES.MONOGRAPH, {
        diseaseId: recent.diseaseId,
        monographId: recent.monographId,
      });
    },
    [navigateTo],
  );

  return {
    openRecent,
    recentViews,
    setRecentViews,
  };
}
