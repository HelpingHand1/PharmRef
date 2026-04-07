import { ToastProps } from "../types";

export default function Toast({ toast, S }: ToastProps) {
  if (!toast) return null;
  return (
    <div
      className={`pr-toast no-print ${toast.leaving ? "leaving" : ""}`}
      style={S.toast}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span style={{ fontSize: "16px" }} aria-hidden="true">{toast.icon}</span>
      <span>{toast.message}</span>
    </div>
  );
}
