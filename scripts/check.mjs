// Proportional validation. Repo hygiene always; app checks once src/ exists.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const failures = [];
const fail = (message) => failures.push(message);

// 1. Project state parses.
try {
  const state = JSON.parse(readFileSync(resolve(root, "project/state.json"), "utf8"));
  const active = state.phases.filter((phase) => phase.status === "active");
  if (active.length > 1) fail(`More than one active phase: ${active.map((p) => p.id).join(", ")}`);
} catch (error) {
  fail(`project/state.json is not valid JSON: ${error.message}`);
}

// 2. Root guidance stays small enough for a small model.
const agentLines = readFileSync(resolve(root, "AGENTS.md"), "utf8").trim().split("\n").length;
if (agentLines > 60) fail(`AGENTS.md is ${agentLines} lines; budget is 60`);

// 3. Every docs/index.md link resolves.
const index = readFileSync(resolve(root, "docs/index.md"), "utf8");
for (const [, target] of index.matchAll(/\]\((?!https?:)([^)#]+)/g)) {
  if (!existsSync(resolve(root, "docs", target))) fail(`docs/index.md links to missing ${target}`);
}

// 4. .env.example carries names, never values.
const envExample = resolve(root, ".env.example");
if (existsSync(envExample)) {
  for (const line of readFileSync(envExample, "utf8").split("\n")) {
    const [, value] = line.split("=");
    if (line.trim() && !line.startsWith("#") && value && value.trim()) {
      fail(`.env.example has a value: ${line.split("=")[0]}`);
    }
  }
}

// 5. No secret-shaped strings in tracked source.
const secretPattern = /(sk-[A-Za-z0-9]{16,}|gsk_[A-Za-z0-9]{16,}|AIza[A-Za-z0-9_-]{20,})/;
const skip = new Set(["node_modules", ".git", ".next", "logs", "evidence", "artifacts"]);
const walk = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (/\.(ts|tsx|js|mjs|json|md)$/.test(entry.name) && statSync(path).size < 512_000) {
      if (secretPattern.test(readFileSync(path, "utf8"))) fail(`Possible secret in ${path.replace(root + "/", "")}`);
    }
  }
};
walk(root);

// 6. App checks, once the app exists.
if (existsSync(resolve(root, "src"))) {
  for (const script of ["lint", "typecheck", "test"]) {
    const result = spawnSync("npm", ["run", "--silent", script], { cwd: root, stdio: "inherit" });
    if (result.status !== 0) fail(`npm run ${script} exited ${result.status}`);
  }
}


// 7. First-load JS budget. Only meaningful after a build; see docs/performance.md.
const manifestPath = resolve(root, ".next/build-manifest.json");
if (existsSync(manifestPath)) {
  const { gzipSync } = await import("node:zlib");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const gzipped = (files) => {
    let bytes = 0;
    for (const file of new Set(files ?? [])) {
      const asset = resolve(root, ".next", file);
      if (existsSync(asset)) bytes += gzipSync(readFileSync(asset)).length;
    }
    return Math.round(bytes / 1024);
  };

  // Polyfills are served only to legacy browsers through the nomodule path, so a
  // current Android Chrome — the device docs/performance.md targets — never
  // downloads them. Reported for visibility, deliberately outside the budget.
  const main = gzipped(manifest.rootMainFiles);
  const polyfills = gzipped(manifest.polyfillFiles);
  const budgetKb = 150;
  console.log(`first-load JS: ${main} KB gzipped (budget ${budgetKb} KB), plus ${polyfills} KB legacy polyfills`);
  if (main > budgetKb) fail(`First-load JS is ${main} KB gzipped; budget is ${budgetKb} KB`);
} else {
  console.log("first-load JS: skipped (no build present — run npm run build first)");
}

if (failures.length) {
  console.error(`\ncheck failed (${failures.length}):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log("check passed");
