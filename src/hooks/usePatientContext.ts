import { useMemo } from "react";
import type { PatientContext } from "../types";
import {
  calculateAdjustedBodyWeight,
  calculateCreatinineClearance,
  calculateIdealBodyWeight,
} from "../utils/clinicalCalculators";
import { usePersistedState } from "../utils/persistence";
import { WORK_SESSION_PERSISTENCE } from "../utils/persistenceEnvelope";

export interface PatientDerived {
  patient: PatientContext;
  setPatient: (value: PatientContext | ((prev: PatientContext) => PatientContext)) => void;
  crcl: number | null;
  ibw: number | null;
  adjbw: number | null;
  isActive: boolean;
}

export function usePatientContext(): PatientDerived {
  const [patient, setPatient] = usePersistedState<PatientContext>("patientContext", {}, WORK_SESSION_PERSISTENCE);

  const crcl = useMemo((): number | null => calculateCreatinineClearance(patient), [patient]);

  const ibw = useMemo((): number | null => calculateIdealBodyWeight(patient.height, patient.sex), [patient.height, patient.sex]);

  const adjbw = useMemo((): number | null => calculateAdjustedBodyWeight(patient.weight, ibw), [ibw, patient.weight]);

  const isActive = Boolean(
    patient.age && patient.weight && patient.scr && patient.sex
  );

  return { patient, setPatient, crcl, ibw, adjbw, isActive };
}
