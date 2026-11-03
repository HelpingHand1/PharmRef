import { memo, useCallback } from "react";
import { SectionProps } from "../types";

const Section = memo(function Section({
  id,
  title,
  icon,
  accentColor,
  children,
  defaultOpen,
  expandedSections,
  toggleSection,
  readingMode,
  S,
}: SectionProps) {
  const isOpen = readingMode || (expandedSections[id] ?? defaultOpen ?? false);
  const contentId = `section-content-${id}`;
  const headerId = `section-header-${id}`;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (readingMode) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleSection(id);
      }
    },
    [id, readingMode, toggleSection],
  );

  return (
    <div style={{ marginBottom: "8px" }} id={`section-${id}`}>
      {/* A real heading (h2 > button pattern) so screen readers can jump between sections */}
      <h2 style={{ margin: 0, fontSize: "inherit", fontWeight: "inherit" }}>
        <span
          id={headerId}
          className="section-hdr"
          role={readingMode ? undefined : "button"}
          tabIndex={readingMode ? undefined : 0}
          aria-expanded={readingMode ? undefined : isOpen}
          aria-controls={readingMode ? undefined : contentId}
          style={{
            ...S.sectionHeader,
            ...(isOpen ? { borderBottom: "none", borderRadius: "16px 16px 0 0" } : {}),
            borderLeftColor: accentColor || S.sectionHeader.borderLeftColor || S.sectionHeader.borderColor,
            borderLeftWidth: accentColor ? "3px" : "1px",
          }}
          onClick={() => toggleSection(id)}
          onKeyDown={handleKeyDown}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", fontWeight: 700, color: S.meta?.textHeading || S.monographValue.color }}>
            {icon && (
              <span
                aria-hidden="true"
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "10px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  background: S.meta?.accentSurface || "transparent",
                  border: `1px solid ${S.meta?.border || S.sectionHeader.borderColor}`,
                }}
              >
                {icon}
              </span>
            )}
            {title}
          </span>
          {!readingMode && (
            <span aria-hidden="true" style={{ color: S.monographLabel.color, fontSize: "18px", transform: isOpen ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}>›</span>
          )}
        </span>
      </h2>
      <div
        id={contentId}
        role="region"
        aria-labelledby={headerId}
        className={`section-content-anim ${isOpen ? "expanded" : "collapsed"}`}
        style={isOpen ? S.sectionContent : { ...S.sectionContent, padding: 0 }}
      >
        {children}
      </div>
    </div>
  );
});

export default Section;
