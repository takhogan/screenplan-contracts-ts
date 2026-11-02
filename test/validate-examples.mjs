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
  validateScriptProps,
  validateAgentToolManifest,
  validateArtifactsSpec,
  getArtifactsSpec,
} = await import(path.join(ROOT, "dist", "index.js"));

// CONTRACTS_DIR points at another checkout of screenplan-contracts, such as a
// worktree whose schemas are linked into node_modules.
const examplesDir = path.resolve(
  process.env.CONTRACTS_DIR ?? path.resolve(ROOT, "..", "screenplan-contracts"), "examples");

const cases = [
  { file: "script-status.example.json",     validator: validateScriptStatus },
  { file: "event-status.example.json",      validator: validateEventStatus },
  { file: "script-action-log.example.json", validator: validateScriptActionLog },
  { file: "script-props.example.json",      validator: validateScriptProps },
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

// A run stopped at an unapproved secret ends its action log with NEEDS_APPROVAL.
const actionLog = JSON.parse(fs.readFileSync(path.join(examplesDir, "script-action-log.example.json"), "utf8"));
try {
  validateScriptActionLog.assert({ ...actionLog, status: "NEEDS_APPROVAL" });
  console.log("  OK    action log with status NEEDS_APPROVAL accepted");
} catch (err) {
  failed += 1;
  console.error(`  FAIL  action log with status NEEDS_APPROVAL rejected: ${err.message}`);
}
if (validateScriptActionLog.is({ ...actionLog, status: "NEEDS_SOMETHING" })) {
  failed += 1;
  console.error("  FAIL  action log with an unknown status accepted");
} else {
  console.log("  OK    action log with an unknown status rejected");
}

// props.agentTool: the smallest manifest passes; each broken one fails.
const props = JSON.parse(fs.readFileSync(path.join(examplesDir, "script-props.example.json"), "utf8"));
const minimal = { description: "Reads the clock.", effects: "reads-device" };
try {
  validateAgentToolManifest.assert(minimal);
  validateScriptProps.assert({ ...props, agentTool: minimal });
  console.log("  OK    minimal agentTool accepted");
} catch (err) {
  failed += 1;
  console.error(`  FAIL  minimal agentTool rejected: ${err.message}`);
}
const badManifests = {
  "no description": { effects: "reads-device" },
  "empty description": { description: "", effects: "reads-device" },
  "no effects": { description: "x" },
  "unknown effects": { description: "x", effects: "writes-disk" },
  "name with capitals": { description: "x", effects: "reads-device", name: "OpenApp" },
  "name too long": { description: "x", effects: "reads-device", name: "a".repeat(65) },
  "input schema not an object": { description: "x", effects: "reads-device", inputs: { name: "string" } },
  "timeoutSeconds 0": { description: "x", effects: "reads-device", timeoutSeconds: 0 },
  "timeoutSeconds above 7200": { description: "x", effects: "reads-device", timeoutSeconds: 7201 },
  "timeoutSeconds not an integer": { description: "x", effects: "reads-device", timeoutSeconds: 1.5 },
  "unknown key": { description: "x", effects: "reads-device", secrets: ["password"] },
};
for (const [label, agentTool] of Object.entries(badManifests)) {
  if (validateScriptProps.is({ ...props, agentTool }) || validateAgentToolManifest.is(agentTool)) {
    failed += 1;
    console.error(`  FAIL  negative agentTool accepted: ${label}`);
  } else {
    console.log(`  OK    negative agentTool rejected: ${label}`);
  }
}

if (failed > 0) {
  console.error(`\n${failed} validation(s) failed`);
  process.exit(1);
}
console.log("\nAll example contracts validate.");
