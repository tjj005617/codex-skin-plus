#!/usr/bin/env node
/**
 * Codex Skin Plus - Console Manager
 * Switch video/image wallpapers and customize themes
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");

const BASE_DIR = path.resolve(__dirname, "..");
const THEMES_DIR = path.join(BASE_DIR, "themes");
const ACTIVE_THEME_DIR = path.join(BASE_DIR, "active-theme");
const ENGINE_DIR = path.join(BASE_DIR, "engine");
const CONFIG_FILE = path.join(BASE_DIR, "config.json");

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bgBlue: "\x1b[44m",
};

function print(text, color) {
  console.log(`${colors[color || "white"]}${text}${colors.reset}`);
}

function printHeader(text) {
  console.log("");
  console.log(`${colors.bgBlue}${colors.bright} ${text} ${colors.reset}`);
  console.log("");
}

function printSuccess(text) {
  print("[OK] " + text, "green");
}

function printError(text) {
  print("[ERR] " + text, "red");
}

function printWarning(text) {
  print("[WARN] " + text, "yellow");
}

function printInfo(text) {
  print("[INFO] " + text, "cyan");
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(`${colors.yellow}? ${question}: ${colors.reset}`, (answer) => {
      resolve(answer.trim());
    });
  });
}

function waitForKey() {
  return new Promise((resolve) => {
    rl.question(`${colors.dim}\nPress Enter to continue...${colors.reset}`, () => {
      resolve();
    });
  });
}

function loadConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
  }
  return {
    codexPath: "E:\\codex\\Codex",
    port: 30123,
    autoStart: false,
    currentTheme: null,
  };
}

function saveConfig(config) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf8");
}

function getThemes() {
  if (!fs.existsSync(THEMES_DIR)) {
    return [];
  }
  const themes = [];
  const items = fs.readdirSync(THEMES_DIR);
  for (const item of items) {
    const themePath = path.join(THEMES_DIR, item);
    const themeJsonPath = path.join(themePath, "theme.json");
    if (fs.existsSync(themeJsonPath)) {
      try {
        const theme = JSON.parse(fs.readFileSync(themeJsonPath, "utf8"));
        const hasFile = fs.existsSync(path.join(themePath, theme.image));
        const ext = path.extname(theme.image).toLowerCase();
        const isVideo = [".mp4", ".webm"].includes(ext);
        themes.push({
          id: theme.id || item,
          name: theme.name || item,
          path: themePath,
          image: theme.image,
          type: isVideo ? "video" : "image",
          hasFile: hasFile,
          theme: theme,
        });
      } catch (e) {}
    }
  }
  return themes;
}

function showThemes() {
  const themes = getThemes();
  if (themes.length === 0) {
    printWarning("No themes found");
    printInfo("Put theme folders in: " + THEMES_DIR);
    return null;
  }
  printHeader("Available Themes");
  themes.forEach((theme, index) => {
    const typeLabel = theme.type === "video" ? "[VIDEO]" : "[IMAGE]";
    const status = theme.hasFile ? colors.green + "OK" : colors.red + "MISSING";
    console.log(
      `  ${colors.bright}${index + 1}.${colors.reset} ` +
      `${typeLabel} ${theme.name} ` +
      `${colors.dim}(${theme.type})${colors.reset} ` +
      `[${status}${colors.reset}]`
    );
  });
  return themes;
}

async function applyTheme(theme) {
  printHeader("Applying: " + theme.name);
  if (!theme.hasFile) {
    printError("File not found: " + theme.image);
    return false;
  }
  if (!fs.existsSync(ACTIVE_THEME_DIR)) {
    fs.mkdirSync(ACTIVE_THEME_DIR, { recursive: true });
  }
  printInfo("Copying theme files...");
  fs.copyFileSync(path.join(theme.path, "theme.json"), path.join(ACTIVE_THEME_DIR, "theme.json"));
  fs.copyFileSync(path.join(theme.path, theme.image), path.join(ACTIVE_THEME_DIR, theme.image));
  printSuccess("Theme files copied");
  const config = loadConfig();
  config.currentTheme = theme.id;
  saveConfig(config);
  printSuccess("Config updated");
  printInfo("Injecting theme...");
  const injectorScript = path.join(ENGINE_DIR, "inject-theme.cjs");
  if (!fs.existsSync(injectorScript)) {
    printError("Injector not found: " + injectorScript);
    return false;
  }
  try {
    const result = execSync(
      `powershell -Command "Get-Process -Name 'ChatGPT' -ErrorAction SilentlyContinue | Select-Object -First 1"`,
      { encoding: "utf8" }
    );
    if (!result.includes("ChatGPT")) {
      printWarning("Codex is not running");
      printInfo("Please start Codex first, then run this tool");
      return false;
    }
    execSync(`node "${injectorScript}"`, { encoding: "utf8", stdio: "inherit" });
    printSuccess("Theme injected!");
    return true;
  } catch (error) {
    printError("Injection failed: " + error.message);
    return false;
  }
}

async function createTheme() {
  printHeader("Create New Theme");
  const name = await ask("Theme name");
  if (!name) {
    printError("Name cannot be empty");
    return;
  }
  const id = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const themeDir = path.join(THEMES_DIR, id);
  if (fs.existsSync(themeDir)) {
    printError("Theme already exists: " + id);
    return;
  }
  console.log("\nTheme type:");
  console.log(`  ${colors.cyan}1.${colors.reset} Video wallpaper (.mp4/.webm)`);
  console.log(`  ${colors.magenta}2.${colors.reset} Image wallpaper (.jpg/.png/.webp)`);
  const typeChoice = await ask("Select type (1/2)");
  const isVideo = typeChoice === "1";
  const ext = isVideo ? ".mp4" : ".jpg";
  const filePath = await ask((isVideo ? "Video" : "Image") + " file path");
  if (!fs.existsSync(filePath)) {
    printError("File not found");
    return;
  }
  const fileExt = path.extname(filePath).toLowerCase();
  if (isVideo && ![".mp4", ".webm"].includes(fileExt)) {
    printError("Video must be .mp4 or .webm");
    return;
  }
  if (!isVideo && ![".jpg", ".jpeg", ".png", ".webp"].includes(fileExt)) {
    printError("Image must be .jpg, .png or .webp");
    return;
  }
  fs.mkdirSync(themeDir, { recursive: true });
  const targetFile = id + fileExt;
  fs.copyFileSync(filePath, path.join(themeDir, targetFile));
  const theme = {
    id: id,
    name: name,
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
      skill: "#C0A0E8"
    },
    art: {
      focusY: 0.4,
      safeArea: "center",
      focusX: 0.5,
      taskMode: "ambient"
    },
    image: targetFile,
    appearance: "dark"
  };
  fs.writeFileSync(path.join(themeDir, "theme.json"), JSON.stringify(theme, null, 2), "utf8");
  printSuccess("Theme created: " + themeDir);
}

async function customizeTheme() {
  printHeader("Customize Theme");
  const themes = getThemes();
  if (themes.length === 0) {
    printWarning("No themes found");
    return;
  }
  themes.forEach((theme, index) => {
    console.log(`  ${colors.bright}${index + 1}.${colors.reset} ${theme.name}`);
  });
  const choice = await ask("Select theme");
  const index = parseInt(choice) - 1;
  if (index < 0 || index >= themes.length) {
    printError("Invalid choice");
    return;
  }
  const theme = themes[index];
  const themeJsonPath = path.join(theme.path, "theme.json");
  const themeData = theme.theme;
  printHeader("Edit: " + theme.name);
  console.log("Current palette:");
  console.log(`  1. Text color (ink): ${themeData.palette.ink}`);
  console.log(`  2. Accent color: ${themeData.palette.accent}`);
  console.log(`  3. Background (surface): ${themeData.palette.surface}`);
  console.log(`  4. Opaque windows: ${themeData.palette.opaqueWindows}`);
  console.log(`  5. Contrast (0-100): ${themeData.palette.contrast}`);
  console.log(`  6. Save & return`);
  const editChoice = await ask("Select item to edit");
  switch (editChoice) {
    case "1":
      const ink = await ask("New text color (e.g. #E8E0D0)");
      if (ink) themeData.palette.ink = ink;
      break;
    case "2":
      const accent = await ask("New accent color (e.g. #E8B84B)");
      if (accent) themeData.palette.accent = accent;
      break;
    case "3":
      const surface = await ask("New background (e.g. #0F1320)");
      if (surface) themeData.palette.surface = surface;
      break;
    case "4":
      const opaque = await ask("Opaque windows? (true/false)");
      if (opaque) themeData.palette.opaqueWindows = opaque === "true";
      break;
    case "5":
      const contrast = await ask("Contrast (0-100)");
      if (contrast) themeData.palette.contrast = parseInt(contrast);
      break;
    case "6":
      return;
    default:
      printError("Invalid choice");
      return;
  }
  fs.writeFileSync(themeJsonPath, JSON.stringify(themeData, null, 2), "utf8");
  printSuccess("Palette updated");
  const apply = await ask("Apply now? (y/n)");
  if (apply.toLowerCase() === "y") {
    theme.theme = themeData;
    await applyTheme(theme);
  }
}

async function settings() {
  const config = loadConfig();
  printHeader("Settings");
  console.log("Current config:");
  console.log(`  1. Codex path: ${config.codexPath}`);
  console.log(`  2. Debug port: ${config.port}`);
  console.log(`  3. Auto start: ${config.autoStart ? "Yes" : "No"}`);
  console.log(`  4. Return`);
  const choice = await ask("Select item");
  switch (choice) {
    case "1":
      const newPath = await ask("New Codex path");
      if (newPath && fs.existsSync(newPath)) {
        config.codexPath = newPath;
        printSuccess("Path updated");
      } else {
        printError("Path not found");
      }
      break;
    case "2":
      const port = await ask("New port");
      if (port && !isNaN(port)) {
        config.port = parseInt(port);
        printSuccess("Port updated");
      } else {
        printError("Invalid port");
      }
      break;
    case "3":
      config.autoStart = !config.autoStart;
      printSuccess("Auto start " + (config.autoStart ? "enabled" : "disabled"));
      break;
    case "4":
      return;
    default:
      printError("Invalid choice");
      return;
  }
  saveConfig(config);
}

async function restoreOriginal() {
  printHeader("Restore Original");
  printInfo("This will remove the skin and restore Codex to default.");
  const confirm = await ask("Continue? (y/n)");
  if (confirm.toLowerCase() !== "y") return;
  try {
    const result = execSync(
      `powershell -Command "Get-Process -Name 'ChatGPT' -ErrorAction SilentlyContinue | Select-Object -First 1"`,
      { encoding: "utf8" }
    );
    if (result.includes("ChatGPT")) {
      printInfo("Removing skin from running Codex...");
      const removeScript = `
        const targets = await (await fetch('http://127.0.0.1:30123/json/list')).json();
        const page = targets.find(t => t.type === 'page' && t.url.startsWith('app://'));
        if (page) {
          const ws = new WebSocket(page.webSocketDebuggerUrl);
          ws.addEventListener('open', async () => {
            const vid = document.getElementById('codex-dream-skin-video');
            if (vid) { vid.pause(); vid.remove(); }
            const img = document.getElementById('codex-dream-skin-image');
            if (img) img.remove();
            const st = document.getElementById('codex-dream-skin-style');
            if (st) st.remove();
            document.documentElement.classList.remove('codex-dream-skin', 'dream-video-mode');
            ws.close();
          });
        }
      `;
    }
    const config = loadConfig();
    config.currentTheme = null;
    saveConfig(config);
    printSuccess("Skin removed. Restart Codex to see changes.");
  } catch (error) {
    printError("Failed: " + error.message);
  }
}

async function mainMenu() {
  while (true) {
    console.clear();
    console.log(`${colors.bgBlue}${colors.bright} Codex Skin Plus Console ${colors.reset}`);
    console.log("");
    const config = loadConfig();
    const currentTheme = config.currentTheme || "None";
    console.log(`  Current theme: ${colors.cyan}${currentTheme}${colors.reset}`);
    console.log(`  Codex path: ${colors.dim}${config.codexPath}${colors.reset}`);
    console.log("");
    console.log(`${colors.bright}Menu:${colors.reset}`);
    console.log(`  ${colors.green}1.${colors.reset} View & apply theme`);
    console.log(`  ${colors.green}2.${colors.reset} Create new theme`);
    console.log(`  ${colors.green}3.${colors.reset} Customize theme palette`);
    console.log(`  ${colors.green}4.${colors.reset} Settings`);
    console.log(`  ${colors.green}5.${colors.reset} Open themes folder`);
    console.log(`  ${colors.green}6.${colors.reset} Restore original (remove skin)`);
    console.log(`  ${colors.green}7.${colors.reset} Exit`);
    console.log("");
    const choice = await ask("Select");
    switch (choice) {
      case "1":
        const themes = showThemes();
        if (themes && themes.length > 0) {
          const themeChoice = await ask("Select theme (number)");
          const themeIndex = parseInt(themeChoice) - 1;
          if (themeIndex >= 0 && themeIndex < themes.length) {
            await applyTheme(themes[themeIndex]);
          } else {
            printError("Invalid choice");
          }
        }
        await waitForKey();
        break;
      case "2":
        await createTheme();
        await waitForKey();
        break;
      case "3":
        await customizeTheme();
        await waitForKey();
        break;
      case "4":
        await settings();
        await waitForKey();
        break;
      case "5":
        const openCmd = process.platform === "win32" ? "explorer" : "open";
        execSync(`${openCmd} "${THEMES_DIR}"`, { stdio: "ignore" });
        printSuccess("Opened themes folder");
        await waitForKey();
        break;
      case "6":
        await restoreOriginal();
        await waitForKey();
        break;
      case "7":
        print("Bye!", "cyan");
        rl.close();
        process.exit(0);
      default:
        printError("Invalid choice");
        await waitForKey();
    }
  }
}

console.log(`${colors.bright}Starting Codex Skin Plus Console...${colors.reset}`);
if (!fs.existsSync(THEMES_DIR)) {
  fs.mkdirSync(THEMES_DIR, { recursive: true });
}
if (!fs.existsSync(ENGINE_DIR)) {
  printError("engine folder not found");
  process.exit(1);
}
mainMenu().catch((error) => {
  printError("Error: " + error.message);
  process.exit(1);
});
