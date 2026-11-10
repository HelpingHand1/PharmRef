import { useEffect, useRef } from "react";
import { getAppHistory } from "../utils/browserHistory";

/**
 * While `active`, the browser/phone back action closes this layer (dialog,
 * sheet, search results) instead of leaving the page underneath it.
 */
export function useBackDismiss(active: boolean, onDismiss: () => void) {
  const dismissRef = useRef(onDismiss);

  useEffect(() => {
    dismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!active) return;
    return getAppHistory().openOverlay(() => dismissRef.current());
  }, [active]);
}
