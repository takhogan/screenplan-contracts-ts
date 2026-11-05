/**
 * host/{hostSerial} for a host, host/{hostSerial}/device/{deviceId} for one of its devices (a device id as capture_screen lists it, e.g. bluestacks:Pie64). A device's notes belong to the host it is reached from: the same emulator name on two hosts is two emulators.
 */
export type HostNotesDocId = string;
/**
 * Who wrote it, as a Client value: mcp:{hostSerial}/{clientName} for an agent, host:{serial} or editor otherwise.
 */
export type HostNotesAuthor = string;
/**
 * A host's (or one of its devices') notes: what an agent must know about the machine before it acts on it, such as how typing reaches it, which shortcuts it drops and what else runs there. One document per host serial, and optionally one per device of a host. Stored by the backend per account (script-studio-backend-vercel utils/host-notes-store.ts), read and written through the controller's MCP tools list_hosts, read_host_notes and update_host_notes. The summary is kept apart from the body: list_hosts and an agent's first capture_screen, test_actions or run_script on a host carry the summary only. The limits are in x-limits, the one place both the backend and the controller read them from (@screenplan/contracts HOST_NOTES_LIMITS). A write over a limit is refused, never truncated: a dropped line could be the hazard.
 */
/**
 * A host's (or one of its devices') notes: what an agent must know about the machine before it acts on it, such as how typing reaches it, which shortcuts it drops and what else runs there. One document per host serial, and optionally one per device of a host. Stored by the backend per account (script-studio-backend-vercel utils/host-notes-store.ts), read and written through the controller's MCP tools list_hosts, read_host_notes and update_host_notes. The summary is kept apart from the body: list_hosts and an agent's first capture_screen, test_actions or run_script on a host carry the summary only. The limits are in x-limits, the one place both the backend and the controller read them from (@screenplan/contracts HOST_NOTES_LIMITS). A write over a limit is refused, never truncated: a dropped line could be the hazard.
 */
export interface HostNotes {
    doc: HostNotesDocId;
    /**
     * The hazards an agent must know before acting on the machine: at most x-limits.summaryMaxLines lines of at most x-limits.summaryMaxLineChars characters each, plain text with no Markdown, no empty line. Empty when there is none.
     */
    summary: string;
    /**
     * The full notes, Markdown, in sections headed `## {section}`. Summary and body together are at most x-limits.documentMaxBytes bytes of UTF-8.
     */
    body: string;
    /**
     * 1 for the first write, one more for each write after it.
     */
    version: number;
    updatedAt: string;
    updatedBy: HostNotesAuthor;
    /**
     * The latest changes, newest first, at most x-limits.historyKept.
     */
    history?: HostNotesChange[];
}
export interface HostNotesChange {
    version: number;
    at: string;
    by: HostNotesAuthor;
    mode: "append" | "replace";
    /**
     * The section written, or null for the whole body (or the summary alone).
     */
    section?: string | null;
    summaryChanged?: boolean;
    /**
     * Why, in the writer's words.
     */
    message?: string | null;
    /**
     * The document's size after the change.
     */
    bytes?: number;
    /**
     * The summary and body before the change; null on the first write. Kept on the store, left out of read_host_notes' history head.
     */
    previous?: {
        summary: string;
        body: string;
    } | null;
}
/**
 * What list_hosts, capture_screen's devices and an agent's first contact with a host carry: the summary and where the rest is, never the body.
 */
export interface HostNotesPointer {
    doc: HostNotesDocId;
    updatedAt: string;
    summary: string;
    /**
     * True when the stored summary was over the limits (stored before them, or written another way) and this one was cut to fit.
     */
    summaryTruncated?: boolean;
}
