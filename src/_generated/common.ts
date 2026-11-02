// AUTO-GENERATED from common.schema.json — do not edit by hand. Run `npm run codegen`.

/**
 * Target execution system for a Script/ScriptAction. Matches the prefix of the device id the action was recorded against: adb for avd:, bluestacks: and adb: devices, kvm for pikvm:, ios for an iPhone or iPad attached by USB (ios:<udid>), and python for the host desktop.
 */
export type SystemName = "python" | "adb" | "kvm" | "ios" | "none";
/**
 * Status reported by ScriptEngine for a running or finished action/script. The first four are ScriptExecutionState values. TIMED_OUT, MAX_ATTEMPTS and CANCELLED come from ScriptExecutionStatusDetail: script_executor.py calls script_logger.get_action_log().set_status(status_detail), which writes the detail into this same field, so a terminated run's node reports why it stopped rather than a bare FAILURE. NEEDS_APPROVAL: the run stopped before reading a secret the caller had not approved (--approved-secrets); needs_approval.json in the run folder names the secret and the step. Readers should treat every value except RUNNING and SUCCESS as a failure-like terminal state.
 */
export type RunStatus =
  | "RUNNING"
  | "SUCCESS"
  | "FAILURE"
  | "ERROR"
  | "TIMED_OUT"
  | "MAX_ATTEMPTS"
  | "CANCELLED"
  | "NEEDS_APPROVAL";
/**
 * Status used in Script-Engine-Controller queue files (running_scripts/completed_scripts).
 */
export type QueueStatus = string;
/**
 * Type of a ScriptActionLog artifact file. overlay is a *.overlay.html log overlay: drawing instructions over a stored screenshot that render to the annotated image (see ScriptEngine common/logging/log_overlay.py).
 */
export type FileType = "text" | "image" | "video" | "directory" | "overlay";
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
