import type { Styles } from "../types";

interface ExpandCollapseBarProps {
  onCollapse: () => void;
  onExpand: () => void;
  S: Styles;
}

export default function ExpandCollapseBar({ onCollapse, onExpand, S }: ExpandCollapseBarProps) {
  return (
    <div className="expand-bar" style={{ display: "flex", justifyContent: "flex-end", gap: "6px", marginBottom: "8px" }}>
      <button style={S.expandAllBtn} onClick={onExpand}>
        Expand All
      </button>
      <button style={S.expandAllBtn} onClick={onCollapse}>
        Collapse All
      </button>
    </div>
  );
}
