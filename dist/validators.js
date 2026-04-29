"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateArtifactsSpec = exports.validateScriptActionLog = exports.validateEventStatus = exports.validateScriptStatus = exports.validateScriptAction = exports.validateScript = exports.ContractValidationError = void 0;
exports.getArtifactsSpec = getArtifactsSpec;
const _2020_1 = __importDefault(require("ajv/dist/2020"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const SCHEMA_DIR = path.resolve(__dirname, "..", "schemas");
function loadSchema(file) {
    return JSON.parse(fs.readFileSync(path.join(SCHEMA_DIR, file), "utf8"));
}
const ajv = new _2020_1.default({ allErrors: true, strict: false });
(0, ajv_formats_1.default)(ajv);
// Register all schemas so $ref between files resolves.
const COMMON = loadSchema("common.schema.json");
const ACTION = loadSchema("script-action.schema.json");
const SCRIPT = loadSchema("script.schema.json");
const STATUS = loadSchema("script-status.schema.json");
const EVENT = loadSchema("event-status.schema.json");
const LOG = loadSchema("script-action-log.schema.json");
const ARTIFACTS = loadSchema("script-action-artifacts.schema.json");
ajv.addSchema(COMMON, "common.schema.json");
ajv.addSchema(ACTION, "script-action.schema.json");
ajv.addSchema(SCRIPT, "script.schema.json");
ajv.addSchema(STATUS, "script-status.schema.json");
ajv.addSchema(EVENT, "event-status.schema.json");
ajv.addSchema(LOG, "script-action-log.schema.json");
ajv.addSchema(ARTIFACTS, "script-action-artifacts.schema.json");
function compile(schemaId) {
    return ajv.getSchema(schemaId)
        ?? ajv.compile(loadSchema(schemaId));
}
const vScript = compile("script.schema.json");
const vAction = compile("script-action.schema.json");
const vStatus = compile("script-status.schema.json");
const vEvent = compile("event-status.schema.json");
const vLog = compile("script-action-log.schema.json");
const vArtifacts = compile("script-action-artifacts.schema.json");
class ContractValidationError extends Error {
    constructor(contract, errors) {
        super(`shared-contracts: ${contract} validation failed: ${JSON.stringify(errors)}`);
        this.contract = contract;
        this.errors = errors;
    }
}
exports.ContractValidationError = ContractValidationError;
function makeValidator(name, fn) {
    return {
        is: (data) => fn(data),
        assert: (data) => {
            if (!fn(data))
                throw new ContractValidationError(name, fn.errors);
            return data;
        },
    };
}
exports.validateScript = makeValidator("Script", vScript);
exports.validateScriptAction = makeValidator("ScriptAction", vAction);
exports.validateScriptStatus = makeValidator("ScriptStatus", vStatus);
exports.validateEventStatus = makeValidator("EventStatus", vEvent);
exports.validateScriptActionLog = makeValidator("ScriptActionLog", vLog);
exports.validateArtifactsSpec = makeValidator("ScriptActionArtifactsSpec", vArtifacts);
function getArtifactsSpec() {
    const spec = JSON.parse(fs.readFileSync(path.join(SCHEMA_DIR, "script-action-artifacts.json"), "utf8"));
    return exports.validateArtifactsSpec.assert(spec);
}
