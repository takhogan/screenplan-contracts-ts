"use strict";
// Host notes (host-notes.schema.json): the limits and the checks that both the
// backend, which stores the notes, and the controller's MCP tools, which read
// and write them, apply. The limits are read from the schema's x-limits, so
// there is one place to change them.
//
// A write over a limit is refused with a problem that names the line and its
// length, never truncated: the line dropped could be the hazard. Reading is
// the other way round: capHostNotesSummary cuts what was stored before the
// limits (or written another way) to fit, and says so.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOST_NOTES_LIMITS = void 0;
exports.charLength = charLength;
exports.utf8Bytes = utf8Bytes;
exports.normalizeHostNotesSummary = normalizeHostNotesSummary;
exports.checkHostNotesSummary = checkHostNotesSummary;
exports.capHostNotesSummary = capHostNotesSummary;
exports.hostNotesBytes = hostNotesBytes;
exports.checkHostNotesDocument = checkHostNotesDocument;
exports.checkHostNotesMessage = checkHostNotesMessage;
exports.findCredentialLike = findCredentialLike;
exports.checkNoCredentials = checkNoCredentials;
exports.isHostNotesSerial = isHostNotesSerial;
exports.isHostNotesDeviceId = isHostNotesDeviceId;
exports.hostNotesDocId = hostNotesDocId;
exports.parseHostNotesDocId = parseHostNotesDocId;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function loadLimits() {
    const dir = path.resolve(path.dirname(require.resolve("@screenplan/contracts-schemas/package.json")), "screenplan_contracts_schemas", "schemas");
    let schema;
    try {
        schema = JSON.parse(fs.readFileSync(path.join(dir, "host-notes.schema.json"), "utf8"));
    }
    catch (error) {
        throw new Error("@screenplan/contracts: the installed @screenplan/contracts-schemas has no host-notes.schema.json; update it");
    }
    const limits = schema["x-limits"];
    const keys = LIMIT_KEYS;
    for (const key of keys) {
        if (!Number.isInteger(limits?.[key]) || limits[key] <= 0) {
            throw new Error(`@screenplan/contracts: host-notes.schema.json x-limits.${key} must be a positive integer`);
        }
    }
    return Object.freeze(Object.fromEntries(keys.map((key) => [key, limits[key]])));
}
let loaded = null;
const LIMIT_KEYS = ["summaryMaxLines", "summaryMaxLineChars", "documentMaxBytes", "messageMaxChars", "historyKept"];
/**
 * The limits on host notes, from host-notes.schema.json's x-limits. Read on
 * first use, not at import: an installed @screenplan/contracts-schemas older
 * than host notes then fails only what uses them, never every importer of
 * this package (the controller imports it at startup).
 */
exports.HOST_NOTES_LIMITS = Object.freeze(Object.defineProperties({}, Object.fromEntries(LIMIT_KEYS.map((key) => [key, { enumerable: true, get: () => (loaded ?? (loaded = loadLimits()))[key] }]))));
/** Characters as a person counts them: code points, so an emoji is one. */
function charLength(text) {
    let count = 0;
    for (const _ of text)
        count += 1;
    return count;
}
function utf8Bytes(text) {
    return Buffer.byteLength(text, "utf8");
}
/**
 * The summary as it is stored: line endings made \n, spaces at line ends and
 * blank lines at either end removed. Nothing a reader would miss is dropped.
 */
function normalizeHostNotesSummary(summary) {
    return summary
        .replace(/\r\n?/g, "\n")
        .split("\n")
        .map((line) => line.replace(/\s+$/, ""))
        .join("\n")
        .replace(/^\n+|\n+$/g, "");
}
const MARKDOWN = [
    { pattern: /^\s*#{1,6}(\s|$)/, what: "a heading (#)" },
    { pattern: /^\s*([-*+]|\d+[.)])\s/, what: "a list item" },
    { pattern: /^\s*>/, what: "a quote (>)" },
    { pattern: /\*\*|__/, what: "bold (** or __)" },
    { pattern: /`/, what: "code (`)" },
    { pattern: /\]\(/, what: "a link ([text](url))" },
    { pattern: /^\s*\|.*\|\s*$/, what: "a table row" },
];
/**
 * What is wrong with a summary, after normalizeHostNotesSummary; empty when it
 * is within the limits. Every line over the limit is named, with its length.
 */
