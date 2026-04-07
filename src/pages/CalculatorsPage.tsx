import { useCallback, useState } from "react";
import type { PatientContext, Styles, ThemeKey } from "../types";
import {
  assessAzoleTrough,
  calculateCurb65,
  calculateDaptomycinDose,
  calculateHartfordAminoglycoside,
  calculatePsiClass,
  calculateTmpSmxDose,
  calculateWeightMetrics,
  convertColistinDose,
  estimateExtendedInfusionBetaLactam,
  estimateVancomycinRegimen,
  type PsiInput,
} from "../utils/clinicalCalculators";

interface CalculatorsPageProps {
  S: Styles;
  theme: ThemeKey;
  patient: PatientContext;
  crcl: number | null;
  ibw: number | null;
  adjbw: number | null;
  showToast?: (message: string, icon?: string) => void;
}

function ResultBadge({ value, label, color, onCopy }: { value: string; label: string; color: string; onCopy?: () => void }) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px", cursor: onCopy ? "pointer" : "default" }}
      onClick={onCopy}
      title={onCopy ? `Copy "${value}" to clipboard` : undefined}
      role={onCopy ? "button" : undefined}
      tabIndex={onCopy ? 0 : undefined}
      onKeyDown={onCopy ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onCopy(); } } : undefined}
    >
      <div style={{ fontSize: "22px", fontWeight: 800, color, letterSpacing: "-0.04em" }}>{value}</div>
      <div style={{ fontSize: "11px", color, fontWeight: 600, letterSpacing: "0.04em" }}>{label}</div>
    </div>
  );
}

