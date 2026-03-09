import { useState } from "react";
import type { PatientContext, Styles, ThemeKey } from "../types";

interface CalculatorsPageProps {
  S: Styles;
  theme: ThemeKey;
  patient: PatientContext;
  crcl: number | null;
  ibw: number | null;
  adjbw: number | null;
}

function ResultBadge({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px" }}>
      <div style={{ fontSize: "22px", fontWeight: 800, color, letterSpacing: "-0.04em" }}>{value}</div>
      <div style={{ fontSize: "11px", color, fontWeight: 600, letterSpacing: "0.04em" }}>{label}</div>
    </div>
  );
}

export default function CalculatorsPage({ theme, patient, crcl: globalCrcl, ibw: globalIbw, adjbw: globalAdjbw }: CalculatorsPageProps) {
  const isDark = theme !== "light";
  const cardBg = isDark ? "rgba(8,12,22,0.8)" : "rgba(255,255,255,0.95)";
  const border = isDark ? "#263449" : "#d7dfd4";
  const textColor = isDark ? "#e5eef8" : "#172033";
  const mutedColor = isDark ? "#8ea1bb" : "#66758c";
  const headingColor = isDark ? "#f1f5f9" : "#0f172a";
  const inputBg = isDark ? "rgba(15,23,42,0.84)" : "#fffefd";

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", background: inputBg, border: `1px solid ${border}`,
    borderRadius: "10px", color: textColor, fontSize: "14px", outline: "none",
    boxSizing: "border-box", fontFamily: "inherit",
  };
  const selectStyle: React.CSSProperties = { ...inputStyle };
  const labelStyle: React.CSSProperties = {
    fontSize: "11px", fontWeight: 800, letterSpacing: "0.1em",
    textTransform: "uppercase", color: mutedColor, marginBottom: "4px", display: "block",
  };
  const fieldWrap: React.CSSProperties = { display: "grid", gap: "3px" };

  function cardStyle(accent: string): React.CSSProperties {
    return {
      background: cardBg, border: `1px solid ${border}`, borderRadius: "18px",
      padding: "20px", display: "grid", gap: "16px",
      borderTop: `3px solid ${accent}`,
    };
  }

  function resultBox(color: string): React.CSSProperties {
    return {
      background: isDark ? `${color}12` : `${color}14`,
      border: `1px solid ${color}40`,
      borderRadius: "12px", padding: "14px 16px",
      display: "flex", flexWrap: "wrap" as const, gap: "18px", alignItems: "center",
    };
  }

  // ── CrCl Calculator ──────────────────────────────────────────
  const [crclAge, setCrclAge] = useState(patient.age ? String(patient.age) : "");
  const [crclWeight, setCrclWeight] = useState(patient.weight ? String(patient.weight) : "");
  const [crclScr, setCrclScr] = useState(patient.scr ? String(patient.scr) : "");
  const [crclSex, setCrclSex] = useState<"" | "male" | "female">(patient.sex ?? "");
  const [crclResult, setCrclResult] = useState<number | null>(globalCrcl);

  function calcCrcl() {
    const age = Number(crclAge), weight = Number(crclWeight), scr = Number(crclScr);
    if (!age || !weight || !scr || !crclSex || scr <= 0) return;
    const val = ((140 - age) * weight * (crclSex === "female" ? 0.85 : 1)) / (72 * scr);
    setCrclResult(Math.max(0, Math.round(val * 10) / 10));
  }

  const crclColor = crclResult === null ? mutedColor : crclResult >= 60 ? "#34d399" : crclResult >= 30 ? "#fbbf24" : "#f87171";
  const crclTier = crclResult === null ? "" : crclResult >= 60 ? "Normal/Mild" : crclResult >= 30 ? "Moderate impairment" : crclResult >= 15 ? "Severe impairment" : "Kidney failure — consider dialysis dosing";

  // ── IBW / AdjBW / BSA Calculator ─────────────────────────────
  const [wHeight, setWHeight] = useState(patient.height ? String(patient.height) : "");
  const [wWeight, setWWeight] = useState(patient.weight ? String(patient.weight) : "");
  const [wSex, setWSex] = useState<"" | "male" | "female">(patient.sex ?? "");
  const [wResult, setWResult] = useState<{ ibw: number; adjbw: number | null; bsa: number } | null>(
    globalIbw !== null ? { ibw: globalIbw, adjbw: globalAdjbw, bsa: Math.round(Math.sqrt((patient.height! * patient.weight!) / 3600) * 100) / 100 } : null
  );

  function calcWeights() {
    const h = Number(wHeight), w = Number(wWeight);
    if (!h || !w || !wSex) return;
    const hIn = h / 2.54;
    const base = wSex === "male" ? 50 : 45.5;
    const ibwVal = Math.max(0, Math.round((base + 2.3 * (hIn - 60)) * 10) / 10);
    const adjbwVal = w > ibwVal * 1.3 ? Math.round((ibwVal + 0.4 * (w - ibwVal)) * 10) / 10 : null;
    const bsaVal = Math.round(Math.sqrt((h * w) / 3600) * 100) / 100;
    setWResult({ ibw: ibwVal, adjbw: adjbwVal, bsa: bsaVal });
  }

  // ── CURB-65 ──────────────────────────────────────────────────
  const [curb, setCurb] = useState({ confusion: false, bun: false, rr: false, bp: false, age65: false });
  const curbScore = Object.values(curb).filter(Boolean).length;
  const curbColor = curbScore <= 1 ? "#34d399" : curbScore === 2 ? "#fbbf24" : "#f87171";
  const curbRisk = curbScore <= 1 ? "Low risk — outpatient treatment appropriate" : curbScore === 2 ? "Moderate risk — consider inpatient admission" : "High risk — ICU consideration warranted";
  const curbManagement = curbScore <= 1
    ? "Consider outpatient therapy with amoxicillin ± azithromycin. Follow up in 24–48h."
    : curbScore === 2
    ? "Consider short inpatient stay or hospital-supervised outpatient. IV to PO switch when stable."
    : "Inpatient required. Consider ICU if score ≥3 with sepsis criteria or hypoxia.";

  // ── PORT/PSI ─────────────────────────────────────────────────
  const [psi, setPsi] = useState({ age: "", sex: "" as "" | "male" | "female", nursingHome: false, neoplasm: false, liver: false, chf: false, cerebrovascular: false, renal: false, confusion: false, rr30: false, bp90: false, temp: false, hr125: false, ph735: false, bun30: false, na130: false, glucose250: false, hct30: false, po260: false, pleural: false });
  function psiField(k: keyof typeof psi, v: boolean | string) { setPsi((p) => ({ ...p, [k]: v })); }

  function calcPsiClass(): { cls: number; mortality: string; setting: string } {
    const age = Number(psi.age) || 0;
    let score = psi.sex === "female" ? age - 10 : age;
    if (psi.nursingHome) score += 10;
    if (psi.neoplasm) score += 30;
    if (psi.liver) score += 20;
    if (psi.chf) score += 10;
    if (psi.cerebrovascular) score += 10;
    if (psi.renal) score += 10;
    if (psi.confusion) score += 20;
    if (psi.rr30) score += 20;
    if (psi.bp90) score += 20;
    if (psi.temp) score += 15;
    if (psi.hr125) score += 10;
    if (psi.ph735) score += 30;
    if (psi.bun30) score += 20;
    if (psi.na130) score += 20;
    if (psi.glucose250) score += 10;
    if (psi.hct30) score += 10;
    if (psi.po260) score += 10;
    if (psi.pleural) score += 10;
    if (score <= 50) return { cls: 1, mortality: "<0.1%", setting: "Outpatient" };
    if (score <= 70) return { cls: 2, mortality: "0.6%", setting: "Outpatient" };
    if (score <= 90) return { cls: 3, mortality: "2.8%", setting: "Brief inpatient or outpatient" };
    if (score <= 130) return { cls: 4, mortality: "8.2%", setting: "Inpatient" };
    return { cls: 5, mortality: "29.2%", setting: "Inpatient / ICU" };
  }
  const psiResult = calcPsiClass();
  const psiColor = psiResult.cls <= 2 ? "#34d399" : psiResult.cls === 3 ? "#fbbf24" : "#f87171";

  // ── Vancomycin AUC ───────────────────────────────────────────
  const [vancCrcl, setVancCrcl] = useState(globalCrcl !== null ? String(globalCrcl) : "");
  const [vancWeight, setVancWeight] = useState(patient.weight ? String(patient.weight) : "");
  const [vancMic, setVancMic] = useState("1");
  const [vancResult, setVancResult] = useState<{ dose: number; interval: string; auc: string } | null>(null);

  function calcVanc() {
    const cl = Number(vancCrcl), w = Number(vancWeight), mic = Number(vancMic);
    if (!cl || !w || !mic) return;
    // VD ~0.7 L/kg, CL_vanc ~ (0.695 × CrCl + 0.05) × 0.06 L/hr/kg
    const vd = 0.7 * w;
    const clVanc = (0.695 * cl + 0.05) * 0.06 * w; // L/hr
    // Target AUC24 = 500 mg·hr/L → TDD = AUC × CL
    const tdd = Math.round((500 * clVanc) / 250) * 250;
    const halflife = (vd * 0.693) / clVanc;
    const interval = halflife < 6 ? "q6h" : halflife < 9 ? "q8h" : halflife < 14 ? "q12h" : halflife < 20 ? "q24h" : "q48h";
    const aucEstimate = `${Math.round(500 - 60)}–${Math.round(500 + 60)}`;
    setVancResult({ dose: Math.max(500, Math.min(tdd, 4500)), interval, auc: aucEstimate });
  }

  // ── Aminoglycoside (Hartford) ─────────────────────────────────
  const [agCrcl, setAgCrcl] = useState(globalCrcl !== null ? String(globalCrcl) : "");
  const [agWeight, setAgWeight] = useState(patient.weight ? String(patient.weight) : "");
  const [agDrug, setAgDrug] = useState<"gentamicin" | "tobramycin">("gentamicin");
  const [agResult, setAgResult] = useState<{ dose: number; interval: string; monitoring: string } | null>(null);

  function calcAg() {
    const cl = Number(agCrcl), w = Number(agWeight);
    if (!cl || !w) return;
    const dose = Math.round(7 * w);
    let interval: string, monitoring: string;
    if (cl >= 60) { interval = "q24h"; monitoring = "Check level 6–14h post-dose; use Hartford nomogram"; }
    else if (cl >= 40) { interval = "q36h"; monitoring = "Check level 6–14h post-dose; adjust to nomogram"; }
    else if (cl >= 20) { interval = "q48h"; monitoring = "Check level 6–14h post-dose; extended interval may not be safe"; }
    else { interval = "Conventional dosing preferred"; monitoring = "CrCl <20 — consult clinical pharmacokinetics; avoid extended interval"; }
    setAgResult({ dose, interval, monitoring });
  }

  function CalcBtn({ onClick }: { onClick: () => void }) {
    return (
      <button type="button" onClick={onClick} style={{ background: isDark ? "#7dd3fc" : "#0f766e", border: "none", borderRadius: "10px", color: isDark ? "#082f49" : "#ecfeff", fontSize: "13px", fontWeight: 700, padding: "10px 20px", cursor: "pointer", fontFamily: "inherit", alignSelf: "flex-end" }}>
        Calculate
      </button>
    );
  }

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: headingColor, margin: "0 0 6px", letterSpacing: "-0.03em" }}>
          🧮 Clinical Calculators
        </h1>
        <p style={{ fontSize: "14px", color: mutedColor, margin: 0, lineHeight: 1.6 }}>
          Pre-filled from patient context when active. Results are decision-support only — verify against current guidelines.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>

        {/* ── CrCl ── */}
        <div style={cardStyle("#38bdf8")}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: headingColor, marginBottom: "2px" }}>💊 Creatinine Clearance</div>
            <div style={{ fontSize: "12px", color: mutedColor }}>Cockcroft-Gault Equation</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div style={fieldWrap}><label style={labelStyle}>Age (yrs)</label><input type="number" style={inputStyle} value={crclAge} onChange={(e) => setCrclAge(e.target.value)} placeholder="65" /></div>
            <div style={fieldWrap}><label style={labelStyle}>Sex</label><select style={selectStyle} value={crclSex} onChange={(e) => setCrclSex(e.target.value as "" | "male" | "female")}><option value="">Select…</option><option value="male">Male</option><option value="female">Female</option></select></div>
            <div style={fieldWrap}><label style={labelStyle}>Weight (kg)</label><input type="number" style={inputStyle} value={crclWeight} onChange={(e) => setCrclWeight(e.target.value)} placeholder="70" /></div>
            <div style={fieldWrap}><label style={labelStyle}>SCr (mg/dL)</label><input type="number" step="0.01" style={inputStyle} value={crclScr} onChange={(e) => setCrclScr(e.target.value)} placeholder="1.2" /></div>
          </div>
          <CalcBtn onClick={calcCrcl} />
          {crclResult !== null && (
            <div style={resultBox(crclColor)}>
              <ResultBadge value={`${crclResult}`} label="mL/min" color={crclColor} />
              <div style={{ fontSize: "12px", color: crclColor, fontWeight: 600 }}>{crclTier}</div>
            </div>
          )}
          <div style={{ fontSize: "11px", color: mutedColor, lineHeight: 1.5 }}>
            Use actual body weight unless obese (AdjBW &gt; ABW significantly). Note: Cystatin C or eGFR may be more accurate in elderly/cachexia.
          </div>
        </div>

        {/* ── IBW / AdjBW / BSA ── */}
        <div style={cardStyle("#a78bfa")}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: headingColor, marginBottom: "2px" }}>⚖️ IBW / AdjBW / BSA</div>
            <div style={{ fontSize: "12px", color: mutedColor }}>Devine Formula · Mosteller BSA</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div style={fieldWrap}><label style={labelStyle}>Sex</label><select style={selectStyle} value={wSex} onChange={(e) => setWSex(e.target.value as "" | "male" | "female")}><option value="">Select…</option><option value="male">Male</option><option value="female">Female</option></select></div>
            <div style={fieldWrap}><label style={labelStyle}>Height (cm)</label><input type="number" style={inputStyle} value={wHeight} onChange={(e) => setWHeight(e.target.value)} placeholder="170" /></div>
            <div style={fieldWrap}><label style={labelStyle}>Actual Weight (kg)</label><input type="number" style={inputStyle} value={wWeight} onChange={(e) => setWWeight(e.target.value)} placeholder="85" /></div>
          </div>
          <CalcBtn onClick={calcWeights} />
          {wResult && (
            <div style={resultBox("#a78bfa")}>
              <ResultBadge value={`${wResult.ibw}`} label="IBW (kg)" color="#a78bfa" />
              {wResult.adjbw !== null && <ResultBadge value={`${wResult.adjbw}`} label="AdjBW (kg)" color="#c4b5fd" />}
              <ResultBadge value={`${wResult.bsa}`} label="BSA (m²)" color="#8b5cf6" />
            </div>
          )}
          <div style={{ fontSize: "11px", color: mutedColor, lineHeight: 1.5 }}>
            AdjBW shown when actual &gt; 1.3× IBW (obesity). Use IBW for aminoglycosides; AdjBW for vancomycin in obese; actual for renally-adjusted drugs.
          </div>
        </div>

        {/* ── CURB-65 ── */}
        <div style={cardStyle("#34d399")}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: headingColor, marginBottom: "2px" }}>🫁 CURB-65</div>
            <div style={{ fontSize: "12px", color: mutedColor }}>CAP Severity Score · 30-Day Mortality</div>
          </div>
          <div style={{ display: "grid", gap: "8px" }}>
            {([
              ["confusion", "Confusion (new disorientation)"],
              ["bun", "BUN >7 mmol/L or BUN >19 mg/dL"],
              ["rr", "Respiratory Rate ≥30 breaths/min"],
              ["bp", "BP <90 systolic or ≤60 diastolic"],
              ["age65", "Age ≥65 years"],
            ] as [keyof typeof curb, string][]).map(([key, label]) => (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
                <input type="checkbox" checked={curb[key]} onChange={(e) => setCurb((p) => ({ ...p, [key]: e.target.checked }))} />
                {label}
              </label>
            ))}
          </div>
          <div style={resultBox(curbColor)}>
            <ResultBadge value={String(curbScore)} label="Score / 5" color={curbColor} />
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: curbColor }}>{curbRisk}</div>
              <div style={{ fontSize: "11px", color: mutedColor, marginTop: "4px", lineHeight: 1.5 }}>{curbManagement}</div>
            </div>
          </div>
          <div style={{ fontSize: "11px", color: mutedColor, lineHeight: 1.5 }}>
            CURB-65 is preferred when labs are unavailable. Use PORT/PSI when full labs are available for more nuanced risk stratification.
          </div>
        </div>

        {/* ── PORT/PSI ── */}
        <div style={cardStyle("#f59e0b")}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: headingColor, marginBottom: "2px" }}>🏥 PORT / PSI</div>
            <div style={{ fontSize: "12px", color: mutedColor }}>Pneumonia Severity Index · Risk Class I–V</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "4px" }}>
            <div style={fieldWrap}><label style={labelStyle}>Age (yrs)</label><input type="number" style={inputStyle} value={psi.age} onChange={(e) => psiField("age", e.target.value)} placeholder="65" /></div>
            <div style={fieldWrap}><label style={labelStyle}>Sex</label><select style={selectStyle} value={psi.sex} onChange={(e) => psiField("sex", e.target.value)}><option value="">Select…</option><option value="male">Male</option><option value="female">Female (−10 pts)</option></select></div>
          </div>
          <div style={{ display: "grid", gap: "7px" }}>
            <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: mutedColor }}>Comorbidities</div>
            {([
              ["nursingHome", "Nursing home resident (+10)"],
              ["neoplasm", "Active neoplasm (+30)"],
              ["liver", "Liver disease (+20)"],
              ["chf", "Congestive heart failure (+10)"],
              ["cerebrovascular", "Cerebrovascular disease (+10)"],
              ["renal", "Renal disease (+10)"],
            ] as [keyof typeof psi, string][]).map(([key, label]) => (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: textColor, cursor: "pointer" }}>
                <input type="checkbox" checked={psi[key] as boolean} onChange={(e) => psiField(key, e.target.checked)} />
                {label}
              </label>
            ))}
            <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: mutedColor, marginTop: "6px" }}>Exam Findings</div>
            {([
              ["confusion", "Altered mental status (+20)"],
              ["rr30", "RR ≥30 (+20)"],
              ["bp90", "SBP <90 mmHg (+20)"],
              ["temp", "Temp <35°C or ≥40°C (+15)"],
              ["hr125", "HR ≥125 (+10)"],
            ] as [keyof typeof psi, string][]).map(([key, label]) => (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: textColor, cursor: "pointer" }}>
                <input type="checkbox" checked={psi[key] as boolean} onChange={(e) => psiField(key, e.target.checked)} />
                {label}
              </label>
            ))}
            <div style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: mutedColor, marginTop: "6px" }}>Labs</div>
            {([
              ["ph735", "Arterial pH <7.35 (+30)"],
              ["bun30", "BUN ≥30 mg/dL (+20)"],
              ["na130", "Na <130 mEq/L (+20)"],
              ["glucose250", "Glucose ≥250 mg/dL (+10)"],
              ["hct30", "Hct <30% (+10)"],
              ["po260", "PaO2 <60 mmHg or SpO2 <90% (+10)"],
              ["pleural", "Pleural effusion (+10)"],
            ] as [keyof typeof psi, string][]).map(([key, label]) => (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: textColor, cursor: "pointer" }}>
                <input type="checkbox" checked={psi[key] as boolean} onChange={(e) => psiField(key, e.target.checked)} />
                {label}
              </label>
            ))}
          </div>
          <div style={resultBox(psiColor)}>
            <ResultBadge value={`Class ${psiResult.cls}`} label={`Mortality: ${psiResult.mortality}`} color={psiColor} />
            <div style={{ fontSize: "12px", color: psiColor, fontWeight: 600 }}>{psiResult.setting}</div>
          </div>
          <div style={{ fontSize: "11px", color: mutedColor, lineHeight: 1.5 }}>
            Full PSI requires labs. Use CURB-65 at triage when labs unavailable. Note: PSI may under-score immunocompromised patients.
          </div>
        </div>

        {/* ── Vancomycin AUC ── */}
        <div style={cardStyle("#818cf8")}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: headingColor, marginBottom: "2px" }}>💉 Vancomycin AUC Estimator</div>
            <div style={{ fontSize: "12px", color: mutedColor }}>ASHP/IDSA 2020 · Target AUC/MIC 400–600</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div style={fieldWrap}><label style={labelStyle}>CrCl (mL/min)</label><input type="number" style={inputStyle} value={vancCrcl} onChange={(e) => setVancCrcl(e.target.value)} placeholder="60" /></div>
            <div style={fieldWrap}><label style={labelStyle}>Weight (kg)</label><input type="number" style={inputStyle} value={vancWeight} onChange={(e) => setVancWeight(e.target.value)} placeholder="70" /></div>
            <div style={fieldWrap}><label style={labelStyle}>MIC (mg/L)</label><select style={selectStyle} value={vancMic} onChange={(e) => setVancMic(e.target.value)}><option value="0.5">0.5</option><option value="1">1.0 (most common)</option><option value="2">2.0</option></select></div>
          </div>
          <CalcBtn onClick={calcVanc} />
          {vancResult && (
            <>
              <div style={resultBox("#818cf8")}>
                <ResultBadge value={`${vancResult.dose} mg`} label={`Total daily dose`} color="#818cf8" />
                <ResultBadge value={vancResult.interval} label="Interval" color="#818cf8" />
                <div style={{ fontSize: "12px", color: mutedColor }}>Est. AUC: {vancResult.auc} mg·h/L</div>
              </div>
              <div style={{ fontSize: "11px", background: isDark ? "rgba(239,68,68,0.1)" : "#fee2e2", border: "1px solid #ef444430", borderRadius: "8px", padding: "8px 12px", color: isDark ? "#fca5a5" : "#991b1b", lineHeight: 1.5 }}>
                ⚠ This is a population-based initial dose estimate only. Bayesian pharmacokinetic modeling or formal PK consult is strongly recommended. Individual PK variability is significant.
              </div>
            </>
          )}
          <div style={{ fontSize: "11px", color: mutedColor, lineHeight: 1.5 }}>
            Per ASHP/IDSA/SIDP 2020 guidelines. For MRSA bacteremia/endocarditis — AUC-guided monitoring preferred over trough-only monitoring.
          </div>
        </div>

        {/* ── Aminoglycoside ── */}
        <div style={cardStyle("#f87171")}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: headingColor, marginBottom: "2px" }}>🔬 Aminoglycoside Dosing</div>
            <div style={{ fontSize: "12px", color: mutedColor }}>Hartford Nomogram · Extended Interval</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div style={fieldWrap}><label style={labelStyle}>Drug</label><select style={selectStyle} value={agDrug} onChange={(e) => setAgDrug(e.target.value as "gentamicin" | "tobramycin")}><option value="gentamicin">Gentamicin</option><option value="tobramycin">Tobramycin</option></select></div>
            <div style={fieldWrap}><label style={labelStyle}>CrCl (mL/min)</label><input type="number" style={inputStyle} value={agCrcl} onChange={(e) => setAgCrcl(e.target.value)} placeholder="60" /></div>
            <div style={fieldWrap}><label style={labelStyle}>Weight (kg)</label><input type="number" style={inputStyle} value={agWeight} onChange={(e) => setAgWeight(e.target.value)} placeholder="70" /></div>
          </div>
          <CalcBtn onClick={calcAg} />
          {agResult && (
            <div style={resultBox("#f87171")}>
              <ResultBadge value={`${agResult.dose} mg`} label="7 mg/kg dose" color="#f87171" />
              <ResultBadge value={agResult.interval} label="Interval" color="#f87171" />
              <div style={{ fontSize: "11px", color: mutedColor, lineHeight: 1.5 }}>{agResult.monitoring}</div>
            </div>
          )}
          <div style={{ fontSize: "11px", color: mutedColor, lineHeight: 1.5 }}>
            Use IBW for dosing weight if obese. Traditional q8h dosing (1–2 mg/kg) with troughs preferred for endocarditis synergy, pregnancy, burns. Extended interval not appropriate for CrCl &lt;20 or dialysis.
          </div>
        </div>

      </div>

      <div style={{ marginTop: "24px", padding: "12px 16px", border: `1px solid ${border}`, borderRadius: "10px", background: isDark ? "rgba(15,23,42,0.4)" : "rgba(255,253,249,0.7)" }}>
        <p style={{ fontSize: "11px", color: mutedColor, margin: 0, lineHeight: 1.7 }}>
          <strong style={{ color: textColor }}>Clinical Disclaimer:</strong> All calculators are decision-support tools only. Results must be verified against current clinical guidelines and individualized for each patient. Consult clinical pharmacy and pharmacokinetics services for complex dosing decisions, especially for renally/hepatically impaired patients, pregnancy, pediatrics, and critically ill populations.
        </p>
      </div>
    </div>
  );
}
