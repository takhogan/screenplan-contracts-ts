# @screenplan/contracts

Shared TypeScript types and AJV validators for ScreenPlan (Script, ScriptAction, ScriptActionLog, queue entries), generated from the JSON Schemas in [`screenplan-contracts`](https://github.com/takhogan/screenplan-contracts).

## Install

```bash
npm install @screenplan/contracts
```

## Usage

```ts
import { validateScript, type Script } from "@screenplan/contracts";

const script: Script = /* ... */;
if (!validateScript(script)) {
  console.error(validateScript.errors);
}
```

Exports:
- `types.ts` — TypeScript interfaces generated from the schemas.
- `validators.ts` — AJV-compiled validators (with `ajv-formats`).
- `hostNotes.ts` — host notes' limits and checks, shared by the backend that stores them and the controller's MCP tools: `HOST_NOTES_LIMITS` (from `host-notes.schema.json`'s `x-limits`: a summary of at most 3 lines of 120 characters, a document of at most 16384 bytes), `checkHostNotesSummary` / `checkHostNotesDocument` for writes (refuse, never truncate), `capHostNotesSummary` for reads (cut to fit, `summaryTruncated`), `findCredentialLike`, and the `host/{serial}[/device/{id}]` document ids.

## Scripts

- `npm run build` — compile TypeScript to `dist/`.
- `npm test` — build, validate the example fixtures, and run `test/host-notes.test.mjs` (every host-notes limit).
