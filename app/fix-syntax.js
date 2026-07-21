const fs = require("fs");
let server = fs.readFileSync("E:/codex/Codex-Dream-Skin/app/server.js", "utf8");

// Fix the duplicate else if issue
const badPattern = `  else if (
  // File upload handler
  else if (parsed.pathname === "/api/upload"`;

const goodPattern = `  // File upload handler
  else if (parsed.pathname === "/api/upload"`;

server = server.replace(badPattern, goodPattern);

fs.writeFileSync("E:/codex/Codex-Dream-Skin/app/server.js", server, "utf8");
console.log("Fixed server.js");
