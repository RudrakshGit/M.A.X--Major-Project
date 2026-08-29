// Run a noisy command; write full output to an ignored log, show a short tail.
// Usage: npm run bounded -- <label> <command> [args...]
import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { spawn } from "node:child_process";

const argv = process.argv.slice(2);
if (argv[0] === "--") argv.shift();
const [label, executable, ...args] = argv;
if (!/^[a-z0-9][a-z0-9-]{1,48}$/.test(label ?? "") || !executable) {
  console.error("Usage: npm run bounded -- <label> <command> [args...]");
  process.exit(2);
}

const root = resolve(import.meta.dirname, "..");
const date = new Date().toISOString().slice(0, 10);
const dir = resolve(root, "logs", date);
await mkdir(dir, { recursive: true });
const logPath = resolve(dir, `${label}-${Date.now()}.log`);
const log = createWriteStream(logPath);

const tail = [];
let pending = "";
const child = spawn(executable, args, { cwd: root, env: process.env });
for (const stream of [child.stdout, child.stderr]) {
  stream.on("data", (chunk) => {
    const text = chunk.toString();
    log.write(text);
    pending += text;
    const lines = pending.split(/\r?\n/);
    pending = lines.pop() ?? "";
    for (const line of lines) {
      tail.push(line.slice(0, 500));
      if (tail.length > 40) tail.shift();
    }
  });
}

const exitCode = await new Promise((done, fail) => {
  child.on("error", fail);
  child.on("close", (code) => done(code ?? 1));
});
await new Promise((done) => log.end(done));

console.log(JSON.stringify({
  label,
  exitCode,
  status: exitCode === 0 ? "success" : "error",
  log: relative(root, logPath),
}));
if (exitCode !== 0) console.error(tail.map(redact).join("\n"));
process.exitCode = exitCode;

function redact(line) {
  return line
    .replace(/Bearer\s+[A-Za-z0-9._~-]+/gi, "Bearer [REDACTED]")
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[EMAIL]")
    .replace(/(token|password|secret|api[-_]?key)(\s*[=:]\s*)\S+/gi, "$1$2[REDACTED]");
}
