import type { CSSProperties } from "react";

// One stroke-icon set for app chrome, so navigation reads the same on every
// platform instead of depending on each system's emoji font.
const PATHS = {
  home: ["M3 10.5 12 3l9 7.5", "M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"],
  search: ["M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z", "m20 20-3.8-3.8"],
  calculator: ["M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z", "M8.5 7.5h7", "M8.5 12h.01", "M12 12h.01", "M15.5 12h.01", "M8.5 16h.01", "M12 16h.01", "M15.5 16h.01"],
  patient: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M4.5 20.5a7.5 7.5 0 0 1 15 0"],
  allergy: ["M12 3.5 2.8 19.5a1 1 0 0 0 .9 1.5h16.6a1 1 0 0 0 .9-1.5L12 3.5Z", "M12 10v4.5", "M12 17.5h.01"],
  more: ["M5 12h.01", "M12 12h.01", "M19 12h.01"],
  close: ["M6 6l12 12", "M18 6 6 18"],
  bookmark: ["M7 3.5h10a1 1 0 0 1 1 1V21l-6-4-6 4V4.5a1 1 0 0 1 1-1Z"],
  link: ["M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1", "M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"],
  compare: ["M12 3v18", "M5 7h14", "M5 7 2.5 13a3 3 0 0 0 5 0L5 7Z", "M19 7l-2.5 6a3 3 0 0 0 5 0L19 7Z", "M8 21h8"],
  microbe: ["M12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z", "M12 3v4.5", "M12 16.5V21", "M3 12h4.5", "M16.5 12H21", "m5.6 5.6 3.2 3.2", "m15.2 15.2 3.2 3.2", "m5.6 18.4 3.2-3.2", "m15.2 8.8 3.2-3.2"],
  reading: ["M12 6.5C10 5 7.5 4.5 4 4.5v13c3.5 0 6 .5 8 2 2-1.5 4.5-2 8-2v-13c-3.5 0-6 .5-8 2Z", "M12 6.5v13"],
  sun: ["M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M12 2.5v2", "M12 19.5v2", "M2.5 12h2", "M19.5 12h2", "m5.3 5.3 1.4 1.4", "m17.3 17.3 1.4 1.4", "m5.3 18.7 1.4-1.4", "m17.3 6.7 1.4-1.4"],
  moon: ["M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"],
  contrast: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M12 3v18", "M12 7.5a4.5 4.5 0 0 1 0 9"],
  broom: ["m14 4 6 6", "M12.5 7.5 5 15l4 4 7.5-7.5", "M5 15l-2 5 5-2", "M17 7l3-3"],
  sparkle: ["M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18l-1.8-5.4L4.5 10.8 10.2 9 12 3.5Z", "M19 16.5v4", "M17 18.5h4"],
  audit: ["M9 4.5H6.5a1 1 0 0 0-1 1V20a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V5.5a1 1 0 0 0-1-1H15", "M9 3h6v3H9V3Z", "m9 13.5 2 2 4-4.5"],
  chevronRight: ["m9 6 6 6-6 6"],
  arrowUp: ["M12 19V5", "m6 11 6-6 6 6"],
  command: ["M9 9V6.5A2.5 2.5 0 1 0 6.5 9H9Z", "M15 9V6.5A2.5 2.5 0 1 1 17.5 9H15Z", "M9 15v2.5A2.5 2.5 0 1 1 6.5 15H9Z", "M15 15v2.5a2.5 2.5 0 1 0 2.5-2.5H15Z", "M9 9h6v6H9V9Z"],
  refresh: ["M20 11a8 8 0 0 0-14.5-3.5L4 9.5", "M4 4.5v5h5", "M4 13a8 8 0 0 0 14.5 3.5L20 14.5", "M20 19.5v-5h-5"],
  note: ["M6 3.5h9l4 4V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z", "M14.5 3.5V8H19", "M8.5 12.5h7", "M8.5 16h5"],
} as const;

export type IconName = keyof typeof PATHS;

interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  style?: CSSProperties;
}

export default function Icon({ name, size = 20, strokeWidth = 1.8, style }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, display: "block", ...style }}
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
