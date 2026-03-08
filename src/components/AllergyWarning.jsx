import React from "react";

// ============================================================
// ALLERGY KEYWORD DETECTION
// ============================================================
const ALLERGY_DRUG_MAP = {
  "pcn": ["amoxicillin", "ampicillin", "ampicillin-sulbactam", "piperacillin-tazobactam", "nafcillin"],
  "penicillin": ["amoxicillin", "ampicillin", "ampicillin-sulbactam", "piperacillin-tazobactam", "nafcillin"],
  "cephalosporin": ["cefazolin", "ceftriaxone", "cefepime", "ceftazidime-avibactam", "cefiderocol"],
  "sulfa": ["tmp-smx", "sulfamethoxazole"],
  "fluoroquinolone": ["ciprofloxacin", "levofloxacin"],
  "carbapenem": ["meropenem", "ertapenem", "meropenem-vaborbactam"],
  "vancomycin": ["vancomycin"],
  "linezolid": ["linezolid"],
  "daptomycin": ["daptomycin"],
  "metronidazole": ["metronidazole"],
  "clindamycin": ["clindamycin"],
  "warfarin": [],
};

export function checkAllergyMatch(drugId, allergies) {
  if (!allergies || allergies.length === 0) return null;
  const id = drugId.toLowerCase();
  for (const allergy of allergies) {
    const key = allergy.name.toLowerCase();
    if (id.includes(key) || key.includes(id)) return { allergy: allergy.name, type: allergy.severity };
    const targets = ALLERGY_DRUG_MAP[key] || [];
    if (targets.some(t => id.includes(t) || t.includes(id))) {
      if ((key === "pcn" || key === "penicillin") && ["cefazolin", "ceftriaxone", "cefepime"].some(c => id.includes(c))) {
        return { allergy: allergy.name, type: "cross-reactivity", note: "~2% cross-reactivity with cephalosporins; <1% with 3rd/4th gen. Consider if anaphylaxis history." };
      }
      return { allergy: allergy.name, type: allergy.severity };
    }
  }
  if (allergies.some(a => a.name.toLowerCase() === "warfarin")) {
    const interactors = ["metronidazole", "tmp-smx", "fluconazole", "ciprofloxacin", "levofloxacin"];
    if (interactors.some(d => id.includes(d))) {
      return { allergy: "Warfarin", type: "interaction", note: "Significant warfarin interaction — monitor INR closely" };
    }
  }
  return null;
}

export default function AllergyWarning({ drugId, allergies, S }) {
  const match = checkAllergyMatch(drugId, allergies);
  if (!match) return null;
  const colors = match.type === "anaphylaxis" ? "#ef4444" : match.type === "cross-reactivity" ? "#f59e0b" : match.type === "interaction" ? "#a78bfa" : "#f87171";
  return (
    <div className="allergy-badge" style={{ ...S.allergyBadge, borderColor: colors + "40", background: colors + "15", color: colors, marginTop: "6px" }}>
      ⚠ {match.type === "interaction" ? "INTERACTION" : "ALLERGY"}: {match.allergy}
      {match.note && <span style={{ fontWeight: 400, marginLeft: "4px" }}>— {match.note}</span>}
    </div>
  );
}