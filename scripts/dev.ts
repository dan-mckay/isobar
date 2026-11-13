// Runs the API and the Vite dev server together, and stops both when either exits.
// Kept dependency-free so `npm run dev` needs nothing beyond Node.
import { type ChildProcess, spawn } from "node:child_process";

const processes: ChildProcess[] = [];

function run(script: string): void {
  const child = spawn("npm", ["run", script], {
    stdio: "inherit",
    // On Windows `npm` is `npm.cmd`, which Node will only spawn through a shell.
    shell: process.platform === "win32",
  });
  child.on("exit", (code) => stopAll(code ?? 0));
  processes.push(child);
}

function stopAll(code: number): void {
  for (const child of processes) {
    if (child.exitCode === null) child.kill();
  }
  process.exit(code);
}

process.on("SIGINT", () => stopAll(0));
process.on("SIGTERM", () => stopAll(0));

run("dev:server");
run("dev:web");
