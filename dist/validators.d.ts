import type { Script, ScriptAction, ScriptStatus, EventStatus, ScriptActionLog, ScriptActionArtifactsSpec } from "./types";
export declare class ContractValidationError extends Error {
    readonly contract: string;
    readonly errors: unknown;
    constructor(contract: string, errors: unknown);
}
export declare const validateScript: {
    is: (data: unknown) => data is Script;
    assert: (data: unknown) => Script;
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
export declare function getArtifactsSpec(): ScriptActionArtifactsSpec;
