#!/usr/bin/env node
/**
 * Regenerate TypeScript types from the JSON schemas in
 * @screenplan/contracts-schemas. For each schema file we emit:
 *   1. The root type (named after the schema's title).
 *   2. One named type per entry in `$defs`, so consumers can import
 *      individual subtypes (e.g. ClickActionData) directly.
 *
 * Output: src/_generated/<schema-base>.ts plus a single index.ts barrel.
 */
import { compile } from "json-schema-to-typescript";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pkg = require.resolve("@screenplan/contracts-schemas/package.json");
const SCHEMAS_DIR = resolve(dirname(pkg), "screenplan_contracts_schemas", "schemas");
const OUT_DIR = resolve(
  dirname(new URL(import.meta.url).pathname),
  "..", "src", "_generated",
);

if (existsSync(OUT_DIR)) rmSync(OUT_DIR, { recursive: true });
mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(SCHEMAS_DIR).filter(f => f.endsWith(".schema.json"));

// Cache parsed schemas so $ref resolution works across files.
const schemas = new Map();
for (const file of files) {
  schemas.set(file, JSON.parse(readFileSync(join(SCHEMAS_DIR, file), "utf8")));
}

// Build a synthetic resolver that json-schema-to-typescript can use.
const resolver = {
  order: 1,
  canRead: /\.json$/,
  read({ url }) {
    const file = url.split("/").pop();
    if (schemas.has(file)) return JSON.stringify(schemas.get(file));
    throw new Error(`unknown schema ref: ${url}`);
  },
};

const compileOpts = {
  cwd: SCHEMAS_DIR,
  bannerComment: "",
  additionalProperties: false,
  declareExternallyReferenced: true,
  enableConstEnums: false,
  style: { singleQuote: false, semi: true },
  $refOptions: { resolve: { file: resolver, http: false } },
};

const emittedExports = [];

for (const file of files) {
  const base = file.replace(/\.schema\.json$/, "");
  const schema = schemas.get(file);
  const rootName = schema.title || base;

  // Build a meta-schema that union-references every $def so all of them get
  // emitted as named top-level types, then ALSO include the original root
  // schema so its own type appears too.
  const defs = schema.$defs || {};
  const defNames = Object.keys(defs);
  // Use `definitions` (not `$defs`) — json-schema-to-typescript promotes
  // entries under `definitions` to named top-level types automatically.
  const meta = {
    $id: schema.$id,
    definitions: defs,
    $defs: defs,
    title: rootName,
    description: schema.description,
    type: "object",
    properties: {
      __root__: { ...schema, $defs: undefined },
      ...Object.fromEntries(defNames.map(n => [n, { $ref: `#/definitions/${n}` }])),
    },
  };

  let ts;
  try {
    ts = await compile(meta, rootName, compileOpts);
  } catch (err) {
    console.error(`[codegen] failed to compile ${file}: ${err.message}`);
    throw err;
  }

  // Drop the synthetic wrapper interface (named `<rootName>`) — its only
  // purpose was to force every $def to be emitted as a top-level type.
  // The original root schema is renamed to `<rootName>1` by the lib because
  // of the name clash; restore it to `<rootName>`.
  const wrapperRe = new RegExp(
    `export interface ${rootName} \\{[\\s\\S]*?\\n\\}\\n`,
    "m",
  );
  ts = ts.replace(wrapperRe, "");
  ts = ts.replace(new RegExp(`\\b${rootName}1\\b`, "g"), rootName);

  const chunks = [
    `// AUTO-GENERATED from ${file} — do not edit by hand. Run \`npm run codegen\`.`,
    "",
    ts,
  ];

  writeFileSync(join(OUT_DIR, `${base}.ts`), chunks.join("\n"));
  emittedExports.push(base);
}

// Barrel — but `export *` on duplicate names will fail TS compile.
// Use namespace re-exports per file to avoid collisions.
const indexLines = emittedExports.map(b => {
  const ns = b.replace(/[^a-zA-Z0-9]/g, "_");
  return `export * as ${ns} from "./${b}";`;
});
writeFileSync(join(OUT_DIR, "index.ts"), indexLines.join("\n") + "\n");

console.log(`[codegen] wrote ${emittedExports.length} modules to ${OUT_DIR}`);
