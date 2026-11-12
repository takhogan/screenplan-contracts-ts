// AUTO-GENERATED from ui-graph.schema.json — do not edit by hand. Run `npm run codegen`.

/**
 * One app's screen graph in one workspace (UI_MAPPER.md §2), built by ScreenPlanUIMapper from run tables and written to {dataRoot}/ui-graphs/{workspace}/{appKey}/graph.json. The simulated device (§4), the controller and the MCP tools read it; only the mapper writes it. Version 0 is a draft: fields may still change until slice A of the build order ships.
 */
/**
 * One app's screen graph in one workspace (UI_MAPPER.md §2), built by ScreenPlanUIMapper from run tables and written to {dataRoot}/ui-graphs/{workspace}/{appKey}/graph.json. The simulated device (§4), the controller and the MCP tools read it; only the mapper writes it. Version 0 is a draft: fields may still change until slice A of the build order ships.
 */
export interface UIGraph {
  format: "screenplan.ui-graph";
  version: 0;
  workspace: string;
  app: {
    /**
     * The graph's folder name: the label, lower-cased, or an inferred id.
     */
    key: string;
    /**
     * The props.json app label, when scripts have one.
     */
    label?: string | null;
    source: "label" | "detected" | "inferred";
    /**
     * The scripts that drive it.
     */
    scripts?: string[];
  };
  /**
   * UTC, ISO 8601 with milliseconds and a Z, e.g. 2026-11-01T17:09:12.345Z.
   */
  built_at: string;
  /**
   * The mapper's version.
   */
  builder?: string;
  /**
   * {host}/{runFolder} of each run table the graph was built from.
   */
  runs: string[];
  /**
   * Vocabulary entries (§3.2): a template and its detect parameters, with entries linked across recuts.
   */
  anchors: {
    id: string;
    /**
     * The template asset's md5.
     */
    md5: string;
    /**
     * threshold, mask md5, use_color, resized, detector.
     */
    params?: {};
    /**
     * {script}:{actionGroup} of every action that uses it.
     */
    uses?: string[];
    /**
     * Entries merged into this one (recuts, other scripts' cuts of the same element).
     */
    same_as?: string[];
  }[];
  states: {
    id: string;
    /**
     * A name given through label_ui_state.
     */
    label?: string | null;
    /**
     * Captures assigned to it.
     */
    members: number;
    /**
     * Files under exemplars/, full resolution.
     */
    exemplars: string[];
    /**
     * Anchor id -> match rate on the state's captures.
     */
    signature?: {
      [k: string]: number;
    };
    /**
     * Base64 fingerprint tiles of the state's median, as in UIGraphRun.Capture.fingerprint.tiles.
     */
    median?: string;
    /**
     * Base64 uint8 per tile: 255 x the rate at which members differ from the median (§3.7's observation model).
     */
    tile_rates?: string;
    /**
     * Base64 bitmap per tile: dynamic within the state (§3.3.2).
     */
    dynamic?: string;
    /**
     * For a context screen (§3.3.4): base64 bitmap of its fixed tiles.
     */
    fixed_region?: string | null;
    /**
     * Spontaneous-leave statistics (§10.5).
     */
    dwell?: {};
  }[];
  /**
   * Timed edges (§3.6): per (state, anchor, action), the state seen in each time bin after the input, with counts.
   */
  edges: {
    from: string;
    /**
     * Null: a point-list input, or no input at all (a spontaneous change).
     */
    anchor?: string | null;
    action: string;
    bins: {
      /**
       * The bin's upper edge, in seconds after the input.
       */
      until: number;
      /**
       * State id (or "new") -> count.
       */
      to: {
        [k: string]: number;
      };
    }[];
    /**
     * Recorded paths the sim samples whole: {host}/{runFolder}#{counter}.
     */
    paths?: string[];
  }[];
  /**
   * Diagnostics and priors (§3.5): per (state, anchor, action).
   */
  hit_models?: {
    /**
     * "*" for a model fitted over every state the anchor was clicked on.
     */
    state: string;
    anchor: string;
    action: string;
    region?: Box;
    tau0?: number;
    epsilon?: number;
    n?: number;
    [k: string]: unknown;
  }[];
  /**
   * How a capture is placed on the states (UI_MAPPER.md §3.7): the tile-change threshold, the temperature dividing the observation log-likelihood, and the fingerprint grid [rows, cols, thumb, thumb] the medians are in, or [rows, cols, thumb + 1, thumb] when each tile also holds its colour (a last row of chroma values).
   */
  placement?: {
    floor: number;
    temperature: number;
    /**
     * @minItems 4
     * @maxItems 4
     */
    grid: [number, number, number, number];
  };
}
/**
 * Posterior median, in the anchor frame (u, v in 0..1).
 */
export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}
