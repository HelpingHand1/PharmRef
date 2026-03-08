import React from "react";

export default function Toast({ toast, S }) {
  if (!toast) return null;
  return (
    <div className={`pr-toast no-print ${toast.leaving ? "leaving" : ""}`} style={S.toast}>
      <span style={{ fontSize: "16px" }}>{toast.icon}</span>
      <span>{toast.message}</span>
    </div>
  );
}