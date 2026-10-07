export type ProgrammingLanguage = "python";
export type BoundType = "fullScreen" | "fullWindow" | "customBounds";
export type TargetContext = "screen" | "searchArea" | "detectResult";
/**
 * @minItems 2
 * @maxItems 2
 */
export type Point2D = [number, number];
/**
 * @minItems 2
 * @maxItems 2
 */
export type Rect2D = [Point2D, Point2D];
/**
 * @minItems 3
 * @maxItems 3
 */
export type RGB = [number, number, number];
/**
 * On-disk persisted image reference. At interfaceVersion >= 21 this is null on the action's actionData; the file lives under `assets/` and is registered in the action's `actionAssets[]`. At older versions it is a relative path string pointing into `actions/N-row/M-{actionName}/assets/...`. Authoring-time Blob/ImageData is unloaded to either form before serialisation.
 */
export type ImageRef = string | null;
export type CanvasShape = {
    shape: "circle";
    shapeX: number;
    shapeY: number;
    radius: number;
    fillType: "fill";
    [k: string]: unknown;
} | {
    shape: "rectangle";
    shapeX: number;
    shapeY: number;
    width: number;
    height: number;
    fillType: "fill";
    [k: string]: unknown;
};
export type CanvasShapeRows = CanvasShape[][];
export type ClickActionData = DetectTypeData & RandomVariableTypeData & {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    targetContext?: TargetContext;
    pointList?: Point2D[];
    icon?: ImageRef;
    inputExpression?: string | null;
    clickCount?: number | string;
    mouseButton?: "left" | "right";
    postActionDelay?: string | number;
    [k: string]: unknown;
};
export type MouseScrollActionData = DetectTypeData & {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    targetContext?: TargetContext;
    pointList?: Point2D[];
    icon?: ImageRef;
    inputExpression?: string | null;
    scrollDistance?: number | string;
    [k: string]: unknown;
};
export type DeclareSceneData = DetectTypeData & {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    targetContext?: TargetContext;
    location?: Point2D;
    searchArea?: Rect2D;
    boundType?: BoundType;
    icon?: ImageRef;
    /**
     * @minItems 2
     * @maxItems 2
     */
    maskLocation?: [Point2D, Point2D] | null;
    [k: string]: unknown;
};
export type RandomVariableData = RandomVariableTypeData & {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    [k: string]: unknown;
};
export type DragLocationData = DetectTypeData & {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    targetContext?: TargetContext;
    pointList?: Point2D[];
    icon?: ImageRef;
    inputExpression?: string | null;
    dragType?: "slow" | "fast" | null;
    postActionDelay?: string | number;
    [k: string]: unknown;
};
export type DetectObjectData = DetectTypeData & {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    targetContext?: TargetContext;
    searchArea?: Rect2D;
    maxMatches?: number | string;
    heightScale?: string | number;
    widthScale?: string | number;
    [k: string]: unknown;
};
export type KeyboardActionData = RandomVariableTypeData & {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    keyboardExpression?: string;
    keyboardActionType?: "keyPress" | "keyDown" | "keyUp" | "hotkey";
    postActionDelay?: string | number;
    [k: string]: unknown;
};
export type MouseInteractionActionData = RandomVariableTypeData & {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    sourceDetectTypeData?: DetectTypeData;
    sourcePointList?: Point2D[] | string;
    clickCount?: number | string;
    mouseButton?: "left" | "right";
    postActionDelay?: string | number;
    scrollDistance?: number | string;
    mouseActionType?: "click" | "mouseDown" | "mouseUp" | "scroll";
    betweenClickDelay?: boolean;
    randomVariableTypeData?: RandomVariableTypeData;
    [k: string]: unknown;
};
/**
 * Per-subtype `actionData` payload schemas for every ScriptAction subtype. Mirrors the TypeScript ActionData union in script-studio's editor/interfaces/script-action-types.ts. On-disk representations differ from authoring-time types: (1) at interfaceVersion >= 21 (flat-assets format), Blob/SafeUrl/ImageData fields and JSON-asset fields (e.g. sourcePointList) are persisted as null on the action — the file lives under `assets/` and is registered in the per-action `actionAssets` array; (2) at older interfaceVersion, those fields hold relative file-path strings pointing into the legacy `actions/N-row/M-action/assets/...` tree; (3) historic scripts may carry legacy fields no longer authored, so each subtype keeps additionalProperties:true and a small `required` list.
 */
