import { spawn } from "node:child_process";

let port = "3000";
let hostname = "0.0.0.0";

for (const arg of process.argv.slice(2)) {
  if (arg.startsWith("--port=")) {
    port = arg.split("=")[1];
  } else if (arg === "-p" || arg === "--port") {
    const idx = process.argv.indexOf(arg);
    if (idx !== -1 && process.argv[idx + 1]) {
      port = process.argv[idx + 1];
    }
  }
}

const child = spawn("npx", ["next", "dev", "-p", port, "-H", hostname], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  process.exit(code ?? (signal ? 1 : 0));
});

process.on("SIGINT", () => child.kill("SIGINT"));
process.on("SIGTERM", () => child.kill("SIGTERM"));
