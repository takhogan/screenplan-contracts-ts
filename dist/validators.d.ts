import type { Script, ScriptProps, AgentToolManifest, ScriptAction, ScriptStatus, EventStatus, ScriptActionLog, ScriptActionArtifactsSpec, HostNotes } from "./types";
/** Return the raw JSON schema for the given filename (e.g. "script.schema.json"). */
export declare function getSchema(name: string): Record<string, unknown>;
/** List every `*.schema.json` filename shipped by @screenplan/contracts-schemas. */
export declare function listSchemas(): string[];
export declare class ContractValidationError extends Error {
    readonly contract: string;
    readonly errors: unknown;
    constructor(contract: string, errors: unknown);
}
export declare const validateScript: {
    is: (data: unknown) => data is Script;
    assert: (data: unknown) => Script;
};
/** A script's props.json. */
export declare const validateScriptProps: {
    is: (data: unknown) => data is ScriptProps;
    assert: (data: unknown) => ScriptProps;
};
/** props.agentTool alone: the shape only. Its inputs and outputs naming the script's own is checked where the script is merged. */
export declare const validateAgentToolManifest: {
    is: (data: unknown) => data is AgentToolManifest;
    assert: (data: unknown) => AgentToolManifest;
};
export declare const validateScriptAction: {
    is: (data: unknown) => data is ScriptAction;
    assert: (data: unknown) => ScriptAction;
};
export declare const validateScriptStatus: {
    is: (data: unknown) => data is ScriptStatus;
    assert: (data: unknown) => ScriptStatus;
};
export declare const validateEventStatus: {
    is: (data: unknown) => data is EventStatus;
    assert: (data: unknown) => EventStatus;
};
export declare const validateScriptActionLog: {
    is: (data: unknown) => data is ScriptActionLog;
    assert: (data: unknown) => ScriptActionLog;
};
export declare const validateArtifactsSpec: {
    is: (data: unknown) => data is ScriptActionArtifactsSpec;
    assert: (data: unknown) => ScriptActionArtifactsSpec;
};
/** A stored host-notes document (host-notes.schema.json). Its limits are checked by checkHostNotesDocument. */
export declare const validateHostNotes: {
    is: (data: unknown) => data is HostNotes;
    assert: (data: unknown) => HostNotes;
};
export declare function getArtifactsSpec(): ScriptActionArtifactsSpec;
