import type {
  InstitutionAntibiogramEntry,
  DrugMonograph,
  EmpiricOption,
  InstitutionDrugPolicy,
  InstitutionOptionPolicy,
  InstitutionPathwayNote,
  InstitutionProfile,
} from "../types";

export const INSTITUTION_PROFILE: InstitutionProfile | null = {
  id: "pharmref-demo-health",
  name: "PharmRef Demo Health",
  lastUpdated: "2026-03-15",
  localNotes: [
    {
      diseaseId: "hap-vap",
      subcategoryId: "hap-mdr-risk",
      kind: "antibiogram",
      title: "Local anti-pseudomonal lens",
      detail: "Recent ICU antibiogram still favors cefepime over empiric meropenem when septic shock, prior ESBL, and recent cefepime exposure are absent.",
    },
    {
      diseaseId: "cap",
      subcategoryId: "cap-icu",
      kind: "workflow",
      title: "MRSA de-escalation protocol",
      detail: "If MRSA nares PCR is negative and no post-influenza necrotizing phenotype is present, stop empiric anti-MRSA therapy after 48-72 hours unless cultures prove MRSA.",
    },
    {
      diseaseId: "sepsis",
      subcategoryId: "septic-shock",
      kind: "restriction",
      title: "Carbapenem timeout",
      detail: "Any empiric carbapenem started for septic shock requires a documented 48-hour timeout note with culture review and de-escalation plan.",
    },
    {
      diseaseId: "amr-gn",
      subcategoryId: "cre-kpc",
      kind: "workflow",
      title: "Rapid carbapenemase escalation",
      detail: "Local microbiology validates same-shift carbapenemase PCR on Enterobacterales blood isolates. When KPC is confirmed and susceptibility is pending, stewardship defaults to meropenem-vaborbactam unless CNS penetration or formulary access favors another agent.",
    },
    {
      diseaseId: "advanced-agents",
      subcategoryId: "mdr-pseudomonas",
      kind: "antibiogram",
      title: "Novel anti-pseudomonal susceptibility lens",
      detail: "Recent DTR Pseudomonas isolates at Demo Health show higher retained activity to ceftolozane-tazobactam than ceftazidime-avibactam, so ceftolozane-tazobactam is the local first-look agent when MBL risk is low.",
    },
  ],
  optionPolicies: [
    {
      diseaseId: "hap-vap",
      subcategoryId: "hap-mdr-risk",
      monographId: "cefepime",
      status: "preferred",
      detail: "Local stewardship pathway prefers cefepime-based empiric coverage before escalating to a carbapenem when ESBL risk is not dominant.",
    },
    {
      diseaseId: "hap-vap",
      subcategoryId: "hap-mdr-risk",
      monographId: "meropenem",
      status: "restricted",
      detail: "Reserve empiric meropenem for septic shock, prior ESBL/CRE, or recent cefepime/piperacillin-tazobactam failure.",
      approval: "Document ID or AMS approval if used outside shock/ESBL criteria.",
    },
    {
      diseaseId: "cap",
      subcategoryId: "cap-icu",
      monographId: "linezolid",
      status: "preferred",
      detail: "Preferred local MRSA pneumonia agent when kidney injury makes vancomycin exposure undesirable.",
    },
    {
      diseaseId: "amr-gn",
      subcategoryId: "cre-kpc",
      monographId: "meropenem-vaborbactam",
      status: "preferred",
      detail: "Local CRE pathway prefers meropenem-vaborbactam first when KPC is confirmed and the isolate is susceptible because resistance emergence has been less frequent than with ceftazidime-avibactam.",
    },
    {
      diseaseId: "amr-gn",
      subcategoryId: "cre-mbl",
      monographId: "cefiderocol",
      status: "restricted",
      detail: "Reserve cefiderocol for intolerance, access barriers, or salvage when synchronized ceftazidime-avibactam plus aztreonam cannot be used.",
      approval: "ID approval required before first dose unless septic shock and MBL is strongly suspected.",
    },
  ],
  drugPolicies: [
    {
      drugId: "meropenem",
      restriction: "Carbapenem timeout required at 48 hours.",
      approval: "ID or AMS review for continuation beyond 72 hours without microbiologic justification.",
      preferredContexts: [
        "Septic shock with prior ESBL history",
        "Documented ESBL bacteremia or high-risk nosocomial pneumonia with prior beta-lactam exposure",
      ],
      notes: [
        "Extended-infusion administration is the local default.",
        "If cultures show cefepime-susceptible Pseudomonas or a narrow Enterobacterales isolate, de-escalate the same day susceptibilities result.",
      ],
    },
    {
      drugId: "linezolid",
      preferredContexts: [
        "MRSA pneumonia when avoiding vancomycin-associated AKI is a priority",
      ],
      notes: [
        "Serotonergic medication review is mandatory before the first dose.",
      ],
    },
    {
      drugId: "ceftazidime-avibactam",
      restriction: "Restricted advanced agent.",
      approval: "ID approval required before dispensing except for CRE septic shock while ID is being paged.",
      notes: [
        "Confirm carbapenemase mechanism whenever feasible because NDM/MBL producers need aztreonam pairing rather than ceftazidime-avibactam monotherapy.",
      ],
    },
    {
      drugId: "meropenem-vaborbactam",
      restriction: "Restricted to confirmed or strongly suspected KPC-producing Enterobacterales.",
      approval: "Stewardship approval required for continuation once carbapenemase testing is back.",
      preferredContexts: [
        "KPC-CRE bacteremia or pneumonia when susceptibility is pending but carbapenemase PCR is positive",
        "Ceftazidime-avibactam exposure within the prior 90 days",
      ],
      notes: [
        "Not a fallback for OXA-48 or MBL producers.",
        "Extended infusion over 3 hours is the local default and should not be shortened for convenience.",
      ],
    },
    {
      drugId: "cefiderocol",
      restriction: "Reserve agent for MBL-CRE, DTR Pseudomonas with limited alternatives, or CRAB salvage pathways.",
      approval: "ID approval required before dispensing outside the ICU resistant-pathogen pathway.",
      preferredContexts: [
        "Confirmed NDM/VIM/IMP producer when synchronized aztreonam pairing is not feasible",
        "DTR Pseudomonas with MBL risk or failure of first novel beta-lactam",
      ],
      notes: [
        "Document ARC assessment because q6h dosing may be needed when CrCl exceeds 120 mL/min.",
        "For CRAB, local pathway expects a second active agent rather than cefiderocol monotherapy.",
      ],
    },
  ],
  antibiogram: [
    {
      diseaseId: "hap-vap",
      subcategoryId: "hap-mdr-risk",
      drugId: "cefepime",
      organism: "Pseudomonas aeruginosa",
      sample: "2025 ICU respiratory isolates",
      susceptibility: "82% local susceptibility",
      source: "Demo Health ICU antibiogram 2025",
      status: "preferred",
      note: "Supports cefepime-first coverage when shock and ESBL pressure are absent.",
    },
    {
      diseaseId: "amr-gn",
      subcategoryId: "cre-kpc",
      drugId: "meropenem-vaborbactam",
      organism: "KPC-producing Enterobacterales",
      sample: "2025 bloodstream and respiratory isolates",
      susceptibility: "94% retained susceptibility",
      source: "Demo Health resistant-pathogen summary 2025",
      status: "preferred",
      note: "Local first-look KPC agent when carbapenemase PCR is positive.",
    },
    {
      diseaseId: "amr-gn",
      subcategoryId: "cre-kpc",
      drugId: "ceftazidime-avibactam",
      organism: "KPC-producing Enterobacterales",
      sample: "2025 bloodstream and respiratory isolates",
      susceptibility: "88% retained susceptibility",
      source: "Demo Health resistant-pathogen summary 2025",
      status: "caution",
      note: "Still active often, but prior ceftazidime-avibactam exposure has correlated with lower retained activity locally.",
    },
    {
      diseaseId: "amr-gn",
      subcategoryId: "cre-mbl",
      drugId: "cefiderocol",
      organism: "MBL-producing Enterobacterales",
      sample: "2025 regional referral isolates",
      susceptibility: "76% susceptible",
      source: "Demo Health referral CRE summary 2025",
      status: "caution",
      note: "Local use increases when synchronized aztreonam pairing is not feasible.",
    },
    {
      diseaseId: "advanced-agents",
      subcategoryId: "mdr-pseudomonas",
      drugId: "ceftolozane-tazobactam",
      organism: "DTR P. aeruginosa",
      sample: "2025 ICU respiratory isolates",
      susceptibility: "81% retained susceptibility",
      source: "Demo Health ICU novel beta-lactam antibiogram 2025",
      status: "preferred",
      note: "Local first-look agent when no MBL signal is present.",
    },
    {
      diseaseId: "advanced-agents",
      subcategoryId: "mdr-pseudomonas",
      drugId: "imipenem-cilastatin-relebactam",
      organism: "DTR P. aeruginosa",
      sample: "2025 ICU respiratory isolates",
      susceptibility: "73% retained susceptibility",
      source: "Demo Health ICU novel beta-lactam antibiogram 2025",
      status: "caution",
      note: "Useful backup when ceftolozane-tazobactam is not active or was recently used.",
    },
    {
      diseaseId: "advanced-agents",
      subcategoryId: "mdr-pseudomonas",
      drugId: "ceftazidime-avibactam",
      organism: "DTR P. aeruginosa",
      sample: "2025 ICU respiratory isolates",
      susceptibility: "67% retained susceptibility",
      source: "Demo Health ICU novel beta-lactam antibiogram 2025",
      status: "caution",
      note: "Review prior beta-lactam exposure and mechanism data before choosing it over ceftolozane-tazobactam.",
    },
    {
      drugId: "cefiderocol",
      organism: "CRAB and MBL-predominant gram-negatives",
      sample: "2025 reserve-agent dashboard",
      susceptibility: "Restricted-use local signal",
      source: "Demo Health reserve-agent dashboard 2025",
      status: "caution",
      note: "Stewardship treats cefiderocol as a reserve agent, not a reflex first choice, even when in vitro activity is present.",
    },
  ],
};

