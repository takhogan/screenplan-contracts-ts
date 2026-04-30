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

## Scripts

- `npm run build` — compile TypeScript to `dist/`.
- `npm test` — build then validate the example fixtures in `test/`.
