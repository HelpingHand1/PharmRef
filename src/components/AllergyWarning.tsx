import { AllergyWarningProps } from "../types";

// ============================================================
// ALLERGY KEYWORD DETECTION — v2.1 Enhanced Engine
// ============================================================

// Maps allergy keywords → drug IDs that should be flagged
const ALLERGY_DRUG_MAP: Record<string, string[]> = {
  // ── Penicillins ──────────────────────────────────────────────
  "pcn": ["amoxicillin", "ampicillin", "ampicillin-sulbactam", "piperacillin-tazobactam", "nafcillin", "oxacillin", "dicloxacillin", "amox-clav"],
  "penicillin": ["amoxicillin", "ampicillin", "ampicillin-sulbactam", "piperacillin-tazobactam", "nafcillin", "oxacillin", "dicloxacillin", "amox-clav"],
  "amoxicillin": ["amoxicillin", "amox-clav"],
  "ampicillin": ["ampicillin", "ampicillin-sulbactam"],
  "pip-tazo": ["pip-tazo", "piperacillin-tazobactam"],
  "piperacillin": ["pip-tazo", "piperacillin-tazobactam"],
  // ── Cephalosporins ───────────────────────────────────────────
  "cephalosporin": ["cefazolin", "ceftriaxone", "cefepime", "ceftazidime", "ceftazidime-avibactam", "cefiderocol", "cephalexin", "cefpodoxime", "cefuroxime", "ceftolozane-tazobactam"],
  "cefazolin": ["cefazolin"],
  "ceftriaxone": ["ceftriaxone"],
  "cefepime": ["cefepime"],
  "ceftazidime": ["ceftazidime", "ceftazidime-avibactam", "ceftolozane-tazobactam"],
  // ── Carbapenems ──────────────────────────────────────────────
  "carbapenem": ["meropenem", "ertapenem", "imipenem", "meropenem-vaborbactam", "imipenem-cilastatin-relebactam"],
  "meropenem": ["meropenem", "meropenem-vaborbactam"],
  "imipenem": ["imipenem", "imipenem-cilastatin-relebactam"],
  // ── Sulfonamides ─────────────────────────────────────────────
  "sulfa": ["tmp-smx", "sulfamethoxazole"],
  "sulfonamide": ["tmp-smx", "sulfamethoxazole"],
  "tmp-smx": ["tmp-smx"],
  "bactrim": ["tmp-smx"],
  "septra": ["tmp-smx"],
  // ── Fluoroquinolones ─────────────────────────────────────────
  "fluoroquinolone": ["ciprofloxacin", "levofloxacin", "moxifloxacin"],
  "quinolone": ["ciprofloxacin", "levofloxacin", "moxifloxacin"],
  "cipro": ["ciprofloxacin"],
  "ciprofloxacin": ["ciprofloxacin"],
  "levofloxacin": ["levofloxacin"],
  // ── Aminoglycosides ──────────────────────────────────────────
  "aminoglycoside": ["gentamicin", "tobramycin", "amikacin"],
  "gentamicin": ["gentamicin"],
  "tobramycin": ["tobramycin"],
  "amikacin": ["amikacin"],
  // ── Macrolides ───────────────────────────────────────────────
  "macrolide": ["azithromycin", "clarithromycin", "erythromycin"],
  "azithromycin": ["azithromycin"],
  "erythromycin": ["azithromycin", "clarithromycin", "erythromycin"],
  // ── Tetracyclines ────────────────────────────────────────────
  "tetracycline": ["doxycycline", "minocycline", "tetracycline"],
  "doxycycline": ["doxycycline", "minocycline"],
  // ── Glycopeptides ────────────────────────────────────────────
  "vancomycin": ["vancomycin"],
  "glycopeptide": ["vancomycin"],
  // ── Oxazolidinones ───────────────────────────────────────────
  "linezolid": ["linezolid", "tedizolid"],
  "oxazolidinone": ["linezolid", "tedizolid"],
  "tedizolid": ["tedizolid"],
  // ── Other gram-positive agents ───────────────────────────────
  "daptomycin": ["daptomycin"],
  "clindamycin": ["clindamycin"],
  // ── Nitroimidazoles ──────────────────────────────────────────
  "metronidazole": ["metronidazole"],
  "flagyl": ["metronidazole"],
  // ── Azoles ───────────────────────────────────────────────────
  "azole": ["fluconazole", "voriconazole", "posaconazole", "itraconazole", "isavuconazole"],
  "fluconazole": ["fluconazole"],
  "voriconazole": ["voriconazole"],
  "posaconazole": ["posaconazole"],
  // ── Other specific drugs ─────────────────────────────────────
  "nitrofurantoin": ["nitrofurantoin"],
  "fosfomycin": ["fosfomycin"],
  "rifampin": ["rifampin", "rifabutin"],
  "warfarin": [],
  "coumadin": [],
};

// Drugs that have significant INTERACTION with warfarin (not allergy — PK/PD interaction)
const WARFARIN_INTERACTORS = [
  "metronidazole", "tmp-smx", "fluconazole", "voriconazole", "posaconazole",
  "ciprofloxacin", "levofloxacin", "moxifloxacin", "azithromycin", "clarithromycin",
];

// Cross-reactivity rules: if allergic to X, what's the note for drug Y?
interface CrossReactNote {
  trigger: string[];  // allergy keywords that trigger this
  target: string[];   // drug IDs this applies to
  note: string;
  type: "cross-reactivity";
}

