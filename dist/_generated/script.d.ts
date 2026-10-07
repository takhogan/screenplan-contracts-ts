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
    visualizerX: number;
    visualizerY: number;
    /**
     * ActionLink array; concrete shape varies by branchingBehavior.
     */
    childGroups: {
        [k: string]: unknown;
    }[];
    parentGroups: number[];
    displayables: {
        [k: string]: unknown;
    }[];
    configurables: {
        [k: string]: unknown;
    }[];
    linkingBehaviors: {
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
    selected: boolean;
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
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    width: number;
    height: number;
    scriptMode: "train" | "test" | "prod";
    deploymentToLibrary: boolean;
    /**
     * Embedded scriptReference props for nested scripts. TODO: tighten once ScriptReference shape is stable.
     */
    scriptReference?: {} | null;
    [k: string]: unknown;
}
