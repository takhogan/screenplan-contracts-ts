// Public type surface for @screenplan/contracts.
//
// Most types are generated from the JSON schemas in @screenplan/contracts-schemas
// (see scripts/codegen.mjs). This file is the curated barrel: it re-exports the
// generated types and adds the small runtime constants that the schemas can't
// express (e.g. `SCRIPT_ACTION_NAMES` for iteration at runtime).

export * from "./_generated/common";
export * from "./_generated/event-status";
export * from "./_generated/script-action-artifacts";
export * from "./_generated/script-action-data";
export * from "./_generated/script-action";
export * from "./_generated/script-action-log";
export * from "./_generated/script-status";
// `script.ts` also re-emits `ScriptAction` because the Script schema $refs it;
// re-export only the script-specific names to avoid a duplicate identifier.
export type { Script, ScriptActionRow, ScriptProps } from "./_generated/script";

// ---- runtime constants (not derivable from schema) ----

export const SCRIPT_ACTION_NAMES = [
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
] as const;

export type ScriptActionName = (typeof SCRIPT_ACTION_NAMES)[number];
