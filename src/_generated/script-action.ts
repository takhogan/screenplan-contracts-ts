// AUTO-GENERATED from script-action.schema.json — do not edit by hand. Run `npm run codegen`.

/**
 * A single ScriptAction node as authored in script-studio and consumed by ScriptEngine. The shape of `actionData` is discriminated on `actionName`; per-subtype payloads are defined in script-action-data.schema.json.
 */
export type ScriptAction = {
  [k: string]: unknown;
} & {
  /**
   * Discriminator for the ScriptAction subtype.
   */
  actionName:
    | "jointAction"
    | "clickAction"
    | "mouseScrollAction"
    | "declareScene"
    | "conditionalStatement"
    | "shellScript"
    | "logAction"
    | "sleepStatement"
    | "variableAssignment"
    | "timeAction"
    | "randomVariable"
    | "scriptReference"
    | "dragLocationSource"
    | "dragLocationTarget"
    | "detectObject"
    | "keyboardAction"
    | "searchPatternStartAction"
    | "searchPatternContinueAction"
    | "searchPatternEndAction"
    | "randomizerAction"
    | "jsonFileAction"
    | "exceptionAction"
    | "navigateAction"
    | "ImageToTextAction"
    | "imageToTextAction"
    | "scale"
    | "sendMessageAction"
    | "codeBlock"
    | "forLoopAction"
    | "configurationAction"
    | "ADBConfigurationAction"
    | "colorCompareAction"
    | "returnStatement"
    | "imageTransformationAction"
    | "countToThresholdAction"
    | "fileIOAction"
    | "maskMergeAction"
    | "mouseMoveAction"
    | "mouseInteractionAction"
    | "userPromptAction"
    | "calendarAction"
    | "userSecretManagementAction"
    | "interactApplicationAction";
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
  selected?: boolean;
  draggable?: boolean;
  highlight?: string;
  helpTipExpanded?: boolean;
  [k: string]: unknown;
};

/**
 * A single ScriptAction node as authored in script-studio and consumed by ScriptEngine. The shape of `actionData` is discriminated on `actionName`; per-subtype payloads are defined in script-action-data.schema.json.
 */
