const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("path");
const fs = require("fs");
const { execSync, spawn } = require("child_process");

const BASE_DIR = path.resolve(__dirname, "..");
const THEMES_DIR = path.join(BASE_DIR, "themes");
const ACTIVE_THEME_DIR = path.join(BASE_DIR, "active-theme");
const ENGINE_DIR = path.join(BASE_DIR, "engine");
const CONFIG_FILE = path.join(BASE_DIR, "config.json");

let mainWindow;

function loadConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
  }
  return {
    codexPath: "E:\\codex\\Codex",
    port: 30123,
    currentTheme: null,
  };
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
        const hasFile = fs.existsSync(path.join(themePath, theme.image));
        themes.push({
          id: theme.id || item,
          name: theme.name || item,
          path: themePath,
          image: theme.image,
          type: isVideo ? "video" : "image",
          hasFile,
          palette: theme.palette,
          appearance: theme.appearance,
        });
      } catch (e) {}
    }
  }
  return themes;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 650,
    minWidth: 800,
    minHeight: 600,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  app.quit();
});

// IPC Handlers
ipcMain.handle("get-themes", () => getThemes());
ipcMain.handle("get-config", () => loadConfig());

ipcMain.handle("save-config", (event, config) => {
  saveConfig(config);
  return { ok: true };
});

ipcMain.handle("apply-theme", async (event, themeId) => {
  const themes = getThemes();
  const theme = themes.find((t) => t.id === themeId);
  if (!theme) return { error: "Theme not found" };

  if (!theme.hasFile) return { error: "File not found: " + theme.image };

  if (!fs.existsSync(ACTIVE_THEME_DIR)) {
    fs.mkdirSync(ACTIVE_THEME_DIR, { recursive: true });
  }

  fs.copyFileSync(
    path.join(theme.path, "theme.json"),
    path.join(ACTIVE_THEME_DIR, "theme.json")
  );
  fs.copyFileSync(
    path.join(theme.path, theme.image),
    path.join(ACTIVE_THEME_DIR, theme.image)
  );

  const config = loadConfig();
  config.currentTheme = themeId;
  saveConfig(config);

  // Inject
  const injector = path.join(ENGINE_DIR, "inject-theme.cjs");
  try {
    const result = execSync(`node "${injector}"`, {
      encoding: "utf8",
      timeout: 30000,
    });
    return { ok: true, result: JSON.parse(result) };
  } catch (e) {
    return { error: e.message };
  }
});

ipcMain.handle("create-theme", async (event, { name, filePath, type }) => {
  const id = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const themeDir = path.join(THEMES_DIR, id);
  if (fs.existsSync(themeDir)) return { error: "Theme already exists" };

  fs.mkdirSync(themeDir, { recursive: true });

  const ext = path.extname(filePath);
  const targetFile = id + ext;
  fs.copyFileSync(filePath, path.join(themeDir, targetFile));

  const theme = {
    id,
    name,
    palette: {
      ink: "#E8E0D0",
      opaqueWindows: false,
      accent: "#E8B84B",
      diffRemoved: "#E8A0B0",
      surface: "#0F1320",
      uiFont: "Microsoft YaHei UI",
      codeFont: "Cascadia Code",
      diffAdded: "#7EC8A0",
      contrast: 50,
      skill: "#C0A0E8",
    },
    art: { focusY: 0.4, safeArea: "center", focusX: 0.5, taskMode: "ambient" },
    image: targetFile,
    appearance: "dark",
  };

  fs.writeFileSync(
    path.join(themeDir, "theme.json"),
    JSON.stringify(theme, null, 2),
    "utf8"
  );

  return { ok: true, id };
});

ipcMain.handle("update-theme-palette", async (event, { themeId, palette }) => {
  const themes = getThemes();
  const theme = themes.find((t) => t.id === themeId);
  if (!theme) return { error: "Theme not found" };

  const themeJsonPath = path.join(theme.path, "theme.json");
  const themeData = JSON.parse(fs.readFileSync(themeJsonPath, "utf8"));
  themeData.palette = { ...themeData.palette, ...palette };
  fs.writeFileSync(themeJsonPath, JSON.stringify(themeData, null, 2), "utf8");

  return { ok: true };
});

ipcMain.handle("restore-original", async () => {
  const config = loadConfig();
  config.currentTheme = null;
  saveConfig(config);
  return { ok: true, message: "Restart Codex to see changes" };
});

ipcMain.handle("select-file", async (event, type) => {
  const filters =
    type === "video"
      ? [{ name: "Video", extensions: ["mp4", "webm"] }]
      : [{ name: "Image", extensions: ["jpg", "jpeg", "png", "webp"] }];

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    filters,
  });

  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle("open-folder", (event, folder) => {
  shell.openPath(folder);
});

ipcMain.handle("minimize-window", () => mainWindow.minimize());
ipcMain.handle("maximize-window", () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});
ipcMain.handle("close-window", () => mainWindow.close());
