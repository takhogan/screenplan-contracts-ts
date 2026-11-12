/**
 * script_versions.json, written into a run folder by Script-Engine-Controller before the engine starts (recordRunStart in src/vcs/hostVcs.mjs; VERSIONING.md §8.2, "Run provenance"): the commit of every script the run could load, and the device it ran on.
 */
/**
 * script_versions.json, written into a run folder by Script-Engine-Controller before the engine starts (recordRunStart in src/vcs/hostVcs.mjs; VERSIONING.md §8.2, "Run provenance"): the commit of every script the run could load, and the device it ran on.
 */
export interface ScriptVersions {
    /**
     * The script the run started.
     */
    root: string;
    /**
     * The folder the run's scripts were read from: a workspace, or a branch's folder .{workspace}.{branch}.
     */
    workspace: string;
    /**
     * For a run in a branch's folder: the branch.
     */
    branch?: string;
    /**
     * For a run in a branch's folder: the workspace it branches.
     */
    branchOf?: string;
    /**
     * Per script name.
     */
    versions: {
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
    };
    /**
     * Scripts whose commit is a drift commit: an edit made on disk, not a deploy.
     */
    drift: string[];
    /**
     * The run has a dynamic reference, so versions lists every tracked script of the workspace.
     */
    dynamic?: true;
    /**
     * The device the run was given (UI_MAPPER.md §8, C1). Null when it ran with none. Absent in runs from before 2026-11.
     */
    device?: RunDevice | null;
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
