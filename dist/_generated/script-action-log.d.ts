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
     * Target execution system for a Script/ScriptAction.
     */
    target_system: "python" | "adb" | "kvm" | "none";
    script_name?: string | null;
    script_log_folder?: string | null;
    script_counter: number;
    log_object_type: "action" | "script";
    tree_entity_type: "node" | "child";
    /**
     * Status reported by ScriptEngine for a running or finished action/script.
     */
    status: "RUNNING" | "SUCCESS" | "FAILURE" | "ERROR";
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
         * Type of a ScriptActionLog artifact file.
         */
        file_type: "text" | "image" | "video" | "directory";
        file_path: string;
    } | {};
    /**
     * ScriptActionLog file reference pair (file_type + file_path). Empty object {} means no file is attached.
     */
    post_file: {
        /**
         * Type of a ScriptActionLog artifact file.
         */
        file_type: "text" | "image" | "video" | "directory";
        file_path: string;
    } | {};
    supporting_files: ({
        /**
         * Type of a ScriptActionLog artifact file.
         */
        file_type: "text" | "image" | "video" | "directory";
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
