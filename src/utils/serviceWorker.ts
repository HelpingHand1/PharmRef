// ============================================================
// SERVICE WORKER LIFECYCLE
// ============================================================
// The app is used for whole shifts without a reload, so a new deploy must not
// swap files out from under a running session. A new version waits until the
// user accepts it; until then the old cache keeps serving a consistent app.
import { registerSW } from "virtual:pwa-register";

export interface ServiceWorkerStatus {
  /** A newer version is downloaded and waiting. */
  updateReady: boolean;
  /** Everything needed to run offline has just been cached. */
  offlineReady: boolean;
}

const UPDATE_CHECK_INTERVAL_MS = 60 * 60 * 1000;

let status: ServiceWorkerStatus = { updateReady: false, offlineReady: false };
let applyWaitingUpdate: ((reloadPage?: boolean) => Promise<void>) | null = null;
let started = false;
const listeners = new Set<() => void>();

function setStatus(patch: Partial<ServiceWorkerStatus>) {
  status = { ...status, ...patch };
  listeners.forEach((listener) => listener());
}

export function startServiceWorker() {
  if (started || typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  started = true;

  applyWaitingUpdate = registerSW({
    onNeedRefresh: () => setStatus({ updateReady: true }),
    onOfflineReady: () => setStatus({ offlineReady: true }),
    onRegisteredSW: (_url, registration) => {
      if (!registration) return;
      let lastCheck = Date.now();
      // An installed app can stay open for days; look for a new version when it comes back to the front.
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState !== "visible" || !navigator.onLine) return;
        if (Date.now() - lastCheck < UPDATE_CHECK_INTERVAL_MS) return;
        lastCheck = Date.now();
        registration.update().catch(() => {
          // Offline or blocked: try again next time.
        });
      });
    },
  });
}

export function subscribeServiceWorker(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getServiceWorkerStatus() {
  return status;
}

export function dismissOfflineReady() {
  setStatus({ offlineReady: false });
}

export function dismissUpdate() {
  setStatus({ updateReady: false });
}

/** Activate the waiting version and reload onto it. */
export function applyUpdate() {
  return applyWaitingUpdate?.(true) ?? Promise.resolve();
}
