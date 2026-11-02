/**
 * Per-action log document written by ScriptEngine (action-log.json) and consumed by script-studio's log-tree viewer. Source of truth: ScriptEngine/common/logging/script_action_log.py::_flush.
 */
/**
 * Per-action log document written by ScriptEngine (action-log.json) and consumed by script-studio's log-tree viewer. Source of truth: ScriptEngine/common/logging/script_action_log.py::_flush.
 */
export interface ScriptActionLog {
    base_path: string;
    action_log_path: string;
    /**
     * UUID for this action log entry.
     */
    id: string;
    /**
     * Format: `<actionName>-<actionGroup>`.
     */
    name: string;
    /**
     * Target execution system for a Script/ScriptAction. Matches the prefix of the device id the action was recorded against: adb for avd:, bluestacks: and adb: devices, kvm for pikvm:, ios for an iPhone or iPad attached by USB (ios:<udid>), and python for the host desktop.
     */
    target_system: "python" | "adb" | "kvm" | "ios" | "none";
    script_name?: string | null;
    script_log_folder?: string | null;
    script_counter: number;
    log_object_type: "action" | "script";
    tree_entity_type: "node" | "child";
    /**
     * Status reported by ScriptEngine for a running or finished action/script. The first four are ScriptExecutionState values. TIMED_OUT, MAX_ATTEMPTS and CANCELLED come from ScriptExecutionStatusDetail: script_executor.py calls script_logger.get_action_log().set_status(status_detail), which writes the detail into this same field, so a terminated run's node reports why it stopped rather than a bare FAILURE. NEEDS_APPROVAL: the run stopped before reading a secret the caller had not approved (--approved-secrets); needs_approval.json in the run folder names the secret and the step. Readers should treat every value except RUNNING and SUCCESS as a failure-like terminal state.
     */
    status: "RUNNING" | "SUCCESS" | "FAILURE" | "ERROR" | "TIMED_OUT" | "MAX_ATTEMPTS" | "CANCELLED" | "NEEDS_APPROVAL";
    summary?: string;
    /**
     * UTC `YYYY-MM-DD HH:MM:SS.ffffff`.
     */
    start_time: string;
    /**
     * Seconds between start_time and the sync end (or now if still running).
     */
    elapsed: number;
    /**
     * Seconds between start_time and serialisation time (always real-time).
     */
    async_elapsed?: number;
    /**
     * ScriptActionLog file reference pair (file_type + file_path). Empty object {} means no file is attached.
     */
    pre_file: {
        /**
         * Type of a ScriptActionLog artifact file. overlay is a *.overlay.html log overlay: drawing instructions over a stored screenshot that render to the annotated image (see ScriptEngine common/logging/log_overlay.py).
         */
        file_type: "text" | "image" | "video" | "directory" | "overlay";
        file_path: string;
    } | {};
    /**
     * ScriptActionLog file reference pair (file_type + file_path). Empty object {} means no file is attached.
     */
    post_file: {
        /**
         * Type of a ScriptActionLog artifact file. overlay is a *.overlay.html log overlay: drawing instructions over a stored screenshot that render to the annotated image (see ScriptEngine common/logging/log_overlay.py).
         */
        file_type: "text" | "image" | "video" | "directory" | "overlay";
        file_path: string;
    } | {};
    supporting_files: ({
        /**
         * Type of a ScriptActionLog artifact file. overlay is a *.overlay.html log overlay: drawing instructions over a stored screenshot that render to the annotated image (see ScriptEngine common/logging/log_overlay.py).
         */
        file_type: "text" | "image" | "video" | "directory" | "overlay";
        file_path: string;
    } | {})[];
    children: ChildStub[];
    /**
     * Action-specific attributes. Currently set for scriptReference and detectObject. See artifacts spec for known keys.
     */
    attributes: {
        [k: string]: unknown;
    };
    [k: string]: unknown;
}
export interface ChildStub {
    id: string;
    script_counter: number;
    log_object_type: "action" | "script";
    tree_entity_type: "child";
    action_log_path: string;
}