export default function CalculatorsPage({ theme, patient, crcl: globalCrcl, ibw: globalIbw, adjbw: globalAdjbw, showToast }: CalculatorsPageProps) {
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

  const copyResult = useCallback((value: string, label: string) => {
    navigator.clipboard.writeText(value).then(
      () => showToast?.(`Copied ${label}: ${value}`, "⎘"),
      () => showToast?.("Clipboard unavailable", "⚠"),
    );
  }, [showToast]);

  const makeCopy = useCallback((value: string, label: string) => () => copyResult(value, label), [copyResult]);

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
    patient.height && patient.weight && patient.sex
      ? calculateWeightMetrics(patient.height, patient.weight, patient.sex)
      : globalIbw !== null && patient.height && patient.weight
        ? { ibw: globalIbw, adjbw: globalAdjbw, bsa: Math.round(Math.sqrt((patient.height * patient.weight) / 3600) * 100) / 100 }
        : null,
  );

  function calcWeights() {
    const result = calculateWeightMetrics(Number(wHeight), Number(wWeight), wSex || undefined);
    if (!result) return;
    setWResult(result);
  }

  // ── CURB-65 ──────────────────────────────────────────────────
  const [curb, setCurb] = useState({ confusion: false, bun: false, rr: false, bp: false, age65: false });
  const curbResult = calculateCurb65(curb);
  const curbScore = curbResult.score;
  const curbColor = curbScore <= 1 ? "#34d399" : curbScore === 2 ? "#fbbf24" : "#f87171";
  const curbRisk = curbResult.risk;
  const curbManagement = curbResult.management;

  // ── PORT/PSI ─────────────────────────────────────────────────
  const [psi, setPsi] = useState<PsiInput>({ age: "", sex: "" as "" | "male" | "female", nursingHome: false, neoplasm: false, liver: false, chf: false, cerebrovascular: false, renal: false, confusion: false, rr30: false, bp90: false, temp: false, hr125: false, ph735: false, bun30: false, na130: false, glucose250: false, hct30: false, po260: false, pleural: false });
  function psiField(k: keyof PsiInput, v: boolean | string) { setPsi((p) => ({ ...p, [k]: v })); }

  const psiResult = calculatePsiClass(psi);
  const psiColor = psiResult.cls <= 2 ? "#34d399" : psiResult.cls === 3 ? "#fbbf24" : "#f87171";

  // ── Vancomycin AUC ───────────────────────────────────────────
  const [vancCrcl, setVancCrcl] = useState(globalCrcl !== null ? String(globalCrcl) : "");
  const [vancWeight, setVancWeight] = useState(patient.weight ? String(patient.weight) : "");
  const [vancMic, setVancMic] = useState("1");
  const [vancResult, setVancResult] = useState<{ dose: number; interval: string; auc: string } | null>(null);

  function calcVanc() {
    const result = estimateVancomycinRegimen(Number(vancCrcl), Number(vancWeight), Number(vancMic));
    if (!result) return;
    setVancResult(result);
  }

  // ── Aminoglycoside (Hartford) ─────────────────────────────────
  const [agCrcl, setAgCrcl] = useState(globalCrcl !== null ? String(globalCrcl) : "");
  const [agWeight, setAgWeight] = useState(patient.weight ? String(patient.weight) : "");
  const [agDrug, setAgDrug] = useState<"gentamicin" | "tobramycin">("gentamicin");
  const [agResult, setAgResult] = useState<{ dose: number; interval: string; monitoring: string } | null>(null);

  function calcAg() {
    const result = calculateHartfordAminoglycoside(Number(agCrcl), Number(agWeight));
    if (!result) return;
    setAgResult(result);
  }

  // ── Extended-infusion beta-lactams / ARC ───────────────────
  const [betaAgent, setBetaAgent] = useState<"cefepime" | "meropenem" | "pip-tazo">("meropenem");
  const [betaCrcl, setBetaCrcl] = useState(globalCrcl !== null ? String(globalCrcl) : "");
  const [betaArc, setBetaArc] = useState(globalCrcl !== null ? globalCrcl >= 120 : false);
  const [betaResult, setBetaResult] = useState<ReturnType<typeof estimateExtendedInfusionBetaLactam> | null>(null);

  function calcBetaLactam() {
    const result = estimateExtendedInfusionBetaLactam(betaAgent, Number(betaCrcl), betaArc);
    if (!result) return;
    setBetaResult(result);
  }

  // ── Daptomycin mg/kg ────────────────────────────────────────
  const [daptoWeight, setDaptoWeight] = useState(patient.weight ? String(patient.weight) : "");
  const [daptoMgKg, setDaptoMgKg] = useState("8");
  const [daptoResult, setDaptoResult] = useState<ReturnType<typeof calculateDaptomycinDose> | null>(null);

  function calcDapto() {
    const result = calculateDaptomycinDose(Number(daptoWeight), Number(daptoMgKg));
    if (!result) return;
    setDaptoResult(result);
  }

  // ── TMP-SMX TMP-based dosing ────────────────────────────────
  const [tmpWeight, setTmpWeight] = useState(patient.weight ? String(patient.weight) : "");
  const [tmpTarget, setTmpTarget] = useState("10");
  const [tmpDosesPerDay, setTmpDosesPerDay] = useState("2");
  const [tmpResult, setTmpResult] = useState<ReturnType<typeof calculateTmpSmxDose> | null>(null);

  function calcTmpSmx() {
    const result = calculateTmpSmxDose(Number(tmpWeight), Number(tmpTarget), Number(tmpDosesPerDay));
    if (!result) return;
    setTmpResult(result);
  }

  // ── Colistin conversion ─────────────────────────────────────
  const [colistinValue, setColistinValue] = useState("1");
  const [colistinUnit, setColistinUnit] = useState<"million_iu" | "cms_mg" | "cba_mg">("million_iu");
  const [colistinResult, setColistinResult] = useState<ReturnType<typeof convertColistinDose> | null>(null);

  function calcColistin() {
    const result = convertColistinDose(Number(colistinValue), colistinUnit);
    if (!result) return;
    setColistinResult(result);
  }

  // ── Azole TDM ───────────────────────────────────────────────
  const [azoleAgent, setAzoleAgent] = useState<"voriconazole" | "posaconazole-prophylaxis" | "posaconazole-treatment">("voriconazole");
  const [azoleTrough, setAzoleTrough] = useState("");
  const [azoleResult, setAzoleResult] = useState<ReturnType<typeof assessAzoleTrough> | null>(null);

  function calcAzole() {
    const result = assessAzoleTrough(azoleAgent, Number(azoleTrough));
    if (!result) return;
    setAzoleResult(result);
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
              <ResultBadge value={`${crclResult}`} label="mL/min" color={crclColor} onCopy={makeCopy(`${crclResult}`, "CrCl")} />
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
              <ResultBadge value={`${wResult.ibw}`} label="IBW (kg)" color="#a78bfa" onCopy={makeCopy(`${wResult.ibw}`, "IBW")} />
              {wResult.adjbw !== null && <ResultBadge value={`${wResult.adjbw}`} label="AdjBW (kg)" color="#c4b5fd" onCopy={makeCopy(`${wResult.adjbw}`, "AdjBW")} />}
              <ResultBadge value={`${wResult.bsa}`} label="BSA (m²)" color="#8b5cf6" onCopy={makeCopy(`${wResult.bsa}`, "BSA")} />
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
            <ResultBadge value={String(curbScore)} label="Score / 5" color={curbColor} onCopy={makeCopy(String(curbScore), "CURB-65")} />
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
            <ResultBadge value={`Class ${psiResult.cls}`} label={`Mortality: ${psiResult.mortality}`} color={psiColor} onCopy={makeCopy(`Class ${psiResult.cls}`, "PSI")} />
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
                <ResultBadge value={`${vancResult.dose} mg`} label={`Total daily dose`} color="#818cf8" onCopy={makeCopy(`${vancResult.dose} mg`, "Vanc dose")} />
                <ResultBadge value={vancResult.interval} label="Interval" color="#818cf8" onCopy={makeCopy(vancResult.interval, "Vanc interval")} />
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
              <ResultBadge value={`${agResult.dose} mg`} label="7 mg/kg dose" color="#f87171" onCopy={makeCopy(`${agResult.dose} mg`, "AG dose")} />
              <ResultBadge value={agResult.interval} label="Interval" color="#f87171" onCopy={makeCopy(agResult.interval, "AG interval")} />
              <div style={{ fontSize: "11px", color: mutedColor, lineHeight: 1.5 }}>{agResult.monitoring}</div>
            </div>
          )}
          <div style={{ fontSize: "11px", color: mutedColor, lineHeight: 1.5 }}>
            Use IBW for dosing weight if obese. Traditional q8h dosing (1–2 mg/kg) with troughs preferred for endocarditis synergy, pregnancy, burns. Extended interval not appropriate for CrCl &lt;20 or dialysis.
          </div>
        </div>

        {/* ── Extended-infusion beta-lactams ── */}
        <div style={cardStyle("#06b6d4")}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: headingColor, marginBottom: "2px" }}>⏳ Extended-Infusion Beta-Lactam</div>
            <div style={{ fontSize: "12px", color: mutedColor }}>ARC / prolonged-infusion exposure support</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div style={fieldWrap}>
              <label style={labelStyle}>Agent</label>
              <select style={selectStyle} value={betaAgent} onChange={(e) => setBetaAgent(e.target.value as "cefepime" | "meropenem" | "pip-tazo")}>
                <option value="meropenem">Meropenem</option>
                <option value="cefepime">Cefepime</option>
                <option value="pip-tazo">Piperacillin-tazobactam</option>
              </select>
            </div>
            <div style={fieldWrap}>
              <label style={labelStyle}>CrCl (mL/min)</label>
              <input type="number" style={inputStyle} value={betaCrcl} onChange={(e) => setBetaCrcl(e.target.value)} placeholder="120" />
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: textColor, cursor: "pointer" }}>
            <input type="checkbox" checked={betaArc} onChange={(e) => setBetaArc(e.target.checked)} />
            Treat as augmented renal clearance / early underexposure risk
          </label>
          <CalcBtn onClick={calcBetaLactam} />
          {betaResult && (
            <div style={resultBox("#06b6d4")}>
              <ResultBadge value={betaResult.regimen} label="Suggested regimen" color="#06b6d4" onCopy={makeCopy(betaResult.regimen, "Beta-lactam regimen")} />
              <div style={{ fontSize: "11px", color: mutedColor, lineHeight: 1.55 }}>{betaResult.rationale}</div>
            </div>
          )}
          <div style={{ fontSize: "11px", color: mutedColor, lineHeight: 1.5 }}>
            Serious infection and higher MIC organisms usually belong at the aggressive end of the range. Rebuild the regimen when renal function or CRRT status changes.
          </div>
        </div>

        {/* ── Daptomycin ── */}
        <div style={cardStyle("#10b981")}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: headingColor, marginBottom: "2px" }}>🦠 Daptomycin mg/kg</div>
            <div style={{ fontSize: "12px", color: mutedColor }}>Actual-body-weight bedside calculation</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div style={fieldWrap}><label style={labelStyle}>Weight (kg)</label><input type="number" style={inputStyle} value={daptoWeight} onChange={(e) => setDaptoWeight(e.target.value)} placeholder="80" /></div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Target mg/kg</label>
              <select style={selectStyle} value={daptoMgKg} onChange={(e) => setDaptoMgKg(e.target.value)}>
                <option value="6">6 mg/kg</option>
                <option value="8">8 mg/kg</option>
                <option value="10">10 mg/kg</option>
                <option value="12">12 mg/kg</option>
              </select>
            </div>
          </div>
          <CalcBtn onClick={calcDapto} />
          {daptoResult && (
            <div style={resultBox("#10b981")}>
              <ResultBadge value={`${daptoResult.totalDoseMg} mg`} label={`${daptoResult.mgPerKg} mg/kg`} color="#10b981" onCopy={makeCopy(`${daptoResult.totalDoseMg} mg`, "Daptomycin")} />
            </div>
          )}
          <div style={{ fontSize: "11px", color: mutedColor, lineHeight: 1.5 }}>
            Useful for bloodstream, endovascular, and salvage MRSA/VRE plans. This is a starting math check only; confirm syndrome-specific targets and CK monitoring.
          </div>
        </div>

        {/* ── TMP-SMX ── */}
        <div style={cardStyle("#14b8a6")}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: headingColor, marginBottom: "2px" }}>💊 TMP-SMX TMP-Based Dosing</div>
            <div style={{ fontSize: "12px", color: mutedColor }}>Dose by TMP component, not by total tablet weight</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div style={fieldWrap}><label style={labelStyle}>Weight (kg)</label><input type="number" style={inputStyle} value={tmpWeight} onChange={(e) => setTmpWeight(e.target.value)} placeholder="70" /></div>
            <div style={fieldWrap}><label style={labelStyle}>TMP mg/kg/day</label><input type="number" style={inputStyle} value={tmpTarget} onChange={(e) => setTmpTarget(e.target.value)} placeholder="10" /></div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Doses / day</label>
              <select style={selectStyle} value={tmpDosesPerDay} onChange={(e) => setTmpDosesPerDay(e.target.value)}>
                <option value="2">BID</option>
                <option value="3">TID</option>
                <option value="4">QID</option>
              </select>
            </div>
          </div>
          <CalcBtn onClick={calcTmpSmx} />
          {tmpResult && (
            <div style={resultBox("#14b8a6")}>
              <ResultBadge value={`${tmpResult.totalTmpMgPerDay} mg`} label="TMP / day" color="#14b8a6" onCopy={makeCopy(`${tmpResult.totalTmpMgPerDay} mg`, "TMP/day")} />
              <ResultBadge value={`${tmpResult.tmpMgPerDose} mg`} label="TMP / dose" color="#14b8a6" onCopy={makeCopy(`${tmpResult.tmpMgPerDose} mg`, "TMP/dose")} />
              <ResultBadge value={`${tmpResult.dsTabsPerDose}`} label="DS tabs / dose" color="#0f766e" onCopy={makeCopy(`${tmpResult.dsTabsPerDose}`, "DS tabs")} />
            </div>
          )}
          <div style={{ fontSize: "11px", color: mutedColor, lineHeight: 1.5 }}>
            One double-strength tablet contains 160 mg TMP. Check potassium, creatinine, CBC, and pregnancy considerations before finalizing the regimen.
          </div>
        </div>

        {/* ── Colistin ── */}
        <div style={cardStyle("#f97316")}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: headingColor, marginBottom: "2px" }}>🧪 Colistin Unit Conversion</div>
            <div style={{ fontSize: "12px", color: mutedColor }}>CMS vs CBA safety check</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div style={fieldWrap}><label style={labelStyle}>Value</label><input type="number" style={inputStyle} value={colistinValue} onChange={(e) => setColistinValue(e.target.value)} placeholder="1" /></div>
            <div style={fieldWrap}>
              <label style={labelStyle}>Entered as</label>
              <select style={selectStyle} value={colistinUnit} onChange={(e) => setColistinUnit(e.target.value as "million_iu" | "cms_mg" | "cba_mg")}>
                <option value="million_iu">Million IU</option>
                <option value="cms_mg">CMS mg</option>
                <option value="cba_mg">CBA mg</option>
              </select>
            </div>
          </div>
          <CalcBtn onClick={calcColistin} />
          {colistinResult && (
            <div style={resultBox("#f97316")}>
              <ResultBadge value={`${colistinResult.millionIU}`} label="Million IU" color="#f97316" onCopy={makeCopy(`${colistinResult.millionIU}`, "Million IU")} />
              <ResultBadge value={`${colistinResult.cmsMg} mg`} label="CMS" color="#f97316" onCopy={makeCopy(`${colistinResult.cmsMg} mg`, "CMS")} />
              <ResultBadge value={`${colistinResult.cbaMg} mg`} label="CBA" color="#ea580c" onCopy={makeCopy(`${colistinResult.cbaMg} mg`, "CBA")} />
            </div>
          )}
          <div style={{ fontSize: "11px", color: mutedColor, lineHeight: 1.5 }}>
            Approximate conversion: 1 million IU ≈ 80 mg CMS ≈ 33 mg colistin base activity. Always confirm the local ordering convention before verifying a dose.
          </div>
        </div>

        {/* ── Azole TDM ── */}
        <div style={cardStyle("#8b5cf6")}>
          <div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: headingColor, marginBottom: "2px" }}>🍄 Azole TDM Support</div>
            <div style={{ fontSize: "12px", color: mutedColor }}>Voriconazole and posaconazole trough interpretation</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div style={fieldWrap}>
              <label style={labelStyle}>Agent</label>
              <select style={selectStyle} value={azoleAgent} onChange={(e) => setAzoleAgent(e.target.value as "voriconazole" | "posaconazole-prophylaxis" | "posaconazole-treatment")}>
                <option value="voriconazole">Voriconazole</option>
                <option value="posaconazole-prophylaxis">Posaconazole prophylaxis</option>
                <option value="posaconazole-treatment">Posaconazole treatment</option>
              </select>
            </div>
            <div style={fieldWrap}><label style={labelStyle}>Trough (mcg/mL)</label><input type="number" step="0.1" style={inputStyle} value={azoleTrough} onChange={(e) => setAzoleTrough(e.target.value)} placeholder="2.5" /></div>
          </div>
          <CalcBtn onClick={calcAzole} />
          {azoleResult && (
            <div style={resultBox("#8b5cf6")}>
              <ResultBadge value={azoleResult.goal} label="Target" color="#8b5cf6" onCopy={makeCopy(azoleResult.goal, "Azole target")} />
              <div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#8b5cf6" }}>{azoleResult.interpretation}</div>
                <div style={{ fontSize: "11px", color: mutedColor, lineHeight: 1.5, marginTop: "4px" }}>{azoleResult.action}</div>
              </div>
            </div>
          )}
          <div style={{ fontSize: "11px", color: mutedColor, lineHeight: 1.5 }}>
            Pair troughs with formulation review, food/acid-suppression effects, interaction management, and liver/QT monitoring when relevant.
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
