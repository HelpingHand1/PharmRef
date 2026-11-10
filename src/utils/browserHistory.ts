import { createAppHistory, type AppHistory } from "./appHistory";

let browserHistory: AppHistory | null = null;

/** The app history bound to the real window. */
export function getAppHistory(): AppHistory {
  if (!browserHistory) {
    browserHistory = createAppHistory({
      history: window.history,
      getHash: () => window.location.hash,
      getScrollY: () => window.scrollY,
      onPopState: (listener) => {
        window.addEventListener("popstate", listener);
        return () => window.removeEventListener("popstate", listener);
      },
      // Long enough for React to commit the open/close that triggered it.
      defer: (callback) => window.setTimeout(callback, 60),
    });
  }
  return browserHistory;
}
