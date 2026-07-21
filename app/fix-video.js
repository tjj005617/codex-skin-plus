const fs = require("fs");
let server = fs.readFileSync("E:/codex/Codex-Dream-Skin/app/server.js", "utf8");

// Find the preview handler and add video streaming
const searchStr = `if (mimeTypes[ext]) {
        // Serve the actual image file
        const data = fs.readFileSync(filePath);
        res.writeHead(200, { "Content-Type": mimeTypes[ext] });
        res.end(data);
      } else {
        // For video files, return a play button placeholder`;

const replaceStr = `if (mimeTypes[ext]) {
        // Serve the actual image file
        const data = fs.readFileSync(filePath);
        res.writeHead(200, { "Content-Type": mimeTypes[ext] });
        res.end(data);
      } else if ([".mp4", ".webm"].includes(ext)) {
        // Stream video file for preview
        const stat = fs.statSync(filePath);
        const range = req.headers.range;
        
        if (range) {
          const parts = range.replace(/bytes=/, "").split("-");
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : Math.min(start + 1024 * 1024, stat.size - 1);
          const chunkSize = end - start + 1;
          
          res.writeHead(206, {
            "Content-Range": "bytes " + start + "-" + end + "/" + stat.size,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize,
            "Content-Type": ext === ".mp4" ? "video/mp4" : "video/webm"
          });
          
          fs.createReadStream(filePath, { start, end }).pipe(res);
        } else {
          res.writeHead(200, {
            "Content-Length": stat.size,
            "Content-Type": ext === ".mp4" ? "video/mp4" : "video/webm"
          });
          fs.createReadStream(filePath).pipe(res);
        }
      } else {
        // For other files, return a placeholder`;

if (server.includes(searchStr)) {
  server = server.replace(searchStr, replaceStr);
  fs.writeFileSync("E:/codex/Codex-Dream-Skin/app/server.js", server, "utf8");
  console.log("Added video streaming support");
} else {
  console.log("Pattern not found, checking...");
  // Try to find a simpler match
  const idx = server.indexOf("mimeTypes[ext]");
  if (idx > -1) {
    console.log("Found mimeTypes at position:", idx);
    console.log("Context:", server.substring(idx, idx + 200));
  }
}