function checkHostNotesSummary(summary, limits = exports.HOST_NOTES_LIMITS) {
    if (typeof summary !== "string") {
        return [{ code: "not-a-string", message: "summary must be a string" }];
    }
    const normalized = normalizeHostNotesSummary(summary);
    if (normalized === "")
        return [];
    const lines = normalized.split("\n");
    const problems = [];
    if (lines.length > limits.summaryMaxLines) {
        problems.push({
            code: "summary-too-many-lines",
            message: `summary has ${lines.length} lines; at most ${limits.summaryMaxLines} are allowed. Keep the hazards an agent must know before acting there, and move the rest into the body.`,
            length: lines.length,
            limit: limits.summaryMaxLines,
        });
    }
    lines.forEach((line, index) => {
        const length = charLength(line);
        if (length > limits.summaryMaxLineChars) {
            problems.push({
                code: "summary-line-too-long",
                message: `summary line ${index + 1} is ${length} characters; at most ${limits.summaryMaxLineChars} are allowed.`,
                line: index + 1,
                length,
                limit: limits.summaryMaxLineChars,
            });
        }
        if (line.trim() === "") {
            problems.push({ code: "summary-empty-line", message: `summary line ${index + 1} is empty.`, line: index + 1 });
        }
        const markdown = MARKDOWN.find(({ pattern }) => pattern.test(line));
        if (markdown) {
            problems.push({
                code: "summary-markdown",
                message: `summary line ${index + 1} has Markdown (${markdown.what}); the summary is plain text.`,
                line: index + 1,
            });
        }
    });
    return problems;
}
/**
 * A stored summary cut to the limits, for the read paths (list_hosts, an
 * agent's first contact with a host): the first summaryMaxLines lines, each
 * cut to summaryMaxLineChars characters with a closing "…".
 * `summaryTruncated` says whether anything was cut.
 */
function capHostNotesSummary(summary, limits = exports.HOST_NOTES_LIMITS) {
    if (typeof summary !== "string")
        return { summary: "", summaryTruncated: summary != null };
    const lines = normalizeHostNotesSummary(summary).split("\n");
    let truncated = lines.length > limits.summaryMaxLines;
    const kept = lines.slice(0, limits.summaryMaxLines).map((line) => {
        if (charLength(line) <= limits.summaryMaxLineChars)
            return line;
        truncated = true;
        return Array.from(line).slice(0, limits.summaryMaxLineChars - 1).join("") + "…";
    });
    return { summary: kept.join("\n"), summaryTruncated: truncated };
}
/** The document's size: summary and body together, in UTF-8 bytes. */
function hostNotesBytes(doc) {
    return utf8Bytes(doc.summary) + utf8Bytes(doc.body);
}
/** What is wrong with a whole document (summary and body as they would be stored). */
function checkHostNotesDocument(doc, limits = exports.HOST_NOTES_LIMITS) {
    const problems = checkHostNotesSummary(doc.summary, limits);
    if (typeof doc.body !== "string")
        return [...problems, { code: "not-a-string", message: "body must be a string" }];
    if (typeof doc.summary !== "string")
        return problems;
    const bytes = hostNotesBytes({ summary: normalizeHostNotesSummary(doc.summary), body: doc.body });
    if (bytes > limits.documentMaxBytes) {
        problems.push({
            code: "document-too-large",
            message: `the document would be ${bytes} bytes; at most ${limits.documentMaxBytes} are allowed. Shorten or replace a section rather than appending.`,
            length: bytes,
            limit: limits.documentMaxBytes,
        });
    }
    return problems;
}
function checkHostNotesMessage(message, limits = exports.HOST_NOTES_LIMITS) {
    if (message == null)
        return [];
    if (typeof message !== "string")
        return [{ code: "not-a-string", message: "message must be a string" }];
    const length = charLength(message);
    return length > limits.messageMaxChars
        ? [{ code: "message-too-long", message: `message is ${length} characters; at most ${limits.messageMaxChars} are allowed.`, length, limit: limits.messageMaxChars }]
        : [];
}
// ---- credentials ------------------------------------------------------------
const CREDENTIAL_PATTERNS = [
    { kind: "a private key", pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----/ },
    { kind: "an AWS access key", pattern: /\b(AKIA|ASIA)[0-9A-Z]{16}\b/ },
    { kind: "a GitHub token", pattern: /\b(gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})/ },
    { kind: "a Google API key", pattern: /\bAIza[0-9A-Za-z_-]{35}\b/ },
    { kind: "a Google OAuth token", pattern: /\bya29\.[0-9A-Za-z_-]{20,}/ },
    { kind: "a Slack token", pattern: /\bxox[abprs]-[0-9A-Za-z-]{10,}/ },
    { kind: "an API key", pattern: /\bsk-(ant-)?[A-Za-z0-9_-]{20,}/ },
    { kind: "a JSON web token", pattern: /\beyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/ },
];
// "password: hunter2", "PIN=4821", "api_key = 'abc123…'": a credential word
// given a value that has a digit or a symbol in it. "the password prompt",
// "password: ask the user" and "PIN: {pinVariable}" pass.
const ASSIGNMENT = /\b(password|passwd|pwd|passcode|passphrase|pin|secret|api[_ -]?key|access[_ -]?token|token)\b\s*(?:is\s+|[:=]\s*)["']?([^\s"'`]+)/gi;
const PLACEHOLDER = /^(\{.*\}|<.*>|\*+|\$\{?\w+\}?|%\w+%|n\/a|none|null|unset|getSecret.*)[.,;:)]*$/i;
// A run of 32 or more letters and digits with upper case, lower case and
// digits in it, like a generated key. A commit id (lower-case hex) is not one.
const OPAQUE = /[A-Za-z0-9+=_-]{32,}/g;
function mask(value) {
    return `${value.slice(0, 4)}…`;
}
/**
 * Text that looks like a credential, by line. Host notes are read by every
 * agent on every machine of the account, so a password, key or token never
 * belongs in them: name the secret in the secret store instead.
 */