/**
 * Per-subtype `actionData` payload schemas for every ScriptAction subtype. Mirrors the TypeScript ActionData union in script-studio's editor/interfaces/script-action-types.ts. On-disk representations differ from authoring-time types: (1) at interfaceVersion >= 21 (flat-assets format), Blob/SafeUrl/ImageData fields and JSON-asset fields (e.g. sourcePointList) are persisted as null on the action — the file lives under `assets/` and is registered in the per-action `actionAssets` array; (2) at older interfaceVersion, those fields hold relative file-path strings pointing into the legacy `actions/N-row/M-action/assets/...` tree; (3) historic scripts may carry legacy fields no longer authored, so each subtype keeps additionalProperties:true and a small `required` list.
 */
export interface ScriptActionData {
    [k: string]: unknown;
}
/**
 * Distribution sampling parameters. Newer fields (normalDist* /uniformDist*) coexist with legacy fields (min/max/mean/stddev/distType) on disk.
 */
export interface RandomVariableTypeData {
    distributionType?: "uniform" | "normal";
    normalDistMin?: number | string;
    normalDistMax?: number | string;
    normalDistMean?: number | string;
    normalDistStdDev?: number | string;
    uniformDistMin?: number | string;
    uniformDistMax?: number | string;
    outputVarName?: string;
    [k: string]: unknown;
}
export interface DetectTypeImageMaskPair {
    detectType?: string;
    pairIndex?: number;
    img?: ImageRef;
    mask?: ImageRef;
    containedAreaMask?: ImageRef;
    icon?: ImageRef;
    centerPoint?: Point2D;
    sourceScreenWidth?: number;
    sourceScreenHeight?: number;
    [k: string]: unknown;
}
/**
 * One capture: floating and/or fixed positive examples. Some legacy entries carry the bare DetectTypeImageMaskPair shape directly.
 */
export interface DetectTypePositiveExamplePair {
    type?: string;
    floatingObject?: DetectTypeImageMaskPair;
    fixedObject?: DetectTypeImageMaskPair;
    [k: string]: unknown;
}
/**
 * Detector configuration shared by detectObject, click/drag/mouse-* actions, etc. Image fields persist as relative paths or null.
 */
export interface DetectTypeData {
    icon?: ImageRef;
    detectorName?: "pixelDifference" | "logisticClassifier" | "convNet";
    includeContainedAreaInOutput?: boolean;
    excludeMatchedAreaFromOutput?: boolean;
    threshold?: number | string;
    inputExpression?: string | null;
    outputVarName?: string;
    resuseScreenshotBetweenActions?: boolean;
    useColor?: boolean;
    useOriginalImageOnly?: boolean;
    useImageRescaledToScreenOnly?: boolean;
    detectorMode?: "training" | "active" | "inactive";
    srcImg?: ImageRef;
    srcShape?: CanvasShapeRows;
    srcScaleFactor?: number;
    positiveExamples?: DetectTypePositiveExamplePair[];
    negativeExamples?: DetectTypeImageMaskPair[];
    /**
     * @minItems 2
     * @maxItems 2
     */
    sceneLocation?: [Point2D, Point2D] | null;
    /**
     * @minItems 2
     * @maxItems 2
     */
    maskLocation?: [Point2D, Point2D] | null;
    matchMode?: "firstMatch" | "bestMatch";
    detectActionType?: "floatingObject" | "fixedObject";
    skipDetection?: boolean;
    [k: string]: unknown;
}
export interface ConditionalStatementData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    condition: string;
    conditionLanguage?: ProgrammingLanguage;
    [k: string]: unknown;
}
export interface JointActionData {
    [k: string]: unknown;
}
export interface ShellScriptActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    cwd?: string;
    shellScript: string;
    awaitScript?: boolean;
    pipeOutputVarName?: string | null;
    returnCodeOutputVarName?: string | null;
    openInNewWindow?: boolean;
    [k: string]: unknown;
}
export interface LogActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    logType?: "logVariable" | "logImage";
    logValue?: string;
    logFile?: string;
    [k: string]: unknown;
}
export interface SleepStatementData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    inputExpression?: string | number;
    [k: string]: unknown;
}
export interface VariableAssignmentData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    outputVarName?: string;
    inputExpression?: string;
    expressionLanguage?: ProgrammingLanguage;
    inputParser?: "eval" | "jsonload";
    setIfNull?: boolean;
    [k: string]: unknown;
}
export interface TimeActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    timeActionType?: "getCurrentDateTime";
    timezone?: "local" | "utc";
    outputVarName?: string;
    [k: string]: unknown;
}
export interface ScriptReferenceData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    scriptName: string;
    scriptAttributes?: ("searchAreaErrorHandler" | "searchAreaObjectHandler" | "searchAreaExcluded")[];
    branchingBehavior?: "firstMatch" | "attemptAllBranches";
    runMode?: "run" | "runOne" | "runToFailure";
    actionOrder?: "sequential" | "random";
    scriptMaxActionAttempts?: string | number;
    onOutOfActionAttempts?: string;
    libraryScript?: boolean;
    postActionDelay?: string | number;
    [k: string]: unknown;
}
/**
 * @deprecated
 * DEPRECATED: searchPattern* actions are deprecated. Schema retained for loading legacy scripts; do not author new uses.
 */
