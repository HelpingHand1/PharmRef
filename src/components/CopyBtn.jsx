import React from "react";

export default function CopyBtn({ text, id, copiedId, onCopy, S }) {
  return (
    <button
      className="copy-btn"
      style={S.copyBtn}
      onClick={(e) => { e.stopPropagation(); onCopy(text, id); }}
      title="Copy to clipboard"
    >
      {copiedId === id ? "✓" : "⎘"}
    </button>
  );
}