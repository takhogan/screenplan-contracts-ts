// AUTO-GENERATED from script-action-result.schema.json — do not edit by hand. Run `npm run codegen`.

/**
 * What one action did, as fields: written by ScriptEngine for every action at info and debug level as {counter}-{actionName}-{actionGroup}-result.json, next to its action-log.json, and listed among the action log's supporting_files. The action log is the same for every action; this carries what is specific to each (detect matches, click points, colour scores, OCR text). Source of truth: ScriptEngine/common/logging/action_result.py. Coordinates are pixels of the action's input screenshot unless a field says it is in device coordinates. Every action writes the envelope; an action with nothing of its own has empty fields.
 */
export type ScriptActionResult =
  | DetectObjectResult
  | MouseInteractionResult
  | MouseMoveResult
  | ColorCompareResult
  | ImageToTextResult
  | OtherActionResult;
export type Format = "screenplan.action-result";
export type Version = 1;
/**
 * The action's actionGroup in its script.
 */
export type ActionGroup = number;
/**
 * The action's counter in the run, as in its log file names.
 */
export type ScriptCounter = number;
/**
 * RGB, 0-255. A measured mean colour can be fractional.
 *
 * @minItems 3
 * @maxItems 3
 */
export type Color = [number, number, number];

/**
 * What one action did, as fields: written by ScriptEngine for every action at info and debug level as {counter}-{actionName}-{actionGroup}-result.json, next to its action-log.json, and listed among the action log's supporting_files. The action log is the same for every action; this carries what is specific to each (detect matches, click points, colour scores, OCR text). Source of truth: ScriptEngine/common/logging/action_result.py. Coordinates are pixels of the action's input screenshot unless a field says it is in device coordinates. Every action writes the envelope; an action with nothing of its own has empty fields.
 */
export interface DetectObjectResult {
  format: Format;
  version: Version;
  action: "detectObject";
  action_group: ActionGroup;
  script_counter: ScriptCounter;
  fields: DetectObjectFields;
}
/**
 * screenshot is the size of the image searched (the input).
 */
export interface DetectObjectFields {
  detect_type?: "floatingObject" | "fixedObject";
  /**
   * floatingObject: bestMatch, or firstMatch (try the fixed scene first).
   */
  match_mode?: string | null;
  threshold?: number;
  /**
   * skipDetection was set: the match is the template's own location, not a search.
   */
  skipped_detection?: boolean;
  input?: InputArea;
  screenshot?: Size;
  /**
   * The fixed-location comparison (fixedObject, or the first try of firstMatch).
   */
  scene?: {
    score?: number;
    passed?: boolean;
    /**
     * The input was resized to the scene's size first.
     */
    rescaled?: boolean;
    location?: Point;
  };
  /**
   * The template search (floatingObject).
   */
  template?: {
    use_color?: boolean;
    use_mask?: boolean;
    /**
     * The search ran on the input resized to the screen the template came from.
     */
    resized?: boolean;
    /**
     * Positions at or above the threshold, before nearby ones were merged.
     */
    initial_match_count?: number;
    /**
     * Matches after merging.
     */
    match_count?: number;
  };
  matched?: boolean;
  /**
   * Every match at or above the threshold, best first.
   */
  matches?: Match[];
  /**
   * The best-scoring position, even when it is below the threshold. Null when nothing could be scored.
   */
  best?: {
    x: number;
    y: number;
    score: number;
  } | null;
  max_matches?: number;
  /**
   * Matches dropped because there were more than max_matches.
   */
  excess_matches?: number;
  output_var?: string | null;
}
/**
 * Where an image action took its input from.
 */
export interface InputArea {
  /**
   * screenshot: no input expression, so a screenshot was taken (or reused). expression: an earlier action's output. missing: the named input is not in the state. blank: it is in the state but empty. unparsed: it is not an image result.
   */
  source: "screenshot" | "expression" | "missing" | "blank" | "unparsed";
  expression?: string | null;
  /**
   * For source expression: where the input sits in its screenshot.
   */
  area?: Box | null;
}
export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface Size {
  width: number;
  height: number;
}
export interface Point {
  x: number;
  y: number;
}
export interface Match {
  x: number;
  y: number;
  width: number;
  height: number;
  score: number;
}
export interface MouseInteractionResult {
  format: Format;
  version: Version;
  action: "mouseInteractionAction";
  action_group: ActionGroup;
  script_counter: ScriptCounter;
  fields: MouseInteractionFields;
}
export interface MouseInteractionFields {
  /**
   * click, mouseDown, mouseUp or scroll.
   */
  mouse_action?: string;
  button?: string | null;
  click_count?: number | null;
  target?: ClickTarget;
}
/**
 * How a mouse action chose its point.
 */
