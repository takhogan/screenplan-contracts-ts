"use strict";
// Hand-written TypeScript types mirroring packages/screenplan-contracts/schemas.
// Source of truth is the JSON schema; keep field names in sync.
// TODO: replace with generated types (e.g. via `json-schema-to-typescript`) once
//       the schemas stabilise.
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCRIPT_ACTION_NAMES = void 0;
// ---------- Script / ScriptAction ----------
exports.SCRIPT_ACTION_NAMES = [
    "jointAction",
    "clickAction",
    "mouseScrollAction",
    "declareScene",
    "conditionalStatement",
    "shellScript",
    "logAction",
    "sleepStatement",
    "variableAssignment",
    "timeAction",
    "randomVariable",
    "scriptReference",
    "dragLocationSource",
    "dragLocationTarget",
    "detectObject",
    "keyboardAction",
    "searchPatternStartAction",
    "searchPatternContinueAction",
    "searchPatternEndAction",
    "randomizerAction",
    "jsonFileAction",
    "exceptionAction",
    "navigateAction",
    "ImageToTextAction",
    "scale",
    "sendMessageAction",
    "codeBlock",
    "forLoopAction",
    "ADBConfigurationAction",
    "colorCompareAction",
    "returnStatement",
    "imageTransformationAction",
    "countToThresholdAction",
    "fileIOAction",
    "maskMergeAction",
    "mouseMoveAction",
    "mouseInteractionAction",
    "userPromptAction",
    "calendarAction",
    "userSecretManagementAction",
    "interactApplicationAction",
];
