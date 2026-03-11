const GENERATED_DISEASE_MODULES = [
  { sourceFile: "uti.js", exportName: "UTI", outputFile: "uti.ts", displayName: "UTI" },
  { sourceFile: "cap.js", exportName: "CAP", outputFile: "cap.ts", displayName: "CAP" },
  { sourceFile: "hap-vap.js", exportName: "HAP_VAP", outputFile: "hap-vap.ts", displayName: "HAP/VAP" },
  { sourceFile: "ssti.js", exportName: "SSTI", outputFile: "ssti.ts", displayName: "SSTI" },
  { sourceFile: "iai.js", exportName: "IAI", outputFile: "iai.ts", displayName: "IAI" },
  { sourceFile: "c-difficile.js", exportName: "CDI", outputFile: "c-difficile.ts", displayName: "C. difficile" },
  { sourceFile: "bone-joint.js", exportName: "BONE_JOINT", outputFile: "bone-joint.ts", displayName: "Bone/Joint" },
  {
    sourceFile: "cns-infections.js",
    exportName: "CNS_INFECTIONS",
    outputFile: "cns-infections.ts",
    displayName: "CNS Infections",
  },
  {
    sourceFile: "fungal-infections.js",
    exportName: "FUNGAL_INFECTIONS",
    outputFile: "fungal-infections.ts",
    displayName: "Fungal Infections",
  },
  {
    sourceFile: "advanced-agents.js",
    exportName: "ADVANCED_AGENTS",
    outputFile: "advanced-agents.ts",
    displayName: "Advanced Agents",
  },
  {
    sourceFile: "febrile-neutropenia.js",
    exportName: "FEBRILE_NEUTROPENIA",
    outputFile: "febrile-neutropenia.ts",
    displayName: "Febrile Neutropenia",
  },
  {
    sourceFile: "diabetic-foot.js",
    exportName: "DIABETIC_FOOT",
    outputFile: "diabetic-foot.ts",
    displayName: "Diabetic Foot",
  },
  { sourceFile: "sepsis.js", exportName: "SEPSIS", outputFile: "sepsis.ts", displayName: "Sepsis" },
  {
    sourceFile: "amr-gram-negative.js",
    exportName: "AMR_GN",
    outputFile: "amr-gram-negative.ts",
    displayName: "AMR GN",
  },
  {
    sourceFile: "bacteremia-endocarditis.js",
    exportName: "BACTEREMIA_ENDOCARDITIS",
    outputFile: "bacteremia-endocarditis.ts",
    displayName: "Bacteremia/Endocarditis",
  },
];

module.exports = { GENERATED_DISEASE_MODULES };
