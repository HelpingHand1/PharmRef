import { CopyBtnProps } from "../types";

export default function CopyBtn({ text, id, copiedId, onCopy, S }: CopyBtnProps) {
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
