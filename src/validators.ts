import Ajv2020 from "ajv/dist/2020";
import type { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import * as path from "path";
import * as fs from "fs";

import type {
  Script,
  ScriptProps,
  AgentToolManifest,
  ScriptAction,
  ScriptStatus,
  EventStatus,
  ScriptActionLog,
  ScriptActionArtifactsSpec,
} from "./types";

const SCHEMA_DIR = path.resolve(
  path.dirname(require.resolve("@screenplan/contracts-schemas/package.json")),
  "screenplan_contracts_schemas",
  "schemas",
);

function loadSchema(file: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(path.join(SCHEMA_DIR, file), "utf8"));
}

/** Return the raw JSON schema for the given filename (e.g. "script.schema.json"). */
export function getSchema(name: string): Record<string, unknown> {
  return loadSchema(name);
}

/** List every `*.schema.json` filename shipped by @screenplan/contracts-schemas. */
export function listSchemas(): string[] {
  return fs
    .readdirSync(SCHEMA_DIR)
    .filter((f) => f.endsWith(".schema.json"))
    .sort();
}

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

// Register all schemas so $ref between files resolves.
const COMMON     = loadSchema("common.schema.json");
const ACTION     = loadSchema("script-action.schema.json");
const ACTION_DATA= loadSchema("script-action-data.schema.json");
const SCRIPT     = loadSchema("script.schema.json");
const STATUS     = loadSchema("script-status.schema.json");
const EVENT      = loadSchema("event-status.schema.json");
const LOG        = loadSchema("script-action-log.schema.json");
const ARTIFACTS  = loadSchema("script-action-artifacts.schema.json");

ajv.addSchema(COMMON,     "common.schema.json");
ajv.addSchema(ACTION,     "script-action.schema.json");
ajv.addSchema(ACTION_DATA,"script-action-data.schema.json");
ajv.addSchema(SCRIPT,    "script.schema.json");
ajv.addSchema(STATUS,    "script-status.schema.json");
ajv.addSchema(EVENT,     "event-status.schema.json");
ajv.addSchema(LOG,       "script-action-log.schema.json");
ajv.addSchema(ARTIFACTS, "script-action-artifacts.schema.json");

function compile<T>(schemaId: string): ValidateFunction<T> {
  return ajv.getSchema<T>(schemaId) as ValidateFunction<T>
    ?? ajv.compile<T>(loadSchema(schemaId));
}

function compileDef<T>(ref: string): () => ValidateFunction<T> {
  let fn: ValidateFunction<T> | undefined;
  return () => {
    if (!fn) {
      let got: ValidateFunction<T> | undefined;
      try { got = ajv.getSchema<T>(ref); } catch { got = undefined; }
      if (!got) throw new Error(`@screenplan/contracts: the installed @screenplan/contracts-schemas has no ${ref}; update it`);
      fn = got;
    }
    return fn;
  };
}

const vScript      = compile<Script>("script.schema.json");
// Compiled on first use, so an installed schemas package older than these
// $defs fails only the validators that need them, not the import.
const SCRIPT_ID    = SCRIPT.$id as string;
const vProps       = compileDef<ScriptProps>(`${SCRIPT_ID}#/$defs/ScriptProps`);
const vAgentTool   = compileDef<AgentToolManifest>(`${SCRIPT_ID}#/$defs/AgentToolManifest`);
const vAction      = compile<ScriptAction>("script-action.schema.json");
const vStatus      = compile<ScriptStatus>("script-status.schema.json");
const vEvent       = compile<EventStatus>("event-status.schema.json");
const vLog         = compile<ScriptActionLog>("script-action-log.schema.json");
const vArtifacts   = compile<ScriptActionArtifactsSpec>("script-action-artifacts.schema.json");

export class ContractValidationError extends Error {
  constructor(public readonly contract: string, public readonly errors: unknown) {
    super(`@screenplan/contracts: ${contract} validation failed: ${JSON.stringify(errors)}`);
  }
}

function makeValidator<T>(name: string, fnOrGetter: ValidateFunction<T> | (() => ValidateFunction<T>)) {
  const get = (): ValidateFunction<T> =>
    "schema" in fnOrGetter ? fnOrGetter : (fnOrGetter as () => ValidateFunction<T>)();
  return {
    is: (data: unknown): data is T => get()(data) as boolean,
    assert: (data: unknown): T => {
      const fn = get();
      if (!fn(data)) throw new ContractValidationError(name, fn.errors);
      return data as T;
    },
  };
}

export const validateScript           = makeValidator<Script>("Script", vScript);
/** A script's props.json. */
export const validateScriptProps      = makeValidator<ScriptProps>("ScriptProps", vProps);
/** props.agentTool alone: the shape only. Its inputs and outputs naming the script's own is checked where the script is merged. */
export const validateAgentToolManifest = makeValidator<AgentToolManifest>("AgentToolManifest", vAgentTool);
export const validateScriptAction     = makeValidator<ScriptAction>("ScriptAction", vAction);
export const validateScriptStatus     = makeValidator<ScriptStatus>("ScriptStatus", vStatus);
export const validateEventStatus      = makeValidator<EventStatus>("EventStatus", vEvent);
export const validateScriptActionLog  = makeValidator<ScriptActionLog>("ScriptActionLog", vLog);
export const validateArtifactsSpec    = makeValidator<ScriptActionArtifactsSpec>(
  "ScriptActionArtifactsSpec",
  vArtifacts,
);

export function getArtifactsSpec(): ScriptActionArtifactsSpec {
  const spec = JSON.parse(
    fs.readFileSync(path.join(SCHEMA_DIR, "script-action-artifacts.json"), "utf8"),
  );
  return validateArtifactsSpec.assert(spec);
}
