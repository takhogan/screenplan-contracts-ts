/**
 * Target execution system for a Script/ScriptAction.
 */
export type SystemName = "python" | "adb" | "kvm" | "none";
/**
 * Status reported by ScriptEngine for a running or finished action/script. The first four are ScriptExecutionState values. The last three come from ScriptExecutionStatusDetail: script_executor.py calls script_logger.get_action_log().set_status(status_detail), which writes the detail into this same field, so a terminated run's node reports why it stopped rather than a bare FAILURE. Readers should treat every value except RUNNING and SUCCESS as a failure-like terminal state.
 */
export type RunStatus = "RUNNING" | "SUCCESS" | "FAILURE" | "ERROR" | "TIMED_OUT" | "MAX_ATTEMPTS" | "CANCELLED";
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
export type FilePair = {
    file_type: FileType;
    file_path: string;
} | {};
/**
 * Shared enums and small helpers used across other schemas.
 */
/**
 * Shared enums and small helpers used across other schemas.
 */
export interface CommonEnums {
    [k: string]: unknown;
}