const CROSS_REACT_RULES: CrossReactNote[] = [
  {
    trigger: ["pcn", "penicillin", "amoxicillin", "ampicillin"],
    target: ["cefazolin", "ceftriaxone", "cefepime", "ceftazidime", "ceftazidime-avibactam", "cephalexin", "cefpodoxime", "cefiderocol", "ceftolozane-tazobactam"],
    note: "~2% cross-reactivity with cephalosporins (higher for cefazolin/amoxicillin R1 side-chain similarity). <1% with 3rd/4th gen. Consider graded challenge if PCN allergy unconfirmed.",
    type: "cross-reactivity",
  },
  {
    trigger: ["pcn", "penicillin", "ampicillin", "amoxicillin", "carbapenem", "meropenem", "imipenem"],
    target: ["meropenem", "ertapenem", "imipenem", "meropenem-vaborbactam", "imipenem-cilastatin-relebactam"],
    note: "<1% cross-reactivity between penicillins and carbapenems. Less than previously taught. If non-anaphylactic PCN allergy, carbapenems generally safe.",
    type: "cross-reactivity",
  },
  {
    trigger: ["ceftazidime"],
    target: ["aztreonam"],
    note: "Ceftazidime and aztreonam share identical R1 side chains — true cross-reactivity exists. Avoid aztreonam if immediate ceftazidime reaction.",
    type: "cross-reactivity",
  },
  {
    trigger: ["linezolid"],
    target: ["tedizolid"],
    note: "Tedizolid is a 2nd-gen oxazolidinone — potential cross-reactivity with linezolid. Monitor if prior linezolid reaction documented.",
    type: "cross-reactivity",
  },
];

export function checkAllergyMatch(drugId: string, allergies: Array<{ name: string; severity: string }>) {
  if (!allergies || allergies.length === 0) return null;
  const id = drugId.toLowerCase().trim();

  for (const allergy of allergies) {
    const key = allergy.name.toLowerCase().trim();

    // Skip single/double-letter entries to avoid spurious matches
    if (key.length <= 2) continue;

    // 1. Direct drug ID match (e.g., allergy "vancomycin" matches drug "vancomycin")
    if (id.includes(key) || key.includes(id)) {
      return { allergy: allergy.name, type: allergy.severity, note: undefined };
    }

    // 2. Drug map class match
    const targets = ALLERGY_DRUG_MAP[key] ?? [];
    if (targets.some((t) => id.includes(t) || t.includes(id))) {

      // Check for cross-reactivity rules first (e.g., PCN allergy → cephalosporins)
      for (const rule of CROSS_REACT_RULES) {
        if (rule.trigger.includes(key) && rule.target.some((t) => id.includes(t) || t.includes(id))) {
          // Only flag as cross-reactivity if this is DIFFERENT from the direct allergy class
          const isDirectMatch = targets.some((t) => id === t || t === id);
          if (!isDirectMatch) {
            return { allergy: allergy.name, type: rule.type, note: rule.note };
          }
        }
      }

      return { allergy: allergy.name, type: allergy.severity, note: undefined };
    }

    // 3. Cross-reactivity rules — reverse check (allergy to A, flagging B via rule)
    for (const rule of CROSS_REACT_RULES) {
      if (rule.trigger.includes(key) && rule.target.some((t) => id.includes(t) || t.includes(id))) {
        return { allergy: allergy.name, type: rule.type, note: rule.note };
      }
    }
  }

  // 4. Warfarin interaction check
  if (allergies.some((a) => ["warfarin", "coumadin"].includes(a.name.toLowerCase().trim()))) {
    if (WARFARIN_INTERACTORS.some((d) => id.includes(d) || d.includes(id))) {
      return {
        allergy: "Warfarin",
        type: "interaction",
        note: "Significant CYP2C9/antibiotic-warfarin interaction — monitor INR closely within 3–5 days of starting/stopping",
      };
    }
  }

  return null;
}

export default function AllergyWarning({ drugId, allergies, S }: AllergyWarningProps) {
  const match = checkAllergyMatch(drugId, allergies);
  if (!match) return null;

  const colors: Record<string, string> = {
    anaphylaxis: "#ef4444",
    severe: "#ef4444",
    moderate: "#f97316",
    mild: "#fbbf24",
    "cross-reactivity": "#f97316",
    interaction: "#a78bfa",
  };
  const icons: Record<string, string> = {
    anaphylaxis: "🚫",
    severe: "🚫",
    moderate: "⚠",
    mild: "⚠",
    "cross-reactivity": "↔",
    interaction: "🔗",
  };

  const color = colors[match.type] ?? "#fbbf24";
  const icon = icons[match.type] ?? "⚠";
  const label = match.type === "interaction"
    ? "INTERACTION"
    : match.type === "cross-reactivity"
    ? "CROSS-REACTIVITY"
    : `ALLERGY (${match.type.toUpperCase()})`;

  return (
    <div
      className="allergy-badge"
      style={{
        ...S.allergyBadge,
        borderColor: `${color}40`,
        background: `${color}15`,
        color,
        marginTop: "6px",
        display: "flex",
        alignItems: "flex-start",
        gap: "6px",
        flexWrap: "wrap" as const,
      }}
    >
      <span style={{ flexShrink: 0 }}>{icon} {label}: {match.allergy}</span>
      {match.note && (
        <span style={{ fontWeight: 400, opacity: 0.85, fontSize: "11px" }}>— {match.note}</span>
      )}
    </div>
  );
}
