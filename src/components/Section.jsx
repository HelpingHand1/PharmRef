import React from "react";

export default function Section({ id, title, icon, children, defaultOpen, accentColor, expandedSections, toggleSection, readingMode, S }) {
  const isOpen = readingMode || (expandedSections[id] ?? defaultOpen ?? false);
  return (
    <div style={{ marginBottom: "4px" }} id={`section-${id}`}>
      <div
        className="section-hdr"
        style={{
          ...S.sectionHeader,
          ...(isOpen ? { borderBottom: "none", borderRadius: "8px 8px 0 0" } : {}),
          borderLeftColor: accentColor || S.sectionHeader.border,
          borderLeftWidth: accentColor ? "3px" : "1px",
        }}
        onClick={() => toggleSection(id)}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", fontWeight: 600 }}>
          {icon && <span style={{ fontSize: "16px" }}>{icon}</span>}
          {title}
        </span>
        {!readingMode && (
          <span style={{ color: "#64748b", fontSize: "18px", transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}>›</span>
        )}
      </div>
      <div
        className={`section-content-anim ${isOpen ? "expanded" : "collapsed"}`}
        style={isOpen ? S.sectionContent : { ...S.sectionContent, padding: 0 }}
      >
        {children}
      </div>
    </div>
  );
}