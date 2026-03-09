import { useMemo } from "react";
import type { PatientContext } from "../types";
import { usePersistedState } from "../utils/persistence";

export interface PatientDerived {
  patient: PatientContext;
  setPatient: (value: PatientContext | ((prev: PatientContext) => PatientContext)) => void;
  crcl: number | null;
  ibw: number | null;
  adjbw: number | null;
  isActive: boolean;
}

export function usePatientContext(): PatientDerived {
  const [patient, setPatient] = usePersistedState<PatientContext>("patientContext", {});

  const crcl = useMemo((): number | null => {
    const { age, weight, scr, sex } = patient;
    if (!age || !weight || !scr || !sex || scr <= 0) return null;
    const sexFactor = sex === "female" ? 0.85 : 1;
    const raw = ((140 - age) * weight * sexFactor) / (72 * scr);
    return Math.max(0, Math.round(raw * 10) / 10);
  }, [patient]);

  const ibw = useMemo((): number | null => {
    const { height, sex } = patient;
    if (!height || !sex) return null;
    const heightInches = height / 2.54;
    const excessInches = heightInches - 60;
    if (excessInches < -10) return null;
    const base = sex === "male" ? 50 : 45.5;
    return Math.max(0, Math.round((base + 2.3 * excessInches) * 10) / 10);
  }, [patient]);

  const adjbw = useMemo((): number | null => {
    const { weight } = patient;
    if (!ibw || !weight) return null;
    if (weight <= ibw * 1.3) return null;
    return Math.round((ibw + 0.4 * (weight - ibw)) * 10) / 10;
  }, [ibw, patient]);

  const isActive = Boolean(
    patient.age && patient.weight && patient.scr && patient.sex
  );

  return { patient, setPatient, crcl, ibw, adjbw, isActive };
}