export interface InstitutionOptionOverlay {
  preferred: boolean;
  restricted: boolean;
  detail: string;
  approval?: string;
}

function matchesOptionPolicy(policy: InstitutionOptionPolicy, option: EmpiricOption) {
  if (policy.optionId && policy.optionId === option.id) return true;
  if (policy.monographId && policy.monographId === option.monographId) return true;
  if (policy.regimenIncludes && option.regimen.toLowerCase().includes(policy.regimenIncludes.toLowerCase())) return true;
  return false;
}

function matchesAntibiogramOption(entry: InstitutionAntibiogramEntry, option: EmpiricOption) {
  if (entry.drugId && entry.drugId === option.monographId) return true;
  if (entry.regimenIncludes && option.regimen.toLowerCase().includes(entry.regimenIncludes.toLowerCase())) return true;
  return false;
}

export function getInstitutionPathwayNotes(
  diseaseId: string,
  subcategoryId: string,
  profile: InstitutionProfile | null = INSTITUTION_PROFILE,
): InstitutionPathwayNote[] {
  if (!profile?.localNotes?.length) return [];
  return profile.localNotes.filter((note) => note.diseaseId === diseaseId && (!note.subcategoryId || note.subcategoryId === subcategoryId));
}

export function getInstitutionPathwayAntibiogram(
  diseaseId: string,
  subcategoryId: string,
  profile: InstitutionProfile | null = INSTITUTION_PROFILE,
): InstitutionAntibiogramEntry[] {
  if (!profile?.antibiogram?.length) return [];
  return profile.antibiogram.filter(
    (entry) =>
      entry.diseaseId === diseaseId &&
      (!entry.subcategoryId || entry.subcategoryId === subcategoryId),
  );
}

