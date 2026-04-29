// Smoke test: validate every example JSON under packages/screenplan-contracts/examples
// against its corresponding schema. Run with `npm run validate`.
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const {
  validateScriptStatus,
  validateEventStatus,
  validateScriptActionLog,
  validateArtifactsSpec,
  getArtifactsSpec,
} = await import(path.join(ROOT, "dist", "index.js"));

const examplesDir = path.resolve(ROOT, "..", "screenplan-contracts", "examples");

const cases = [
  { file: "script-status.example.json",     validator: validateScriptStatus },
  { file: "event-status.example.json",      validator: validateEventStatus },
  { file: "script-action-log.example.json", validator: validateScriptActionLog },
];

let failed = 0;
for (const { file, validator } of cases) {
  const data = JSON.parse(fs.readFileSync(path.join(examplesDir, file), "utf8"));
  try {
    validator.assert(data);
    console.log(`  OK    ${file}`);
  } catch (err) {
    failed += 1;
    console.error(`  FAIL  ${file}: ${err.message}`);
  }
}

try {
  const spec = getArtifactsSpec();
  console.log(`  OK    artifacts spec (${Object.keys(spec.actions).length} actions)`);
} catch (err) {
  failed += 1;
  console.error(`  FAIL  artifacts spec: ${err.message}`);
}

// Negative: a bad ScriptStatus should fail.
try {
  validateScriptStatus.assert({ script_id: "x" });
  failed += 1;
  console.error("  FAIL  negative ScriptStatus accepted");
} catch {
  console.log("  OK    negative ScriptStatus rejected");
}

if (failed > 0) {
  console.error(`\n${failed} validation(s) failed`);
  process.exit(1);
}
console.log("\nAll example contracts validate.");
