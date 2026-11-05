// Host notes: every limit on the write path (checkHostNotesSummary,
// checkHostNotesDocument, checkHostNotesMessage) and the read path
// (capHostNotesSummary), the credential check and the document ids.
// Run with `npm test` (after the build).
import test from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs";
import * as path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const c = require(path.join(ROOT, "dist", "index.js"));
const L = c.HOST_NOTES_LIMITS;

const line = (n, ch = "a") => ch.repeat(n);

test("the limits come from the schema's x-limits", () => {
  const dir = path.dirname(require.resolve("@screenplan/contracts-schemas/package.json"));
  const schema = JSON.parse(fs.readFileSync(path.join(dir, "screenplan_contracts_schemas", "schemas", "host-notes.schema.json"), "utf8"));
  assert.deepEqual({ ...L }, schema["x-limits"]);
  assert.equal(L.summaryMaxLines, 3);
  assert.equal(L.summaryMaxLineChars, 120);
  assert.equal(L.documentMaxBytes, 16384);
  assert.ok(Object.isFrozen(L));
  // The schema's own maxLength fits 3 full lines and their 2 newlines.
  assert.equal(schema.properties.summary.maxLength, L.summaryMaxLines * L.summaryMaxLineChars + L.summaryMaxLines - 1);
});

test("the limits are read on first use, so importing the package never needs host-notes.schema.json", () => {
  const src = fs.readFileSync(path.join(ROOT, "dist", "hostNotes.js"), "utf8");
  assert.doesNotMatch(src, /HOST_NOTES_LIMITS = loadLimits\(\)/);
  assert.equal(JSON.stringify(L), JSON.stringify({ summaryMaxLines: 3, summaryMaxLineChars: 120, documentMaxBytes: 16384, messageMaxChars: 200, historyKept: 20 }));
});

test("write: a summary at the limits passes", () => {
  assert.deepEqual(c.checkHostNotesSummary([line(120), line(120), line(120)].join("\n")), []);
  assert.deepEqual(c.checkHostNotesSummary(""), []);
  assert.deepEqual(c.checkHostNotesSummary("one line\r\n"), []);
});

test("write: a fourth line is refused, with the count", () => {
  const problems = c.checkHostNotesSummary("a\nb\nc\nd");
  assert.equal(problems.length, 1);
  assert.equal(problems[0].code, "summary-too-many-lines");
  assert.equal(problems[0].length, 4);
  assert.equal(problems[0].limit, 3);
  assert.match(problems[0].message, /4 lines; at most 3/);
});

test("write: a line of 121 characters is refused, naming the line and its length", () => {
  const problems = c.checkHostNotesSummary(`ok\n${line(121)}`);
  assert.equal(problems.length, 1);
  assert.equal(problems[0].code, "summary-line-too-long");
  assert.equal(problems[0].line, 2);
  assert.equal(problems[0].length, 121);
  assert.match(problems[0].message, /line 2 is 121 characters; at most 120/);
});

test("write: every long line is named, not just the first", () => {
  const problems = c.checkHostNotesSummary(`${line(130)}\n${line(140)}`);
  assert.deepEqual(problems.map((p) => [p.line, p.length]), [[1, 130], [2, 140]]);
});

test("write: characters are code points, so 120 emoji fit and 121 do not", () => {
  assert.deepEqual(c.checkHostNotesSummary("😀".repeat(120)), []);
  assert.equal(c.checkHostNotesSummary("😀".repeat(121))[0].length, 121);
});

test("write: Markdown and empty lines are refused", () => {
  for (const md of ["# Hazards", "- keyPress doubles", "1. first", "> quote", "use **pydirectinput**", "call `press`", "see [doc](x)", "| a | b |"]) {
    const problems = c.checkHostNotesSummary(md);
    assert.equal(problems[0]?.code, "summary-markdown", md);
  }
  assert.equal(c.checkHostNotesSummary("a\n\nb")[0].code, "summary-empty-line");
  assert.deepEqual(c.checkHostNotesSummary("Windows_VDI_* scripts; keyUp('alt') turns on KeyTips; 2 * 3"), []);
});

test("write: a non-string summary is refused", () => {
  assert.equal(c.checkHostNotesSummary(42)[0].code, "not-a-string");
});

test("write: the document is at most 16384 bytes, summary and body together", () => {
  assert.deepEqual(c.checkHostNotesDocument({ summary: "", body: line(16384) }), []);
  assert.deepEqual(c.checkHostNotesDocument({ summary: "abcd", body: line(16380) }), []);
  const over = c.checkHostNotesDocument({ summary: "abcd", body: line(16381) });
  assert.equal(over.length, 1);
  assert.equal(over[0].code, "document-too-large");
  assert.equal(over[0].length, 16385);
  assert.equal(over[0].limit, 16384);
  // Bytes, not characters: 4097 four-byte emoji are 16388 bytes.
  assert.equal(c.checkHostNotesDocument({ summary: "", body: "😀".repeat(4097) })[0].code, "document-too-large");
});

test("write: a change's message is at most 200 characters", () => {
  assert.deepEqual(c.checkHostNotesMessage(line(200)), []);
  assert.deepEqual(c.checkHostNotesMessage(null), []);
  assert.equal(c.checkHostNotesMessage(line(201))[0].length, 201);
});

