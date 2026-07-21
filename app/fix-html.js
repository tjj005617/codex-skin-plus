const fs = require("fs");
let html = fs.readFileSync("E:/codex/Codex-Dream-Skin/app/index.html", "utf8");

// Find and replace the theme preview rendering
const oldPattern = `t.hasFile && t.type === "image" ? '<img src="/api/preview/' + t.id + '" onerror="this.style.display=\\'none\\'">' : '<span>' + t.type.toUpperCase() + '</span>'`;

const newPattern = `'<img src="/api/preview/' + t.id + '" onerror="this.src=\\'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22120%22><rect fill=%22%231a1a25%22 width=%22300%22 height=%22120%22/><text fill=%22%23888898%22 font-family=%22sans-serif%22 font-size=%2214%22 x=%22150%22 y=%2265%22 text-anchor=%22middle%22>' + t.type.toUpperCase() + '</text></svg>\\'">'`;

if (html.includes(oldPattern)) {
  html = html.replace(oldPattern, newPattern);
  fs.writeFileSync("E:/codex/Codex-Dream-Skin/app/index.html", html, "utf8");
  console.log("Updated preview code successfully");
} else {
  console.log("Pattern not found, checking current code...");
  const match = html.match(/theme-preview[\s\S]{0,300}/g);
  if (match) {
    match.forEach((m, i) => console.log("Match", i, ":", m.substring(0, 200)));
  }
}
