// AUTO-GENERATED from common.schema.json — do not edit by hand. Run `npm run codegen`.

/**
 * Target execution system for a Script/ScriptAction.
 */
export type SystemName = "python" | "adb" | "kvm" | "none";
/**
 * Status reported by ScriptEngine for a running or finished action/script.
 */
export type RunStatus = "RUNNING" | "SUCCESS" | "FAILURE" | "ERROR";
/**
 * Status used in Script-Engine-Controller queue files (running_scripts/completed_scripts).
 */
export type QueueStatus = string;
/**
 * Type of a ScriptActionLog artifact file.
 */
export type FileType = "text" | "image" | "video" | "directory";
export type ScriptModePropEnum = "train" | "test" | "prod";
export type EditorStatusEnum = "dirty" | "clean" | "error";
/**
 * ScriptActionLog file reference pair (file_type + file_path). Empty object {} means no file is attached.
 */
export type FilePair =
  | {
      file_type: FileType;
      file_path: string;
    }
  | {};

/**
 * Shared enums and small helpers used across other schemas.
 */
/**
 * Shared enums and small helpers used across other schemas.
 */
export interface CommonEnums {
  [k: string]: unknown;
}