export function getInstitutionOptionOverlay(
  diseaseId: string,
  subcategoryId: string,
  option: EmpiricOption,
  profile: InstitutionProfile | null = INSTITUTION_PROFILE,
): InstitutionOptionOverlay | null {
  const policy = profile?.optionPolicies?.find((candidate) =>
    candidate.diseaseId === diseaseId &&
    candidate.subcategoryId === subcategoryId &&
    matchesOptionPolicy(candidate, option),
  );

  if (!policy) return null;

  return {
    preferred: policy.status === "preferred",
    restricted: policy.status === "restricted",
    detail: policy.detail,
    ...(policy.approval ? { approval: policy.approval } : {}),
  };
}

export function getInstitutionOptionAntibiogram(
  diseaseId: string,
  subcategoryId: string,
  option: EmpiricOption,
  profile: InstitutionProfile | null = INSTITUTION_PROFILE,
): InstitutionAntibiogramEntry[] {
  if (!profile?.antibiogram?.length) return [];
  return profile.antibiogram.filter(
    (entry) =>
      entry.diseaseId === diseaseId &&
      (!entry.subcategoryId || entry.subcategoryId === subcategoryId) &&
      matchesAntibiogramOption(entry, option),
  );
}

export function sortEmpiricOptionsForInstitution(
  diseaseId: string,
  subcategoryId: string,
  options: EmpiricOption[],
  profile: InstitutionProfile | null = INSTITUTION_PROFILE,
) {
  return options
    .map((option) => ({
      option,
      overlay: getInstitutionOptionOverlay(diseaseId, subcategoryId, option, profile),
    }))
    .sort((left, right) => {
      const leftRank = left.overlay?.preferred ? 0 : left.overlay?.restricted ? 2 : 1;
      const rightRank = right.overlay?.preferred ? 0 : right.overlay?.restricted ? 2 : 1;
      return leftRank - rightRank;
    });
}

