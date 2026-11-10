import { useEffect, useSyncExternalStore } from "react";
import type { Styles } from "../types";
import {
  applyUpdate,
  dismissOfflineReady,
  dismissUpdate,
  getServiceWorkerStatus,
  startServiceWorker,
  subscribeServiceWorker,
} from "../utils/serviceWorker";
import Icon from "./Icon";

interface UpdateBannerProps {
  S: Styles;
}

/** Tells the user when a new version is waiting, and when the app is ready to run offline. */
export default function UpdateBanner({ S }: UpdateBannerProps) {
  const status = useSyncExternalStore(subscribeServiceWorker, getServiceWorkerStatus);

  useEffect(() => {
    startServiceWorker();
  }, []);

  useEffect(() => {
    if (!status.offlineReady) return;
    const timer = window.setTimeout(dismissOfflineReady, 6000);
    return () => window.clearTimeout(timer);
  }, [status.offlineReady]);

  if (!status.updateReady && !status.offlineReady) return null;

  const shell = {
    maxWidth: "1100px",
    margin: "12px auto 0",
    padding: "0 20px",
  } as const;
  const card = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    background: S.card.background,
    border: `1px solid ${S.meta.accent}`,
    borderRadius: "16px",
    padding: "12px 14px",
    boxShadow: S.meta.shadowSm,
    fontSize: "13px",
    color: S.meta.textHeading,
  } as const;
  const button = { ...S.expandAllBtn, marginRight: 0, padding: "8px 14px", fontWeight: 700 } as const;

  if (status.updateReady) {
    return (
      <div className="update-banner no-print" style={shell} role="status" aria-live="polite">
        <div style={card}>
          <Icon name="refresh" size={18} style={{ color: S.meta.accent }} />
          <span style={{ flex: "1 1 180px", lineHeight: 1.5 }}>
            <strong>A new version of PharmRef is ready.</strong> Updating reloads the app; calculator entries on this screen will be cleared.
          </span>
          <button type="button" style={{ ...button, background: S.meta.accent, color: S.meta.onAccent, borderColor: S.meta.accent }} onClick={() => void applyUpdate()}>
            Update now
          </button>
          <button type="button" style={button} onClick={dismissUpdate}>
            Later
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="update-banner no-print" style={shell} role="status" aria-live="polite">
      <div style={{ ...card, borderColor: S.meta.border }}>
        <Icon name="audit" size={18} style={{ color: S.meta.accent }} />
        <span style={{ flex: 1, lineHeight: 1.5 }}>Saved for offline use. PharmRef will open without a connection.</span>
        <button type="button" style={button} onClick={dismissOfflineReady}>
          OK
        </button>
      </div>
    </div>
  );
}
