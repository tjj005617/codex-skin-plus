const fs = require("fs");
const path = "E:/codex/Codex-Dream-Skin/app/server.js";
let server = fs.readFileSync(path, "utf8");

// Improve the video preview placeholder with a play button SVG
const oldPlaceholder = `res.end('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="120" viewBox="0 0 300 120"><rect fill="#1a1a25" width="300" height="120"/><text fill="#888898" font-family="sans-serif" font-size="14" x="150" y="65" text-anchor="middle">VIDEO PREVIEW</text></svg>');`;

const newPlaceholder = `res.end('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="120" viewBox="0 0 300 120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1a1a25"/><stop offset="100%" stop-color="#2a2a35"/></linearGradient></defs><rect fill="url(#g)" width="300" height="120"/><circle fill="#e8b84b" opacity="0.3" cx="150" cy="60" r="25"/><polygon fill="#e8b84b" points="142,48 142,72 168,60"/></svg>');`;

server = server.replace(oldPlaceholder, newPlaceholder);
fs.writeFileSync(path, server, "utf8");
console.log("Updated video placeholder");