export function getInstitutionDrugPolicy(
  drugId: string,
  profile: InstitutionProfile | null = INSTITUTION_PROFILE,
): InstitutionDrugPolicy | null {
  return profile?.drugPolicies?.find((policy) => policy.drugId === drugId) ?? null;
}

export function getInstitutionDrugAntibiogram(
  drugId: string,
  profile: InstitutionProfile | null = INSTITUTION_PROFILE,
): InstitutionAntibiogramEntry[] {
  if (!profile?.antibiogram?.length) return [];
  return profile.antibiogram.filter((entry) => entry.drugId === drugId);
}

export function flattenInstitutionAntibiogramEntries(entries: InstitutionAntibiogramEntry[]) {
  return entries
    .flatMap((entry) => [entry.organism, entry.sample, entry.susceptibility, entry.source, entry.note ?? "", entry.status ?? ""])
    .map((value) => value.trim())
    .filter(Boolean);
}

export function getInstitutionPathwaySearchText(
  diseaseId: string,
  subcategoryId: string,
  profile: InstitutionProfile | null = INSTITUTION_PROFILE,
) {
  return flattenInstitutionAntibiogramEntries(getInstitutionPathwayAntibiogram(diseaseId, subcategoryId, profile));
}

export function getInstitutionDrugSearchText(
  drugId: string,
  profile: InstitutionProfile | null = INSTITUTION_PROFILE,
) {
  return flattenInstitutionAntibiogramEntries(getInstitutionDrugAntibiogram(drugId, profile));
}

export function getInstitutionDrugNoteLines(
  monograph: Pick<DrugMonograph, "id">,
  profile: InstitutionProfile | null = INSTITUTION_PROFILE,
) {
  const policy = getInstitutionDrugPolicy(monograph.id, profile);
  if (!policy) return [];
  return [
    ...(policy.restriction ? [policy.restriction] : []),
    ...(policy.preferredContexts ?? []),
    ...(policy.notes ?? []),
  ];
}
