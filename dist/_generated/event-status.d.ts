export type SequenceItem = CommandItem | VariableItem | ScriptItem | NestedSequenceItem;
/**
 * Entry shape used in running_events.json and completed_events.json. Each event is a 'sequence' tree composed of commands, variables, scripts, and nested sequences.
 */
/**
 * Entry shape used in running_events.json and completed_events.json. Each event is a 'sequence' tree composed of commands, variables, scripts, and nested sequences.
 */
export interface EventStatus {
    /**
     * UUID assigned by the controller.
     */
    event_id: string;
    type: "sequence";
    sequence_name: string;
    /**
     * Status used in Script-Engine-Controller queue files (running_scripts/completed_scripts).
     */
    status: string;
    /**
     * ISO-8601 string (e.g. 2026-04-29T06:00:00Z). May be absent on freshly-created entries.
     */
    start_time?: string | null;
    /**
     * ISO-8601 timestamp at which the event will time out, OR a duration string. TODO: pin to one form.
     */
    timeout?: string | null;
    end_time_str?: string | null;
    sequence: SequenceItem[];
    /**
     * Map of named sub-sequences referenced by 'script'/'sequence' items. TODO: confirm shape of values.
     */
    sequences?: {
        [k: string]: unknown;
    };
    [k: string]: unknown;
}
export interface CommandItem {
    type: "command";
    key: string;
    value: string | number | boolean | null;
    /**
     * Status used in Script-Engine-Controller queue files (running_scripts/completed_scripts).
     */
    status: string;
    [k: string]: unknown;
}
export interface VariableItem {
    type: "variable";
    key: string;
    value: unknown;
    /**
     * Status used in Script-Engine-Controller queue files (running_scripts/completed_scripts).
     */
    status: string;
    [k: string]: unknown;
}
export interface ScriptItem {
    type: "script";
    script_name: string;
    /**
     * Status used in Script-Engine-Controller queue files (running_scripts/completed_scripts).
     */
    status: string;
    [k: string]: unknown;
}
export interface NestedSequenceItem {
    type: "sequence";
    sequence_name: string;
    sequence: SequenceItem[];
    sequences?: {
        [k: string]: unknown;
    };
    /**
     * Status used in Script-Engine-Controller queue files (running_scripts/completed_scripts).
     */
    status: string;
    [k: string]: unknown;
}