function findCredentialLike(text) {
    if (typeof text !== "string" || text === "")
        return [];
    const hits = [];
    text.split(/\r?\n/).forEach((lineText, index) => {
        const line = index + 1;
        for (const { kind, pattern } of CREDENTIAL_PATTERNS) {
            const match = pattern.exec(lineText);
            if (match)
                hits.push({ kind, line, starts: mask(match[0]) });
        }
        for (const match of lineText.matchAll(ASSIGNMENT)) {
            const value = match[2];
            if (value.length >= 4 && /[0-9!@#$%^&*+=?~]/.test(value) && !PLACEHOLDER.test(value)) {
                hits.push({ kind: `a ${match[1].toLowerCase()} value`, line, starts: mask(value) });
            }
        }
        for (const match of lineText.matchAll(OPAQUE)) {
            const value = match[0];
            if (/[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value) && !hits.some((hit) => hit.line === line)) {
                hits.push({ kind: "an opaque key or token", line, starts: mask(value) });
            }
        }
    });
    return hits;
}
/** findCredentialLike as problems, for a field named `field`. */
function checkNoCredentials(field, text) {
    return findCredentialLike(text).map((hit) => ({
        code: "looks-like-credential",
        message: `${field} line ${hit.line} looks like ${hit.kind} (starting "${hit.starts}"). Notes are read by every agent on the account: never put a password, key or token in them. Name the secret in the secret store instead.`,
        line: hit.line,
    }));
}
// ---- document ids -----------------------------------------------------------
const HOST_SERIAL = /^[A-Za-z0-9._-]{1,64}$/;
// eslint-disable-next-line no-control-regex
const DEVICE_ID = /^[^/\u0000-\u001f\u007f]{1,128}$/;
function isHostNotesSerial(value) {
    return typeof value === "string" && HOST_SERIAL.test(value);
}
function isHostNotesDeviceId(value) {
    return typeof value === "string" && DEVICE_ID.test(value) && value.trim() === value;
}
/** host/{serial}, or host/{serial}/device/{deviceId}; null when either is not valid. */
function hostNotesDocId(hostSerial, deviceId = null) {
    if (!isHostNotesSerial(hostSerial))
        return null;
    if (deviceId == null)
        return `host/${hostSerial}`;
    return isHostNotesDeviceId(deviceId) ? `host/${hostSerial}/device/${deviceId}` : null;
}
function parseHostNotesDocId(doc) {
    if (typeof doc !== "string")
        return null;
    const match = /^host\/([^/]+)(?:\/device\/(.+))?$/.exec(doc);
    if (!match || !isHostNotesSerial(match[1]))
        return null;
    if (match[2] !== undefined && !isHostNotesDeviceId(match[2]))
        return null;
    return { hostSerial: match[1], deviceId: match[2] ?? null };
}
