/**
 * A single ScriptAction node as authored in script-studio and consumed by ScriptEngine. The shape of `actionData` is discriminated on `actionName`; per-subtype payloads are defined in script-action-data.schema.json.
 */
export type ScriptAction = {
    [k: string]: unknown;
} & {
    /**
     * Discriminator for the ScriptAction subtype. Note: searchPatternStartAction / searchPatternContinueAction / searchPatternEndAction are deprecated — retained for loading legacy scripts; do not author new uses.
     */
    actionName: "jointAction" | "clickAction" | "mouseScrollAction" | "declareScene" | "conditionalStatement" | "shellScript" | "logAction" | "sleepStatement" | "variableAssignment" | "timeAction" | "randomVariable" | "scriptReference" | "dragLocationSource" | "dragLocationTarget" | "detectObject" | "keyboardAction" | "searchPatternStartAction" | "searchPatternContinueAction" | "searchPatternEndAction" | "randomizerAction" | "jsonFileAction" | "exceptionAction" | "navigateAction" | "ImageToTextAction" | "imageToTextAction" | "scale" | "sendMessageAction" | "codeBlock" | "forLoopAction" | "configurationAction" | "ADBConfigurationAction" | "colorCompareAction" | "returnStatement" | "imageTransformationAction" | "countToThresholdAction" | "fileIOAction" | "maskMergeAction" | "mouseMoveAction" | "mouseInteractionAction" | "userPromptAction" | "calendarAction" | "userSecretManagementAction" | "interactApplicationAction";
    /**
     * UI-only: icon descriptor (one of imageIcon|symbolIcon|svgIcon|textIcon|customIcon|blankIcon|gridIcon). Image references are persisted as relative paths or null.
     */
    actionIcon?: {} | string | null;
    /**
     * Per-actionName payload. Structure is selected by the oneOf below using actionName as discriminator.
     */
    actionData: {
        [k: string]: unknown;
    };
    actionGroup: number;
    /**
     * Only used by jointAction.
     */
    actionGroups?: number[];
    actionVersion: number;
    actionVersionCode: string;
    actionLabel: string;
    actionRowRowIndex: number;
    actionRowActionIndex: number;
    visualizerRowIndex: number;
    visualizerActionIndex: number;
    visualizerX?: number;
    visualizerY?: number;
    /**
     * ActionLink array; concrete shape varies by branchingBehavior.
     */
    childGroups: {
        [k: string]: unknown;
    }[];
    parentGroups: number[];
    displayables?: {
        [k: string]: unknown;
    }[];
    configurables?: {
        [k: string]: unknown;
    }[];
    linkingBehaviors?: {
        [k: string]: unknown;
    }[];
    /**
     * Per-action registry of files persisted under `assets/` (flat layout, since interfaceVersion 21). Each entry locates a file and the dot-path on the action where the loaded value should be placed at deserialise time.
     */
    actionAssets?: ScriptActionAsset[];
    selected?: boolean;
    draggable?: boolean;
    highlight?: string;
    helpTipExpanded?: boolean;
    [k: string]: unknown;
};
/**
 * Top-level Script document as edited in script-studio and executed by ScriptEngine.
 */
/**
 * Top-level Script document as edited in script-studio and executed by ScriptEngine.
 */
export interface Script {
    scriptName: string;
    actionRows: ScriptActionRow[];
    props: ScriptProps;
    dependencies: string[];
    /**
     * Tuples of [name, type, required].
     */
    inputs: [unknown, unknown, unknown][];
    outputs: [unknown, unknown, unknown][];
    scriptMeta: {
        editorStatus: "dirty" | "clean" | "error";
    };
    id: string;
    /**
     * Schema/feature version of this script. Version 21 introduces the flat `assets/` folder, the per-action `actionAssets[]` registry, and the `tmp/` runtime folder (renamed from `scriptAssets/`). Readers branch on this value; older scripts use the nested `actions/N-row/M-{actionName}/assets/...` layout.
     */
    interfaceVersion: number;
    lastLoadedTimestamp?: number;
}
export interface ScriptActionRow {
    actions: ScriptAction[];
    actionRowIndex: number;
    rowID: number;
    selected?: boolean;
}
/**
 * One persisted asset belonging to a ScriptAction. The flat `assets/` folder layout uses `filePath` to locate the file. `attributePath` is the dot-path within the action where the loaded value should be placed (numeric segments traverse arrays). `md5` is the hash of the file's bytes; populated when the asset is first registered (e.g. via `ScriptFlatAssetsUtils.addActionAsset`).
 */