export interface SearchPatternStartActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    searchPatternID: string;
    searchPatterns?: string[];
    searchPatternProbabilities?: number[];
    inputExpression?: string | null;
    draggableArea?: ImageRef;
    gridMode?: "training" | "active" | "inactive";
    [k: string]: unknown;
}
/**
 * @deprecated
 * DEPRECATED: searchPattern* actions are deprecated. Schema retained for loading legacy scripts; do not author new uses.
 */
export interface SearchPatternContinueActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    searchPatternID: string;
    gridMode?: "training" | "active" | "inactive";
    recordSearchAreaMap?: boolean;
    [k: string]: unknown;
}
/**
 * @deprecated
 * DEPRECATED: searchPattern* actions are deprecated. Schema retained for loading legacy scripts; do not author new uses.
 */
export interface SearchPatternEndActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    searchPatternID: string;
    gridMode?: "training" | "active" | "inactive";
    generateSearchAreaMap?: boolean;
    [k: string]: unknown;
}
export interface RandomizerActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    randomizerBehavior?: "randomizer" | "randomQueue";
    preferences?: string;
    [k: string]: unknown;
}
export interface JSONFileActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    mode?: "read" | "write";
    fileName?: string;
    varName?: string;
    fileContents?: string;
    [k: string]: unknown;
}
export interface ExceptionActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    exceptionMessage?: string;
    takeScreenshot?: boolean;
    exceptionID?: string;
    exitProgram?: boolean;
    [k: string]: unknown;
}
export interface NavigateActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    inputExpression?: string;
    maxNavigateAttempts?: number | string;
    [k: string]: unknown;
}
export interface ImageToTextActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    targetContext?: TargetContext;
    inputExpression?: string;
    outputVarName?: string;
    conversionEngine?: "tesseractOCR" | "easyOCR";
    characterWhiteList?: string;
    targetType?: "character" | "word" | "sentence" | "page" | "rawLine";
    runMode?: "normal" | "debug";
    increaseContrast?: boolean;
    invertColors?: boolean;
    blur?: "false" | "medianBlur" | "gaussianBlur" | "bilateralFilter";
    binarize?: "false" | "regular" | "adaptive";
    makeBorder?: boolean;
    [k: string]: unknown;
}
export interface ScaleData {
    dataRows?: number[][];
    sourceWidth?: number;
    sourceHeight?: number;
    dataLabels?: {
        heightLabels?: number[];
        widthLabels?: number[];
        [k: string]: unknown;
    };
    xCoefficient?: number;
    useXCoefficient?: boolean;
    yCoefficient?: number;
    useYCoefficient?: boolean;
    constantTerm?: number;
    scaleTarget?: "height" | "width";
    [k: string]: unknown;
}
export interface SendMessageActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem?: "python" | "adb" | "kvm" | "none";
    subject?: string;
    messagingProvider?: "viber" | "email";
    inputExpression?: string;
    messageType?: "image" | "text";
    messagingChannelName?: string;
    [k: string]: unknown;
}
export interface CodeBlockActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    codeBlock?: string;
    interpreter?: "python";
    async?: boolean;
    expandedVisualization?: boolean;
    expandedWidthCols?: number;
    expandedHeightRows?: number;
    [k: string]: unknown;
}
export interface ForLoopActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    forVariables?: string;
    inVariables?: string;
    operatorType?: "startLoop" | "endLoop";
    [k: string]: unknown;
}
export interface ConfigurationActionData {
    configurationType: string;
    [k: string]: unknown;
}
export interface ADBConfigurationData {
    configurationType: "adb";
    adbPath?: string;
    emulatorType?: "bluestacks";
    deviceName?: string;
    windowName?: string;
    adbPort?: string | number;
    emulatorPath?: string;
    autoDetectAdbPort?: boolean;
    targetSystem?: "adb";
    [k: string]: unknown;
}
export interface ColorCompareActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem?: "python" | "adb" | "kvm" | "none";
    icon?: ImageRef;
    inputExpression?: string;
    outputVarName?: string;
    threshold?: number | string;
    referenceColor?: RGB;
    referenceImage?: string;
    compareMode?: "mean" | "mode";
    sourceDetectTypeData?: DetectTypeData;
    [k: string]: unknown;
}
export interface ReturnStatementActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem?: "python" | "adb" | "kvm" | "none";
    returnStatementType?: "exitIteration" | "exitScript" | "exitProgram";
    returnStatus?: "success" | "failure";
    [k: string]: unknown;
}
export interface ImageTransformationActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    transformationType?: "blur" | "binarize" | "antialias" | "resize" | "erode" | "dilate" | "convertColor";
    inputExpression?: string;
    outputVarName?: string;
    blurType?: "false" | "medianBlur" | "gaussianBlur" | "bilateralFilter";
    blurKernelSize?: number | string;
    binarizeType?: "false" | "regular" | "adaptive";
    antialiasScaleFactor?: number | string;
    resizeScaleFactor?: number | string;
    erodeKernelSize?: number | string;
    erodeIterations?: number | string;
    dilateKernelSize?: number | string;
    dilateIterations?: number | string;
    convertColorType?: "none" | "BGRtoGrayScale" | "invert";
    [k: string]: unknown;
}
export interface CountToThresholdActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    counterVarName?: string;
    counterThreshold?: string | number;
    incrementBy?: string | number;
    initialValue?: string | number;
    thresholdType?: "counter" | "timer";
    counterThresholdSeconds?: string | number;
    resetCounterAfterBreached?: boolean;
    [k: string]: unknown;
}
export interface FileIOActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    fileActionType?: "w" | "r" | "wb" | "rb" | "a";
    fileType?: "image" | "text" | "json";
    inputExpression?: string;
    outputVarName?: string;
    filePath?: string;
    async?: boolean;
    [k: string]: unknown;
}
export interface MaskMergeActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    leftInputExpression?: string;
    rightInputExpression?: string;
    joinLeftAt?: "angle" | "topLeft" | "top" | "topRight" | "right" | "bottomRight" | "bottom" | "bottomLeft" | "left";
    joinLeftAngle?: string | number;
    joinRightAt?: "angle" | "topLeft" | "top" | "topRight" | "right" | "bottomRight" | "bottom" | "bottomLeft" | "left";
    joinRightAngle?: string | number;
    leftMaskPositioning?: "floating" | "fixed";
    rightMaskPositioning?: "floating" | "fixed";
    includeLeftMask?: boolean;
    includeRightMask?: boolean;
    includeSpaceBetween?: boolean;
    fillSpaceBetweenUsing?: "horizontalOverlap" | "verticalOverlap" | "linear";
    fillAccordingToBoundariesOf?: "leftMask" | "rightMask" | "both";
    outputVarName?: string;
    [k: string]: unknown;
}
export interface MouseMoveActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem?: "python" | "adb" | "kvm" | "none";
    dragMouse?: boolean;
    releaseMouseOnCompletion?: boolean;
    sourceDetectTypeData?: DetectTypeData;
    targetDetectTypeData?: DetectTypeData;
    sourcePointList?: Point2D[] | string;
    targetPointList?: Point2D[] | string;
    postActionDelay?: string | number;
    [k: string]: unknown;
}
export interface UserPromptActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem?: "python" | "adb" | "kvm" | "none";
    promptMessage?: string;
    promptType?: "text" | "yesno" | "okcancel";
    defaultValue?: string;
    outputVarName?: string;
    messagingProvider?: "viber" | "web";
    messagingChannelName?: string;
    inputExpression?: string;
    [k: string]: unknown;
}
export interface CalendarActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    calendarActionType?: "create" | "update" | "delete" | "list";
    calendarId?: string;
    eventTitle?: string;
    eventDescription?: string;
    eventStart?: string;
    eventEnd?: string;
    searchListStart?: string;
    searchListEnd?: string;
    outputVarName?: string;
    [k: string]: unknown;
}
export interface UserSecretManagementActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    inputExpression?: string;
    outputVarName?: string;
    secretName?: string;
    userSecretActionType?: "getSecret" | "updateSecret";
    [k: string]: unknown;
}
export interface InteractApplicationActionData {
    /**
     * Target execution system for a Script/ScriptAction.
     */
    targetSystem: "python" | "adb" | "kvm" | "none";
    actionType?: "start" | "stop" | "list";
    actionPayload?: string;
    applicationName?: string;
    [k: string]: unknown;
}
