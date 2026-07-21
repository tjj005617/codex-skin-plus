const fs = require("fs");
const path = "E:/codex/Codex-Dream-Skin/app/server.js";
let server = fs.readFileSync(path, "utf8");

// Add SVG to mime types
server = server.replace(
  '".webp": "image/webp", ".gif": "image/gif"',
  '".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml"'
);

fs.writeFileSync(path, server, "utf8");
console.log("Added SVG support");