export interface ScriptActionAsset {
    /**
     * Path relative to the script root, e.g. `assets/{md5}-{actionName}-{actionGroup}-{specificFileName}.{ext}`.
     */
    filePath: string;
    /**
     * Dot-path within the ScriptAction where the loaded value lives (e.g. `actionData.srcImg`, `actionData.positiveExamples.0.floatingObject.img`, `actionIcon.icon`, `actionIcon.grid.0.0.icon`).
     */
    attributePath: string;
    /**
     * Selects the loader: `image` => binary decoded with the platform's image library; `json`/`pointList` => `JSON.parse`; `text` => raw UTF-8.
     */
    assetType: "image" | "json" | "pointList" | "text";
    /**
     * Hex MD5 of the file's bytes.
     */
    md5: string;
    [k: string]: unknown;
}
export interface ScriptProps {
    /**
     * Target execution system for a Script/ScriptAction. Matches the prefix of the device id the action was recorded against: adb for avd:, bluestacks: and adb: devices, kvm for pikvm:, ios for an iPhone or iPad attached by USB (ios:<udid>), and python for the host desktop.
     */
    targetSystem: "python" | "adb" | "kvm" | "ios" | "none";
    width: number;
    height: number;
    scriptMode: "train" | "test" | "prod";
    deploymentToLibrary: boolean;
    /**
     * One to three lines: what the script does and when to run it. Shown to agents in list_scripts, so they can pick a script without reading it.
     */
    shortDescription?: string;
    /**
     * The longer account an agent reads before running the script: the state it expects to start from, the steps it takes from there, and the state it leaves the device in.
     */
    description?: string;
    /**
     * Embedded scriptReference props for nested scripts. TODO: tighten once ScriptReference shape is stable.
     */
    scriptReference?: {} | null;
    /**
     * Interface version 22+: the next actionGroup to allocate. Never goes down, so a deleted action's id is never reused (VERSIONING.md §4.7). Absent before v22.
     */
    actionGroupCounter?: number;
    /**
     * Interface version 22+: the next rowID to allocate. Never goes down (VERSIONING.md §4.7). Absent before v22.
     */
    rowIDCounter?: number;
    agentTool?: AgentToolManifest;
    [k: string]: unknown;
}
/**
 * props.agentTool, present when the script is served to agents as a typed tool: how an agent calls it as an MCP tool. Its name, what it does, its typed inputs and outputs, and what it does to the device. Secrets and user prompts are not declared here: the server derives them from the script's call tree. Versioned with the script, so approving a version approves its manifest too, and the semantic merge treats it as one value.
 */
export interface AgentToolManifest {
    /**
     * The MCP tool name within its toolkit. Absent, the server derives snake_case from the script name minus its {Area}_ prefix (VDI_OpenApp becomes open_app).
     */
    name?: string;
    /**
     * What the tool does, written for the agent that chooses it: the tool description it is served with.
     */
    description: string;
    /**
     * The tool's parameters: one JSON Schema per entry of the script's inputs.json, keyed by the same name. A name the script lacks, or a missing required input, fails validation when the script is merged.
     */
    inputs?: {
        [k: string]: AgentToolValueSchema;
    };
    /**
     * What a call returns: one JSON Schema per entry of the script's outputs.json, keyed by the same name.
     */
    outputs?: {
        [k: string]: AgentToolValueSchema;
    };
    /**
     * reads-device: it only looks (screens, OCR) and types nothing into an app. changes-device: anything else. Clients that tell read-only tools apart get it as the MCP readOnlyHint annotation.
     */
    effects: "reads-device" | "changes-device";
    /**
     * Calling the tool twice with the same inputs is safe. Served as the MCP idempotentHint annotation.
     */
    repeatable?: boolean;
    /**
     * Informational: the name of the script the tool calls first, such as the one that makes sure a session is open. The toolkit guide can mention it; the tool calls it itself either way.
     */
    precondition?: string;
    /**
     * How long a call waits for the script's run to finish.
     */
    timeoutSeconds?: number;
}
/**
 * A JSON Schema for one input or output value, such as { "type": "string", "description": "…" }. Any JSON Schema keyword is allowed.
 */
export interface AgentToolValueSchema {
    [k: string]: unknown;
}
