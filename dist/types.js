"use strict";
// Public type surface for @screenplan/contracts.
//
// Most types are generated from the JSON schemas in @screenplan/contracts-schemas
// (see scripts/codegen.mjs). This file is the curated barrel: it re-exports the
// generated types and adds the small runtime constants that the schemas can't
// express (e.g. `SCRIPT_ACTION_NAMES` for iteration at runtime).
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCRIPT_ACTION_NAMES = void 0;
__exportStar(require("./_generated/common"), exports);
__exportStar(require("./_generated/event-status"), exports);
__exportStar(require("./_generated/script-action-artifacts"), exports);
__exportStar(require("./_generated/script-action-data"), exports);
__exportStar(require("./_generated/script-action"), exports);
__exportStar(require("./_generated/script-action-log"), exports);
__exportStar(require("./_generated/script-status"), exports);
// ---- runtime constants (not derivable from schema) ----
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
    "imageToTextAction",
    "scale",
    "sendMessageAction",
    "codeBlock",
    "forLoopAction",
    "configurationAction",
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