export interface ClickTarget {
  source: "expression" | "point_list" | "none";
  /**
   * For source expression: the input expression.
   */
  expression?: string | null;
  /**
   * For source expression: shape or rectangle.
   */
  input_type?: string | null;
  /**
   * How the point was picked from the candidates (interior-weighted, uniform, ...).
   */
  selection?: string | null;
  /**
   * For source point_list: how many points it chose from.
   */
  candidate_count?: number | null;
  /**
   * Device coordinates: where the action clicked or moved.
   */
  point: Point | null;
  /**
   * The point before remapping to the device screen: in the input's screenshot (expression) or the screen the script was written on (point_list).
   */
  source_point?: Point | null;
  source_screen?: Size | null;
  device_screen?: Size | null;
  /**
   * Whether the point was scaled from source_screen to device_screen.
   */
  remapped?: boolean;
  /**
   * Where the point is drawn on the action's logged screenshot (its pre_file).
   */
  screenshot_point?: Point | null;
}
export interface MouseMoveResult {
  format: Format;
  version: Version;
  action: "mouseMoveAction";
  action_group: ActionGroup;
  script_counter: ScriptCounter;
  fields: MouseMoveFields;
}
export interface MouseMoveFields {
  /**
   * Moved with the mouse down (a drag), rather than just moving.
   */
  drag?: boolean;
  /**
   * The mouse was down when the move started.
   */
  mouse_down?: boolean;
  /**
   * Whether the mouse was released at the end of a drag.
   */
  released?: boolean | null;
  source?: ClickTarget;
  target?: ClickTarget;
  /**
   * The path the device moved along, on the logged screenshot. Empty for a move with the mouse up.
   */
  path?: Point[];
}
export interface ColorCompareResult {
  format: Format;
  version: Version;
  action: "colorCompareAction";
  action_group: ActionGroup;
  script_counter: ScriptCounter;
  fields: ColorCompareFields;
}
/**
 * area is the area measured, in its screenshot.
 */
export interface ColorCompareFields {
  compare_mode?: "mean" | "mode";
  reference_color?: Color;
  measured_color?: Color;
  /**
   * 1 - DeltaE/100 between the two colours in LAB.
   */
  score?: number;
  threshold?: number;
  passed?: boolean;
  input?: InputArea;
  area?: Box;
}
export interface ImageToTextResult {
  format: Format;
  version: Version;
  action: "imageToTextAction";
  action_group: ActionGroup;
  script_counter: ScriptCounter;
  fields: ImageToTextFields;
}
export interface ImageToTextFields {
  engine?: "tesseractOCR" | "easyOCR";
  input?: InputArea;
  /**
   * The steps applied to the input before OCR, in order.
   */
  preprocessing?: string[];
  /**
   * Each OCR pass: its settings and what it read.
   */
  runs?: {
    settings: string;
    output: string;
  }[];
  /**
   * The text the action returned.
   */
  text?: string;
}
/**
 * Actions that do not record fields of their own yet.
 */
export interface OtherActionResult {
  format: Format;
  version: Version;
  action:
    | "calendarAction"
    | "codeBlock"
    | "conditionalStatement"
    | "contextSwitchAction"
    | "countToThresholdAction"
    | "databaseCRUD"
    | "exceptionAction"
    | "fileIOAction"
    | "forLoopAction"
    | "imageTransformationAction"
    | "interactApplicationAction"
    | "jsonFileAction"
    | "keyboardAction"
    | "logAction"
    | "matchMergeAction"
    | "randomVariable"
    | "returnStatement"
    | "scriptReference"
    | "searchPatternContinueAction"
    | "searchPatternEndAction"
    | "searchPatternStartAction"
    | "sendMessageAction"
    | "shellScript"
    | "sleepStatement"
    | "timeAction"
    | "userSecretManagementAction"
    | "variableAssignment";
  action_group: ActionGroup;
  script_counter: ScriptCounter;
  fields: EmptyFields;
}
export interface EmptyFields {}
