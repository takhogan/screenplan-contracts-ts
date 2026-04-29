// Hand-written TypeScript types mirroring packages/screenplan-contracts/schemas.
// Source of truth is the JSON schema; keep field names in sync.
// TODO: replace with generated types (e.g. via `json-schema-to-typescript`) once
//       the schemas stabilise.

export type SystemName = "python" | "adb" | "kvm" | "none";

export type RunStatus = "RUNNING" | "SUCCESS" | "FAILURE" | "ERROR";

/** ScriptStatus.status / EventStatus.status — open string set, common values listed. */
export type QueueStatus = string;

export type FileType = "text" | "image" | "video" | "directory";

export type ScriptMode = "train" | "test" | "prod";

export type EditorStatus = "dirty" | "clean" | "error";

// ---------- Script / ScriptAction ----------

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
] as const;

export type ScriptActionName = (typeof SCRIPT_ACTION_NAMES)[number];

export interface ScriptActionBaseFields {
  actionGroup: number;
  actionVersion: number;
  actionVersionCode: string;
  actionLabel: string;
  actionRowRowIndex: number;
  actionRowActionIndex: number;
  visualizerRowIndex: number;
  visualizerActionIndex: number;
  visualizerX: number;
  visualizerY: number;
  childGroups: Array<Record<string, unknown>>;
  parentGroups: number[];
  displayables: Array<Record<string, unknown>>;
  configurables: Array<Record<string, unknown>>;
  linkingBehaviors: Array<Record<string, unknown>>;
  selected?: boolean;
  draggable?: boolean;
  highlight?: string;
  helpTipExpanded?: boolean;
}

export interface ScriptActionDataBase {
  targetSystem: SystemName;
  [key: string]: unknown;
}

/** Generic ScriptAction envelope. The 41 subtypes are discriminated by `actionName`;
 *  per-subtype `actionData` shapes live in script-studio for now. TODO: lift them here. */
export interface ScriptAction extends ScriptActionBaseFields {
  actionName: ScriptActionName;
  actionIcon?: unknown;
  actionData: ScriptActionDataBase;
  actionGroups?: number[];
}

export interface ScriptActionRow {
  actions: ScriptAction[];
  actionRowIndex: number;
  rowID: number;
  selected: boolean;
}

export interface ScriptProps {
  targetSystem: SystemName;
  width: number;
  height: number;
  scriptMode: ScriptMode;
  deploymentToLibrary: boolean;
  scriptReference?: Record<string, unknown> | null;
  [key: string]: unknown;
}

export interface ScriptMeta {
  editorStatus: EditorStatus;
}

export interface Script {
  scriptName: string;
  actionRows: ScriptActionRow[];
  props: ScriptProps;
  dependencies: string[];
  inputs: Array<[string, string, boolean]>;
  outputs: Array<[string, string, boolean]>;
  scriptMeta: ScriptMeta;
  id: string;
  interfaceVersion: number;
  lastLoadedTimestamp?: number;
}

// ---------- Queue entries ----------

export interface ScriptStatus {
  script_id: string;
  script_name: string;
  status: QueueStatus;
  script_duration: string;
  start_time_str: string | null;
  end_time_str: string | null;
  log_level: string;
  notification_level: string;
  device_details: Record<string, unknown> | null;
  system_script: boolean;
  args: unknown[];
  parallel: boolean;
  script_log_folder: string | null;
  /** UI-only; set by script-studio. */
  showDetails?: boolean;
}

export type EventSequenceItem =
  | { type: "command"; key: string; value: string | number | boolean | null; status: QueueStatus; [k: string]: unknown }
  | { type: "variable"; key: string; value: unknown; status: QueueStatus; [k: string]: unknown }
  | { type: "script"; script_name: string; status: QueueStatus; [k: string]: unknown }
  | {
      type: "sequence";
      sequence_name: string;
      sequence: EventSequenceItem[];
      sequences?: Record<string, unknown>;
      status: QueueStatus;
      [k: string]: unknown;
    };

export interface EventStatus {
  event_id: string;
  type: "sequence";
  sequence_name: string;
  status: QueueStatus;
  start_time?: string | null;
  timeout?: string | null;
  end_time_str?: string | null;
  sequence: EventSequenceItem[];
  sequences?: Record<string, unknown>;
}

// ---------- ScriptActionLog ----------

export type ScriptActionLogFile =
  | { file_type: FileType; file_path: string }
  | Record<string, never>; // empty {} when no file

export interface ScriptActionLogChildStub {
  id: string;
  script_counter: number;
  log_object_type: "action" | "script";
  tree_entity_type: "child";
  action_log_path: string;
}

export interface ScriptActionLog {
  base_path: string;
  action_log_path: string;
  id: string;
  name: string;
  target_system: SystemName;
  script_name: string | null;
  script_log_folder: string | null;
  script_counter: number;
  log_object_type: "action" | "script";
  tree_entity_type: "node" | "child";
  status: RunStatus;
  summary: string;
  start_time: string;
  elapsed: number;
  async_elapsed: number;
  pre_file: ScriptActionLogFile;
  post_file: ScriptActionLogFile;
  supporting_files: ScriptActionLogFile[];
  children: ScriptActionLogChildStub[];
  attributes: Record<string, unknown>;
}

// ---------- Artifact spec ----------

export type ArtifactPresence = "always" | "optional" | "never";

export interface ArtifactFileSlot {
  file_type: FileType;
  presence: ArtifactPresence;
  name_suffix?: string;
  description?: string;
}

export interface ArtifactAttributeSpec {
  presence: "always" | "optional";
  enum?: string[];
  description?: string;
}

export interface ActionArtifactSpec {
  pre_file: ArtifactFileSlot;
  post_file: ArtifactFileSlot;
  supporting_files: ArtifactFileSlot[];
  attributes?: Record<string, ArtifactAttributeSpec>;
}

export interface ScriptActionArtifactsSpec {
  version: number;
  actions: Record<string, ActionArtifactSpec>;
}
