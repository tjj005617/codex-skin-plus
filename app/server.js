const http = require("http");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const url = require("url");

const BASE_DIR = path.resolve(__dirname, "..");
const THEMES_DIR = path.join(BASE_DIR, "themes");
const ACTIVE_THEME_DIR = path.join(BASE_DIR, "active-theme");
const ENGINE_DIR = path.join(BASE_DIR, "engine");
const CONFIG_FILE = path.join(BASE_DIR, "config.json");

function loadConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
  }
  return { codexPath: "E:\\codex\\Codex", port: 30123, currentTheme: null };
}

function saveConfig(config) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf8");
}

function getThemes() {
  if (!fs.existsSync(THEMES_DIR)) return [];
  const themes = [];
  const items = fs.readdirSync(THEMES_DIR);
  for (const item of items) {
    const themePath = path.join(THEMES_DIR, item);
    const themeJsonPath = path.join(themePath, "theme.json");
    if (fs.existsSync(themeJsonPath)) {
      try {
        const theme = JSON.parse(fs.readFileSync(themeJsonPath, "utf8"));
        const ext = path.extname(theme.image).toLowerCase();
        const isVideo = [".mp4", ".webm"].includes(ext);
        themes.push({
          id: theme.id || item,
          name: theme.name || item,
          path: themePath,
          image: theme.image,
          type: isVideo ? "video" : "image",
          hasFile: fs.existsSync(path.join(themePath, theme.image)),
          palette: theme.palette,
        });
      } catch (e) {}
    }
  }
  return themes;
}

function applyTheme(themeId) {
  const themes = getThemes();
  const theme = themes.find((t) => t.id === themeId);
  if (!theme) return { error: "Theme not found" };
  if (!theme.hasFile) return { error: "File not found" };

  if (!fs.existsSync(ACTIVE_THEME_DIR)) {
    fs.mkdirSync(ACTIVE_THEME_DIR, { recursive: true });
  }
  fs.copyFileSync(path.join(theme.path, "theme.json"), path.join(ACTIVE_THEME_DIR, "theme.json"));
  fs.copyFileSync(path.join(theme.path, theme.image), path.join(ACTIVE_THEME_DIR, theme.image));

  const config = loadConfig();
  config.currentTheme = themeId;
  saveConfig(config);

  const injector = path.join(ENGINE_DIR, "inject-theme.cjs");
  try {
    execSync(`node "${injector}"`, { encoding: "utf8", timeout: 30000 });
    return { ok: true };
  } catch (e) {
    return { error: e.message };
  }
}

function createTheme(name, filePath, type) {
  const id = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const themeDir = path.join(THEMES_DIR, id);
  if (fs.existsSync(themeDir)) return { error: "Theme already exists" };

  fs.mkdirSync(themeDir, { recursive: true });
  const ext = path.extname(filePath);
  const targetFile = id + ext;
  fs.copyFileSync(filePath, path.join(themeDir, targetFile));

  const theme = {
    id, name,
    palette: { ink: "#E8E0D0", opaqueWindows: false, accent: "#E8B84B", diffRemoved: "#E8A0B0", surface: "#0F1320", uiFont: "Microsoft YaHei UI", codeFont: "Cascadia Code", diffAdded: "#7EC8A0", contrast: 50, skill: "#C0A0E8" },
    art: { focusY: 0.4, safeArea: "center", focusX: 0.5, taskMode: "ambient" },
    image: targetFile,
    appearance: "dark",
  };
  fs.writeFileSync(path.join(themeDir, "theme.json"), JSON.stringify(theme, null, 2), "utf8");
  return { ok: true, id };
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);

  // API routes
  if (parsed.pathname === "/api/themes") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(getThemes()));
  } 
  else if (parsed.pathname === "/api/config") {
    if (req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        saveConfig(JSON.parse(body));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      });
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(loadConfig()));
    }
  } 
  else if (parsed.pathname === "/api/apply" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const { themeId } = JSON.parse(body);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(applyTheme(themeId)));
    });
  } 
  else if (parsed.pathname === "/api/create" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const { name, filePath, type } = JSON.parse(body);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(createTheme(name, filePath, type)));
    });
  } 
  else if (parsed.pathname === "/api/palette" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const { themeId, palette } = JSON.parse(body);
      const themes = getThemes();
      const theme = themes.find((t) => t.id === themeId);
      if (theme) {
        const themeJsonPath = path.join(theme.path, "theme.json");
        const themeData = JSON.parse(fs.readFileSync(themeJsonPath, "utf8"));
        themeData.palette = { ...themeData.palette, ...palette };
        fs.writeFileSync(themeJsonPath, JSON.stringify(themeData, null, 2), "utf8");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Theme not found" }));
      }
    });
  } 
  else if (parsed.pathname === "/api/restore" && req.method === "POST") {
    const config = loadConfig();
    config.currentTheme = null;
    saveConfig(config);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
  } 
  else if (parsed.pathname.startsWith("/api/preview/")) {
    // Preview handler - serves theme preview images
    const themeId = parsed.pathname.split("/")[3];
    const themes = getThemes();
    const theme = themes.find((t) => t.id === themeId);
    
    if (theme && theme.hasFile) {
      const filePath = path.join(theme.path, theme.image);
      const ext = path.extname(filePath).toLowerCase();
      
      const mimeTypes = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".gif": "image/gif",
        ".svg": "image/svg+xml"
      };
      
      if (mimeTypes[ext]) {
        // Serve the actual image file
        const data = fs.readFileSync(filePath);
        res.writeHead(200, { "Content-Type": mimeTypes[ext] });
        res.end(data);
      } else {
        // For video files, return a play button placeholder
        res.writeHead(200, { "Content-Type": "image/svg+xml" });
        res.end(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="120" viewBox="0 0 300 120">
          <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#1a1a25"/>
            <stop offset="100%" stop-color="#2a2a35"/>
          </linearGradient></defs>
          <rect fill="url(#g)" width="300" height="120"/>
          <circle fill="#e8b84b" opacity="0.3" cx="150" cy="60" r="25"/>
          <polygon fill="#e8b84b" points="142,48 142,72 168,60"/>
        </svg>`);
      }
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  } 
  else if (parsed.pathname === "/") {
    // Serve the HTML page
    fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Error");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    });
  } 
  else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

const PORT = 30200;

// Kill existing process on port
function killPort(port) {
  try {
    const result = require("child_process").execSync(
      `netstat -ano | findstr :${port}`,
      { encoding: "utf8" }
    );
    const match = result.match(/LISTENING\s+(\d+)/);
    if (match) {
      require("child_process").execSync(`taskkill /PID ${match[1]} /F`, { stdio: "ignore" });
    }
  } catch (e) {}
}

killPort(PORT);

server.listen(PORT, () => {
  console.log(`Codex Skin Plus Manager running at http://localhost:${PORT}`);
  const openCmd = process.platform === "win32" ? "start" : "open";
  execSync(`${openCmd} http://localhost:${PORT}`, { stdio: "ignore" });
});
