import Ajv2020 from "ajv/dist/2020";
import type { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import * as path from "path";
import * as fs from "fs";

import type {
  Script,
  ScriptAction,
  ScriptStatus,
  EventStatus,
  ScriptActionLog,
  ScriptActionArtifactsSpec,
} from "./types";

const SCHEMA_DIR = path.resolve(__dirname, "..", "schemas");

function loadSchema(file: string): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(path.join(SCHEMA_DIR, file), "utf8"));
}

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

// Register all schemas so $ref between files resolves.
const COMMON     = loadSchema("common.schema.json");
const ACTION     = loadSchema("script-action.schema.json");
const SCRIPT     = loadSchema("script.schema.json");
const STATUS     = loadSchema("script-status.schema.json");
const EVENT      = loadSchema("event-status.schema.json");
const LOG        = loadSchema("script-action-log.schema.json");
const ARTIFACTS  = loadSchema("script-action-artifacts.schema.json");

ajv.addSchema(COMMON,    "common.schema.json");
ajv.addSchema(ACTION,    "script-action.schema.json");
ajv.addSchema(SCRIPT,    "script.schema.json");
ajv.addSchema(STATUS,    "script-status.schema.json");
ajv.addSchema(EVENT,     "event-status.schema.json");
ajv.addSchema(LOG,       "script-action-log.schema.json");
ajv.addSchema(ARTIFACTS, "script-action-artifacts.schema.json");

function compile<T>(schemaId: string): ValidateFunction<T> {
  return ajv.getSchema<T>(schemaId) as ValidateFunction<T>
    ?? ajv.compile<T>(loadSchema(schemaId));
}

const vScript      = compile<Script>("script.schema.json");
const vAction      = compile<ScriptAction>("script-action.schema.json");
const vStatus      = compile<ScriptStatus>("script-status.schema.json");
const vEvent       = compile<EventStatus>("event-status.schema.json");
const vLog         = compile<ScriptActionLog>("script-action-log.schema.json");
const vArtifacts   = compile<ScriptActionArtifactsSpec>("script-action-artifacts.schema.json");

export class ContractValidationError extends Error {
  constructor(public readonly contract: string, public readonly errors: unknown) {
    super(`shared-contracts: ${contract} validation failed: ${JSON.stringify(errors)}`);
  }
}

function makeValidator<T>(name: string, fn: ValidateFunction<T>) {
  return {
    is: (data: unknown): data is T => fn(data) as boolean,
    assert: (data: unknown): T => {
      if (!fn(data)) throw new ContractValidationError(name, fn.errors);
      return data as T;
    },
  };
}

export const validateScript           = makeValidator<Script>("Script", vScript);
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
