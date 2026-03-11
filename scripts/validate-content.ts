import { buildContentValidationIssues } from "../src/data/content-validation";
import { DISEASE_STATES } from "../src/data/index";

declare const console: { log: (...args: unknown[]) => void };
declare const process: { exit: (code?: number) => never };

function main() {
  const issues = buildContentValidationIssues(DISEASE_STATES).filter((issue) => issue.severity !== "info");
  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warn");

  console.log(`Content validation: ${DISEASE_STATES.length} diseases, ${errors.length} error(s), ${warnings.length} warning(s)`);
  issues.forEach((issue) => {
    const prefix = issue.severity === "error" ? "ERROR" : "WARN ";
    console.log(`${prefix} [${issue.scope}] ${issue.message}`);
  });

  if (errors.length > 0) {
    process.exit(1);
  }
}

main();
