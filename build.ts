// File taken from https://deno.land/x/brotli@v0.1.4/scripts/build.ts

// Copyright 2020-present the denosaurs team. All rights reserved. MIT license.

import { encode } from "https://deno.land/std@0.102.0/encoding/base64.ts";
import { compress } from "https://deno.land/x/lz4@v0.1.2/mod.ts";
import * as Terser from "https://esm.sh/terser@5.7.1";

const name = "comrak_wasm";

const encoder = new TextEncoder();

async function requires(...executables: string[]) {
  const where = Deno.build.os === "windows" ? "where" : "which";

  for (const executable of executables) {
    const process = Deno.run({
      cmd: [where, executable],
      stderr: "null",
      stdin: "null",
      stdout: "null",
    });

    if (!(await process.status()).success) {
      err(`Could not find required build tool ${executable}`);
    }
  }
}

async function run(msg: string, cmd: string[]) {
  log(msg);

  const process = Deno.run({ cmd });

  if (!(await process.status()).success) {
    err(`${msg} failed`);
  }
}

function log(text: string): void {
  console.log(`[log] ${text}`);
}

function err(text: string): never {
  console.log(`[err] ${text}`);
  return Deno.exit(1);
}

await requires("rustup", "rustc", "cargo", "wasm-pack");

if (!(await Deno.stat("Cargo.toml")).isFile) {
  err(`the build script should be executed in the "${name}" root`);
}

await run(
  "building using wasm-pack",
  ["wasm-pack", "build", "--target", "web", "--release"],
);

await Deno.remove("pkg/.gitignore");
await Deno.remove("pkg/package.json");
await Deno.remove("pkg/README.md");

const wasm = await Deno.readFile(`pkg/${name}_bg.wasm`);
const compressed = compress(wasm);
log(
  `compressed wasm using lz4, size reduction: ${wasm.length -
    compressed.length} bytes`,
);
const encoded = encode(compressed);
log(
  `encoded wasm using base64, size increase: ${encoded.length -
    compressed.length} bytes`,
);

log("inlining wasm in js");
const source = `import * as lz4 from "https://deno.land/x/lz4@v0.1.2/mod.ts";
                export const source = lz4.decompress(Uint8Array.from(atob("${encoded}"), c => c.charCodeAt(0)));`;

log("minifying js");
const output = await Terser.minify(`${source}`, {
  mangle: { module: true },
  output: {
    preamble: "//deno-fmt-ignore-file",
  },
});

const reduction = new Blob([(`${source}`)]).size -
  new Blob([output.code!]).size;
log(`minified js, size reduction: ${reduction} bytes`);

log(`writing output to file ("wasm.js")`);
await Deno.writeFile("wasm.js", encoder.encode(output.code));

const outputFile = await Deno.stat("wasm.js");
log(
  `output file ("wasm.js"), final size is: ${outputFile.size} bytes`,
);