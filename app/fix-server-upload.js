const fs = require("fs");
const path = require("path");

let server = fs.readFileSync("E:/codex/Codex-Dream-Skin/app/server.js", "utf8");

// Add upload handler before the preview handler
const uploadHandler = `
  // File upload handler
  else if (parsed.pathname === "/api/upload" && req.method === "POST") {
    const contentType = req.headers["content-type"] || "";
    const boundary = contentType.split("boundary=")[1];
    
    if (!boundary) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "No boundary" }));
      return;
    }
    
    let body = [];
    req.on("data", chunk => body.push(chunk));
    req.on("end", () => {
      const buffer = Buffer.concat(body);
      const parts = parseMultipart(buffer, boundary);
      
      const name = parts.find(p => p.name === "name")?.data?.toString() || "untitled";
      const type = parts.find(p => p.name === "type")?.data?.toString() || "video";
      const file = parts.find(p => p.name === "file");
      
      if (!file || !file.filename) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "No file uploaded" }));
        return;
      }
      
      // Create theme
      const id = name.toLowerCase().replace(/\\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const themeDir = path.join(THEMES_DIR, id);
      
      if (fs.existsSync(themeDir)) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Theme already exists" }));
        return;
      }
      
      fs.mkdirSync(themeDir, { recursive: true });
      
      // Save file with original extension
      const ext = path.extname(file.filename);
      const targetFile = id + ext;
      fs.writeFileSync(path.join(themeDir, targetFile), file.data);
      
      // Create theme.json
      const theme = {
        id, name,
        palette: { ink: "#E8E0D0", opaqueWindows: false, accent: "#E8B84B", diffRemoved: "#E8A0B0", surface: "#0F1320", uiFont: "Microsoft YaHei UI", codeFont: "Cascadia Code", diffAdded: "#7EC8A0", contrast: 50, skill: "#C0A0E8" },
        art: { focusY: 0.4, safeArea: "center", focusX: 0.5, taskMode: "ambient" },
        image: targetFile,
        appearance: "dark"
      };
      fs.writeFileSync(path.join(themeDir, "theme.json"), JSON.stringify(theme, null, 2), "utf8");
      
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, id }));
    });
  }
  
  // Restore Codex default
  else if (parsed.pathname === "/api/restore-default" && req.method === "POST") {
    const config = loadConfig();
    config.currentTheme = null;
    saveConfig(config);
    
    // Try to remove injected styles via CDP
    try {
      const http = require("http");
      http.get("http://127.0.0.1:" + config.port + "/json/list", (cdpRes) => {
        let data = "";
        cdpRes.on("data", chunk => data += chunk);
        cdpRes.on("end", () => {
          const targets = JSON.parse(data);
          const page = targets.find(t => t.type === "page" && t.url.startsWith("app://"));
          if (page) {
            const ws = new (require("ws"))(page.webSocketDebuggerUrl);
            ws.on("open", () => {
              ws.send(JSON.stringify({
                id: 1,
                method: "Runtime.evaluate",
                params: {
                  expression: \`
                    ["codex-dream-skin-video", "codex-dream-skin-image", "codex-dream-skin-style"].forEach(id => {
                      const el = document.getElementById(id);
                      if (el) { if (el.tagName === "VIDEO") { el.pause(); el.src = ""; } el.remove(); }
                    });
                    document.documentElement.classList.remove("codex-dream-skin", "dream-video-mode", "dream-theme-dark");
                    document.documentElement.style.background = "";
                    document.body.style.background = "";
                    "done"
                  \`,
                  returnByValue: true
                }
              }));
              setTimeout(() => ws.close(), 500);
            });
          }
        });
      });
    } catch (e) {}
    
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
  }
`;

// Simple multipart parser
const multipartParser = `
function parseMultipart(buffer, boundary) {
  const parts = [];
  const boundaryBuf = Buffer.from("--" + boundary);
  let start = 0;
  
  while (true) {
    const idx = buffer.indexOf(boundaryBuf, start);
    if (idx === -1) break;
    
    if (start > 0) {
      const partData = buffer.slice(start, idx);
      const headerEnd = partData.indexOf("\\r\\n\\r\\n");
      if (headerEnd !== -1) {
        const header = partData.slice(0, headerEnd).toString();
        const data = partData.slice(headerEnd + 4, partData.length - 2); // Remove trailing \\r\\n
        
        const nameMatch = header.match(/name="([^"]+)"/);
        const filenameMatch = header.match(/filename="([^"]+)"/);
        
        parts.push({
          name: nameMatch ? nameMatch[1] : null,
          filename: filenameMatch ? filenameMatch[1] : null,
          data: data
        });
      }
    }
    
    start = idx + boundaryBuf.length + 2; // Skip boundary + \\r\\n
  }
  
  return parts;
}
`;

// Add multipart parser at the top of the file
if (!server.includes("parseMultipart")) {
  server = server.replace(
    'const CONFIG_FILE = path.join(BASE_DIR, "config.json");',
    'const CONFIG_FILE = path.join(BASE_DIR, "config.json");\n' + multipartParser
  );
}

// Add upload and restore-default handlers
if (!server.includes("/api/upload")) {
  // Find the preview handler and add before it
  const previewIdx = server.indexOf('parsed.pathname.startsWith("/api/preview/")');
  if (previewIdx > -1) {
    server = server.slice(0, previewIdx) + uploadHandler + "\n  " + server.slice(previewIdx);
  }
}

fs.writeFileSync("E:/codex/Codex-Dream-Skin/app/server.js", server, "utf8");
console.log("Added upload and restore-default handlers");