test("read: a summary within the limits is returned as it is", () => {
  const summary = [line(120), line(5), line(120)].join("\n");
  assert.deepEqual(c.capHostNotesSummary(summary), { summary, summaryTruncated: false });
});

test("read: a summary over the limits is cut to 3 lines of 120 characters, and says so", () => {
  const capped = c.capHostNotesSummary([line(200, "x"), "two", "three", "four", "five"].join("\n"));
  assert.equal(capped.summaryTruncated, true);
  const lines = capped.summary.split("\n");
  assert.equal(lines.length, 3);
  assert.equal([...lines[0]].length, 120);
  assert.ok(lines[0].endsWith("…"));
  assert.deepEqual(lines.slice(1), ["two", "three"]);
  // Whatever it was, the result is within 3 x 120 characters and passes the length checks.
  assert.ok(c.checkHostNotesSummary(capped.summary).every((p) => p.code === "summary-markdown"));
});

test("read: only a fourth line, or only a long line, is enough to flag it", () => {
  assert.equal(c.capHostNotesSummary("a\nb\nc\nd").summaryTruncated, true);
  assert.equal(c.capHostNotesSummary(line(121)).summaryTruncated, true);
  assert.equal(c.capHostNotesSummary("😀".repeat(121)).summary, "😀".repeat(119) + "…");
  assert.deepEqual(c.capHostNotesSummary(undefined), { summary: "", summaryTruncated: false });
  assert.deepEqual(c.capHostNotesSummary({}), { summary: "", summaryTruncated: true });
});

test("credentials: keys, tokens and password values are found, and never echoed whole", () => {
  // Every value below is fake: a real prefix (AKIA, ghp_, AIza, ya29., sk-ant-)
  // followed by the alphabet or counting digits, a key header with no key, the
  // "hunter2" joke, and base64 of "ChangeMePlease1234567890abcdef". None is,
  // or ever was, a working credential.
  const samples = {
    "-----BEGIN RSA PRIVATE KEY-----": "a private key",
    "key AKIAABCDEFGHIJKLMNOP here": "an AWS access key",
    "ghp_abcdefghijklmnopqrstuvwxyz0123456789": "a GitHub token",
    "AIzaSyA1234567890abcdefghijklmnopqrstuv": "a Google API key",
    "Bearer ya29.a0AfH6SMBabcdefghijklmnop": "a Google OAuth token",
    "sk-ant-api03-abcdefghijklmnopqrstuvwxyz": "an API key",
    "password: hunter2": "a password value",
    "the BitLocker PIN is 482913": "a pin value",
    "api_key = 'Zx9!kq'": "a api_key value",
    "token Q2hhbmdlTWVQbGVhc2UxMjM0NTY3ODkwYWJjZGVm": "an opaque key or token",
  };
  for (const [text, kind] of Object.entries(samples)) {
    const hits = c.findCredentialLike(`first line\n${text}`);
    assert.ok(hits.some((hit) => hit.kind === kind && hit.line === 2), `${text} → ${JSON.stringify(hits)}`);
    for (const hit of hits) assert.ok(hit.starts.length <= 5, hit.starts);
  }
});

test("credentials: notes about secrets without one pass", () => {
  for (const text of [
    "Never type the password yourself: read it with getSecret.",
    "password: ask the user",
    "PIN: {bitlockerPin}",
    "The BitLocker PIN prompt has no video.",
    "commit 3f2a9c1d4e5b6a7c8d9e0f1a2b3c4d5e6f7a8b9c is deployed",
    "C:\\Users\\Administrator\\AppData\\Local\\keepAlive.ps1",
    "token: refreshed every hour",
  ]) {
    assert.deepEqual(c.findCredentialLike(text), [], text);
  }
  assert.equal(c.checkNoCredentials("text", "password: hunter2")[0].code, "looks-like-credential");
  assert.doesNotMatch(c.checkNoCredentials("text", "password: hunter2")[0].message, /hunter2/);
});

test("document ids", () => {
  assert.equal(c.hostNotesDocId("03"), "host/03");
  assert.equal(c.hostNotesDocId("03", "bluestacks:Pie64"), "host/03/device/bluestacks:Pie64");
  assert.equal(c.hostNotesDocId("03", "a/b"), null);
  assert.equal(c.hostNotesDocId("../x"), null);
  assert.deepEqual(c.parseHostNotesDocId("host/03/device/pikvm:10.0.0.158"), { hostSerial: "03", deviceId: "pikvm:10.0.0.158" });
  assert.deepEqual(c.parseHostNotesDocId("host/01"), { hostSerial: "01", deviceId: null });
  assert.equal(c.parseHostNotesDocId("hosts/01"), null);
});

test("the example validates and is within the limits", () => {
  const dir = path.dirname(require.resolve("@screenplan/contracts-schemas/package.json"));
  const example = JSON.parse(fs.readFileSync(path.join(dir, "examples", "host-notes.example.json"), "utf8"));
  c.validateHostNotes.assert(example);
  assert.deepEqual(c.checkHostNotesDocument(example), []);
  assert.equal(c.validateHostNotes.is({ ...example, doc: "host/03/device/a/b" }), false);
});
