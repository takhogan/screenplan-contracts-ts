export interface HostNotesLimits {
    /** Lines in a summary. */
    summaryMaxLines: number;
    /** Characters (code points) in one summary line. */
    summaryMaxLineChars: number;
    /** UTF-8 bytes of summary and body together. */
    documentMaxBytes: number;
    /** Characters in a change's message. */
    messageMaxChars: number;
    /** Changes kept in a document's history. */
    historyKept: number;
}
/**
 * The limits on host notes, from host-notes.schema.json's x-limits. Read on
 * first use, not at import: an installed @screenplan/contracts-schemas older
 * than host notes then fails only what uses them, never every importer of
 * this package (the controller imports it at startup).
 */
export declare const HOST_NOTES_LIMITS: HostNotesLimits;
export type HostNotesProblemCode = "not-a-string" | "summary-too-many-lines" | "summary-line-too-long" | "summary-empty-line" | "summary-markdown" | "document-too-large" | "message-too-long" | "looks-like-credential";
export interface HostNotesProblem {
    code: HostNotesProblemCode;
    message: string;
    /** 1-based line of the summary (or of the text) the problem is on. */
    line?: number;
    /** That line's length in characters, or the document's size in bytes. */
    length?: number;
    /** The limit it went over. */
    limit?: number;
}
/** Characters as a person counts them: code points, so an emoji is one. */
export declare function charLength(text: string): number;
export declare function utf8Bytes(text: string): number;
/**
 * The summary as it is stored: line endings made \n, spaces at line ends and
 * blank lines at either end removed. Nothing a reader would miss is dropped.
 */
export declare function normalizeHostNotesSummary(summary: string): string;
/**
 * What is wrong with a summary, after normalizeHostNotesSummary; empty when it
 * is within the limits. Every line over the limit is named, with its length.
 */
export declare function checkHostNotesSummary(summary: unknown, limits?: HostNotesLimits): HostNotesProblem[];
/**
 * A stored summary cut to the limits, for the read paths (list_hosts, an
 * agent's first contact with a host): the first summaryMaxLines lines, each
 * cut to summaryMaxLineChars characters with a closing "…".
 * `summaryTruncated` says whether anything was cut.
 */
export declare function capHostNotesSummary(summary: unknown, limits?: HostNotesLimits): {
    summary: string;
    summaryTruncated: boolean;
};
/** The document's size: summary and body together, in UTF-8 bytes. */
export declare function hostNotesBytes(doc: {
    summary: string;
    body: string;
}): number;
/** What is wrong with a whole document (summary and body as they would be stored). */
export declare function checkHostNotesDocument(doc: {
    summary: unknown;
    body: unknown;
}, limits?: HostNotesLimits): HostNotesProblem[];
export declare function checkHostNotesMessage(message: unknown, limits?: HostNotesLimits): HostNotesProblem[];
export interface CredentialHit {
    kind: string;
    /** 1-based line of the text. */
    line: number;
    /** Its first characters only; the rest is never repeated back. */
    starts: string;
}
/**
 * Text that looks like a credential, by line. Host notes are read by every
 * agent on every machine of the account, so a password, key or token never
 * belongs in them: name the secret in the secret store instead.
 */
export declare function findCredentialLike(text: unknown): CredentialHit[];
/** findCredentialLike as problems, for a field named `field`. */
export declare function checkNoCredentials(field: string, text: unknown): HostNotesProblem[];
export declare function isHostNotesSerial(value: unknown): value is string;
export declare function isHostNotesDeviceId(value: unknown): value is string;
/** host/{serial}, or host/{serial}/device/{deviceId}; null when either is not valid. */
export declare function hostNotesDocId(hostSerial: string, deviceId?: string | null): string | null;
export declare function parseHostNotesDocId(doc: unknown): {
    hostSerial: string;
    deviceId: string | null;
} | null;
