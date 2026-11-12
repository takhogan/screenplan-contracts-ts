// AUTO-GENERATED from ui-graph-run.schema.json — do not edit by hand. Run `npm run codegen`.

/**
 * A run table: what ScreenPlanUIMapper extracts from one run folder (UI_MAPPER.md §3.1, §5.1), written to {dataRoot}/ui-graphs/runs/{runFolder}.json. It holds only what does not depend on any graph (§3.6): the event stream, each distinct capture's fingerprint, and template scores. States, beliefs and edges are derived when a graph is built. Version 0 is a draft: fields may still change until slice A of the build order ships.
 */
/**
 * A run table: what ScreenPlanUIMapper extracts from one run folder (UI_MAPPER.md §3.1, §5.1), written to {dataRoot}/ui-graphs/runs/{runFolder}.json. It holds only what does not depend on any graph (§3.6): the event stream, each distinct capture's fingerprint, and template scores. States, beliefs and edges are derived when a graph is built. Version 0 is a draft: fields may still change until slice A of the build order ships.
 */
export interface UIGraphRun {
  format: "screenplan.ui-graph-run";
  version: 0;
  /**
   * The extractor's version. A table written by another version is re-extracted.
   */
  extractor: string;
  run: {
    /**
     * The run folder's name under logs/.
     */
    folder: string;
    /**
     * {hostname}-{certSerialNumber} of the host that ran it.
     */
    host: string;
    workspace: string;
    /**
     * The script the run started.
     */
    root: string;
    versions?: Versions;
    /**
     * The device the run was given (UI_MAPPER.md §8, C1). Null when it ran with none. Absent in runs from before 2026-11.
     */
    device?: RunDevice | null;
    /**
     * Script name -> the app label from its props.json at the run's commit, for scripts that have one.
     */
    apps?: {
      [k: string]: string;
    };
    /**
     * completed.txt's mtime, in seconds: with extractor, what makes this table current.
     */
    completed_mtime: number;
    /**
     * The run's return code, from completed.txt; null for an unfinished run. 0 marks the runs the run comparison takes as its baseline (UI_MAPPER.md §4.1).
     */
    return_code?: number | null;
    /**
     * The highest result-file version in the run. Below 2, captures have no captured_at and times are proxies.
     */
    result_version?: number;
  };
  /**
   * Each distinct capture once, by sha.
   */
  captures: Capture[];
  /**
   * Every action that reads the screen or acts on the device, in counter order.
   */
  events: Event[];
}
/**
 * Per script name.
 */
export interface Versions {
  [k: string]: {
    /**
     * The commit in the workspace's .vcs store. Null for an untracked script: it ran from the folder on disk.
     */
    commit: string | null;
    /**
     * The deploy's id.txt.
     */
    scriptVersionId: string | null;
    /**
     * From V2: the published version number, or {base}+{sha} for a drift commit.
     */
    version?: string;
  };
}
export interface RunDevice {
  /**
   * The device id the run was started with: a key of host_devices_config.json (avd:..., adb:..., pikvm:..., ios:..., sim:...) or file:{path}.
   */
  id: string;
  /**
   * The device record's type (avd, bluestacks, adb, pikvm, ios, sim), else the id's prefix; file for a file device.
   */
  type: string;
  /**
   * A simulated device (UI_MAPPER.md §4). The UI mapper never learns from these runs.
   */
  sim: boolean;
}
export interface Capture {
  /**
   * SHA-1 of the decoded pixels (row-major bytes), not of the file, so the same frame written twice hashes the same.
   */
  sha: string;
  /**
   * The image file, relative to the data root.
   */
  path: string;
  width: number;
  height: number;
  captured_at?: string | null;
  /**
   * action: a screenshot taken for an action to work on, by this action or by an earlier one whose screenshot it reused. logger: taken by a log-image thread to draw on, after the action had acted, so it shows the screen after the input, not the screen the input was aimed at. Null when captured_at is.
   */
  taken_by?: "action" | "logger" | null;
  taken_in?: number | null;
  /**
   * The coarse visual fingerprint (§3.2): per tile, thumb x thumb grey values and, with chroma, its mean colour.
   */
  fingerprint: {
    cols: number;
    rows: number;
    /**
     * Base64 of uint8 values, row-major by tile: each tile's thumb x thumb grey values, then its chroma values (Cr, Cb about 128, scaled by the mapper's chroma gain).
     */
    tiles: string;
    /**
     * Pixels per tile side in tiles. Default 2.
     */
    thumb?: number;
    /**
     * Colour values per tile after the grey ones: 0 (grey only, the default) or thumb (Cr and Cb when thumb is 2).
     */
    chroma?: number;
  };
  /**
   * Template re-evaluation (§3.2 step 2): the best score of each vocabulary entry on this capture.
   */
  scores?: {
    /**
     * A vocabulary entry key: template md5 plus a hash of its detect parameters.
     */
    entry: string;
    /**
     * {script}:{actionGroup} of the first detect that uses the template, keyed as the run's own detects are.
     */
    action?: string;
    score: number;
    /**
     * Whether the detect would have matched: the score met its threshold.
     */
    matched?: boolean;
    box?: Box | null;
  }[];
}
export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface Event {
  counter: number;
  script: string;
  /**
   * actionName.
   */
  action: string;
  /**
   * actionGroup.
   */
  group: number;
  /**
   * Status reported by ScriptEngine for a running or finished action/script. The first four are ScriptExecutionState values. TIMED_OUT, MAX_ATTEMPTS and CANCELLED come from ScriptExecutionStatusDetail: script_executor.py calls script_logger.get_action_log().set_status(status_detail), which writes the detail into this same field, so a terminated run's node reports why it stopped rather than a bare FAILURE. NEEDS_APPROVAL: the run stopped before reading a secret the caller had not approved (--approved-secrets); needs_approval.json in the run folder names the secret and the step. Readers should treat every value except RUNNING and SUCCESS as a failure-like terminal state.
   */
  status: "RUNNING" | "SUCCESS" | "FAILURE" | "ERROR" | "TIMED_OUT" | "MAX_ATTEMPTS" | "CANCELLED" | "NEEDS_APPROVAL";
  /**
   * Seconds since the epoch.
   */
  start: number;
  elapsed: number;
  /**
   * The sha of the capture the action read.
   */
  capture?: string | null;
  /**
   * For an input: when it reached the device, in seconds since the epoch.
   */
  input_at?: number | null;
  /**
   * For a detect: its vocabulary entry.
   */
  entry?: string | null;
  matched?: boolean | null;
  score?: number | null;
  /**
   * For a detect: its best match.
   */
  box?: Box | null;
  /**
   * For an input: what it did, in device coordinates.
   */
  input?: {
    kind?:
      | "click"
      | "mouseDown"
      | "mouseUp"
      | "scroll"
      | "drag"
      | "move"
      | "key"
      | "startApplication"
      | "stopApplication";
    /**
     * Device coordinates.
     */
    point?: Point | null;
    /**
     * The point on the capture, the frame anchor_box is in.
     */
    screenshot_point?: Point | null;
    /**
     * For a drag: its end.
     */
    to?: Point | null;
    /**
     * The vocabulary entry the point was chosen from, when it came from a detect.
     */
    anchor?: string | null;
    /**
     * The box of the matched detect the point was chosen from, on the capture.
     */
    anchor_box?: Box | null;
    keys?: string[] | null;
    application?: string | null;
    scroll_distance?: number | null;
  } | null;
  /**
   * For OCR: what it read, unmasked (§5.4).
   */
  text?: string | null;
}
export interface Point {
  x: number;
  y: number;
}
