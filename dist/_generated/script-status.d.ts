/**
 * Entry shape used in running_scripts.json and completed_scripts.json (Script-Engine-Controller queues, read by script-studio host-data service).
 */
/**
 * Entry shape used in running_scripts.json and completed_scripts.json (Script-Engine-Controller queues, read by script-studio host-data service).
 */
export interface ScriptStatus {
    /**
     * UUID assigned when the script enters the queue.
     */
    script_id: string;
    /**
     * Script name, or null for legacy/system entries that lacked a name.
     */
    script_name: string | null;
    /**
     * Status used in Script-Engine-Controller queue files (running_scripts/completed_scripts).
     */
    status: string;
    /**
     * Format: `<H>h<M>m`, e.g. "0h30m".
     */
    script_duration: string;
    /**
     * UTC "YYYY-MM-DD HH:MM:SS" — null until the script starts.
     */
    start_time_str?: string | null;
    end_time_str?: string | null;
    log_level?: string;
    notification_level?: string;
    /**
     * Either a structured object or a legacy device-id string (e.g. 'avd:Small_Phone_API_34'), or null.
     */
    device_details?: {
        [k: string]: unknown;
    } | string | null;
    system_script?: boolean;
    /**
     * Script constants/arguments. TODO: tighten once arg shape is finalized.
     */
    args?: unknown[];
    parallel?: boolean;
    script_log_folder?: string | null;
    /**
     * UI-only field added by script-studio. Should not be relied on server-side.
     */
    showDetails?: boolean;
    [k: string]: unknown;
}
