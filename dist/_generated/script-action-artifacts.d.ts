/**
 * Declarative mapping from each ScriptAction.actionName to the predictable set of pre/post/supplementary files that ScriptEngine is expected to attach to its ScriptActionLog. script-studio uses this to drive the Action Details viewer; ScriptEngine should use this as a contract when authoring new actions. TODO: cross-validate against actual executor implementations and fail CI on drift.
 */
/**
 * Declarative mapping from each ScriptAction.actionName to the predictable set of pre/post/supplementary files that ScriptEngine is expected to attach to its ScriptActionLog. script-studio uses this to drive the Action Details viewer; ScriptEngine should use this as a contract when authoring new actions. TODO: cross-validate against actual executor implementations and fail CI on drift.
 */
export interface ScriptActionArtifactsSpec {
    $schema?: string;
    _TODO?: string;
    version: number;
    actions: {
        [k: string]: ActionArtifactSpec;
    };
}
export interface ActionArtifactSpec {
    pre_file: FileSlot;
    post_file: FileSlot;
    supporting_files: FileSlot[];
    /**
     * Keys this action is expected to set in ScriptActionLog.attributes.
     */
    attributes?: {
        [k: string]: {
            presence: "always" | "optional";
            enum?: string[];
            description?: string;
        };
    };
}
export interface FileSlot {
    /**
     * Type of a ScriptActionLog artifact file.
     */
    file_type: "text" | "image" | "video" | "directory";
    /**
     * always = engine MUST emit; optional = MAY emit; never = engine MUST NOT emit (slot is empty {}).
     */
    presence: "always" | "optional" | "never";
    /**
     * Conventional filename suffix appended after the `<counter>-<actionName>-<group>-` log header.
     */
    name_suffix?: string;
    description?: string;
}
