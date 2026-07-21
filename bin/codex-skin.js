#!/usr/bin/env node
/**
 * Codex Skin Plus - 鎺у埗鍙扮鐞嗗伐鍏? * 鍔熻兘锛氬垏鎹㈣棰?鍥剧墖澹佺焊銆佽嚜瀹氫箟涓婚銆佺鐞嗙毊鑲? */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");

// 璺緞閰嶇疆
const BASE_DIR = path.resolve(__dirname, "..");
const THEMES_DIR = path.join(BASE_DIR, "themes");
const ACTIVE_THEME_DIR = path.join(BASE_DIR, "active-theme");
const ENGINE_DIR = path.join(BASE_DIR, "engine");
const CONFIG_FILE = path.join(BASE_DIR, "config.json");

// 棰滆壊杈撳嚭
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
  bgGreen: "\x1b[42m",
};

// 娓呭睆
function clear() {
  console.clear();
}

// 甯﹂鑹茬殑杈撳嚭
function print(text, color = "white") {
  console.log(`${colors[color]}${text}${colors.reset}`);
}

function printHeader(text) {
  console.log("");
  console.log(`${colors.bgBlue}${colors.bright} ${text} ${colors.reset}`);
  console.log("");
}

function printSuccess(text) {
  print(`鉁?${text}`, "green");
}

function printError(text) {
  print(`鉁?${text}`, "red");
}

function printWarning(text) {
  print(`鈿?${text}`, "yellow");
}

function printInfo(text) {
  print(`鈩?${text}`, "cyan");
}

// 鍒涘缓 readline 鎺ュ彛
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// 璇㈤棶鐢ㄦ埛杈撳叆
function ask(question) {
  return new Promise((resolve) => {
    rl.question(`${colors.yellow}? ${question}: ${colors.reset}`, (answer) => {
      resolve(answer.trim());
    });
  });
}

// 绛夊緟鎸夐敭
function waitForKey() {
  return new Promise((resolve) => {
    rl.question(`${colors.dim}\n鎸?Enter 閿户缁?..${colors.reset}`, () => {
      resolve();
    });
  });
}

// 鍔犺浇閰嶇疆
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

// 淇濆瓨閰嶇疆
function saveConfig(config) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), "utf8");
}

// 鑾峰彇鎵€鏈変富棰?function getThemes() {
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
        const hasVideo = fs.existsSync(path.join(themePath, theme.image));
        const isVideo = theme.image.endsWith(".mp4") || theme.image.endsWith(".webm");
        
        themes.push({
          id: theme.id || item,
          name: theme.name || item,
          path: themePath,
          image: theme.image,
          type: isVideo ? "video" : "image",
          hasFile: hasVideo,
          theme: theme,
        });
      } catch (e) {
        // 璺宠繃鏃犳晥鐨勪富棰?      }
    }
  }
  
  return themes;
}

// 鏄剧ず涓婚鍒楄〃
function showThemes() {
  const themes = getThemes();
  
  if (themes.length === 0) {
    printWarning("娌℃湁鎵惧埌浠讳綍涓婚");
    printInfo(`璇峰皢涓婚鏂囦欢澶规斁鍏? ${THEMES_DIR}`);
    return null;
  }
  
  printHeader("鍙敤涓婚");
  
  themes.forEach((theme, index) => {
    const typeIcon = theme.type === "video" ? "馃幀" : "馃柤锔?;
    const status = theme.hasFile ? `${colors.green}鉁揱 : `${colors.red}鉁梎;
    const typeColor = theme.type === "video" ? "cyan" : "magenta";
    
    console.log(
      `  ${colors.bright}${index + 1}.${colors.reset} ` +
      `${typeIcon} ${theme.name} ` +
      `${colors.dim}(${theme.type})${colors.reset} ` +
      `[${status}${colors.reset}]`
    );
  });
  
  return themes;
}

// 搴旂敤涓婚
async function applyTheme(theme) {
  printHeader(`搴旂敤涓婚: ${theme.name}`);
  
  // 妫€鏌ユ枃浠舵槸鍚﹀瓨鍦?  if (!theme.hasFile) {
    printError(`鏂囦欢涓嶅瓨鍦? ${theme.image}`);
    return false;
  }
  
  // 鍒涘缓 active-theme 鐩綍
  if (!fs.existsSync(ACTIVE_THEME_DIR)) {
    fs.mkdirSync(ACTIVE_THEME_DIR, { recursive: true });
  }
  
  // 澶嶅埗涓婚鏂囦欢
  printInfo("澶嶅埗涓婚鏂囦欢...");
  
  const sourceThemeJson = path.join(theme.path, "theme.json");
  const sourceImage = path.join(theme.path, theme.image);
  
  fs.copyFileSync(sourceThemeJson, path.join(ACTIVE_THEME_DIR, "theme.json"));
  fs.copyFileSync(sourceImage, path.join(ACTIVE_THEME_DIR, theme.image));
  
  printSuccess("涓婚鏂囦欢宸插鍒?);
  
  // 鏇存柊閰嶇疆
  const config = loadConfig();
  config.currentTheme = theme.id;
  saveConfig(config);
  
  printSuccess("閰嶇疆宸叉洿鏂?);
  
  // 娉ㄥ叆涓婚
  printInfo("姝ｅ湪娉ㄥ叆涓婚...");
  
  const injectorScript = path.join(ENGINE_DIR, "inject-theme.cjs");
  
  if (!fs.existsSync(injectorScript)) {
    printError("娉ㄥ叆鍣ㄤ笉瀛樺湪");
    return false;
  }
  
  try {
    // 妫€鏌?Codex 鏄惁杩愯
    const result = execSync(
      `powershell -Command "Get-Process -Name 'ChatGPT' -ErrorAction SilentlyContinue | Select-Object -First 1"`,
      { encoding: "utf8" }
    );
    
    if (!result.includes("ChatGPT")) {
      printWarning("Codex 鏈繍琛?);
      printInfo("璇峰厛鍚姩 Codex锛岀劧鍚庡啀杩愯姝ゅ伐鍏?);
      return false;
    }
    
    // 鎵ц娉ㄥ叆
    execSync(`node "${injectorScript}"`, { 
      encoding: "utf8",
      stdio: "inherit"
    });
    
    printSuccess("涓婚娉ㄥ叆鎴愬姛锛?);
    return true;
    
  } catch (error) {
    printError(`娉ㄥ叆澶辫触: ${error.message}`);
    return false;
  }
}

// 鍒涘缓鏂颁富棰?async function createTheme() {
  printHeader("鍒涘缓鏂颁富棰?);
  
  const name = await ask("涓婚鍚嶇О");
  if (!name) {
    printError("涓婚鍚嶇О涓嶈兘涓虹┖");
    return;
  }
  
  const id = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const themeDir = path.join(THEMES_DIR, id);
  
  if (fs.existsSync(themeDir)) {
    printError(`涓婚宸插瓨鍦? ${id}`);
    return;
  }
  
  // 閫夋嫨绫诲瀷
  console.log("\n涓婚绫诲瀷:");
  console.log(`  ${colors.cyan}1.${colors.reset} 瑙嗛澹佺焊 (.mp4)`);
  console.log(`  ${colors.magenta}2.${colors.reset} 鍥剧墖澹佺焊 (.jpg/.png)`);
  
  const typeChoice = await ask("閫夋嫨绫诲瀷 (1/2)");
  const isVideo = typeChoice === "1";
  const ext = isVideo ? ".mp4" : ".jpg";
  
  // 鑾峰彇鏂囦欢璺緞
  const filePath = await ask(`${isVideo ? "瑙嗛" : "鍥剧墖"}鏂囦欢璺緞`);
  
  if (!fs.existsSync(filePath)) {
    printError("鏂囦欢涓嶅瓨鍦?);
    return;
  }
  
  // 楠岃瘉鏂囦欢绫诲瀷
  const fileExt = path.extname(filePath).toLowerCase();
  if (isVideo && ![".mp4", ".webm"].includes(fileExt)) {
    printError("瑙嗛鏂囦欢蹇呴』鏄?.mp4 鎴?.webm 鏍煎紡");
    return;
  }
  
  if (!isVideo && ![".jpg", ".jpeg", ".png", ".webp"].includes(fileExt)) {
    printError("鍥剧墖鏂囦欢蹇呴』鏄?.jpg銆?png 鎴?.webp 鏍煎紡");
    return;
  }
  
  // 鍒涘缓涓婚鐩綍
  fs.mkdirSync(themeDir, { recursive: true });
  
  // 澶嶅埗鏂囦欢
  const targetFile = `${id}${ext}`;
  fs.copyFileSync(filePath, path.join(themeDir, targetFile));
  
  // 鍒涘缓 theme.json
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
  
  fs.writeFileSync(
    path.join(themeDir, "theme.json"),
    JSON.stringify(theme, null, 2),
    "utf8"
  );
  
  printSuccess(`涓婚鍒涘缓鎴愬姛: ${themeDir}`);
  printInfo("浣犲彲浠ユ墜鍔ㄧ紪杈?theme.json 鏉ヨ嚜瀹氫箟閰嶈壊");
}

// 鑷畾涔変富棰橀厤鑹?async function customizeTheme() {
  printHeader("鑷畾涔変富棰橀厤鑹?);
  
  const themes = getThemes();
  if (themes.length === 0) {
    printWarning("娌℃湁鎵惧埌浠讳綍涓婚");
    return;
  }
  
  // 鏄剧ず涓婚鍒楄〃
  themes.forEach((theme, index) => {
    console.log(`  ${colors.bright}${index + 1}.${colors.reset} ${theme.name}`);
  });
  
  const choice = await ask("閫夋嫨瑕佺紪杈戠殑涓婚");
  const index = parseInt(choice) - 1;
  
  if (index < 0 || index >= themes.length) {
    printError("鏃犳晥鐨勯€夋嫨");
    return;
  }
  
  const theme = themes[index];
  const themeJsonPath = path.join(theme.path, "theme.json");
  const themeData = theme.theme;
  
  printHeader(`缂栬緫涓婚: ${theme.name}`);
  
  console.log("褰撳墠閰嶈壊:");
  console.log(`  1. 鏂囧瓧棰滆壊 (ink): ${themeData.palette.ink}`);
  console.log(`  2. 寮鸿皟鑹?(accent): ${themeData.palette.accent}`);
  console.log(`  3. 鑳屾櫙鑹?(surface): ${themeData.palette.surface}`);
  console.log(`  4. 绐楀彛涓嶉€忔槑 (opaqueWindows): ${themeData.palette.opaqueWindows}`);
  console.log(`  5. 瀵规瘮搴?(contrast): ${themeData.palette.contrast}`);
  console.log(`  6. 淇濆瓨骞惰繑鍥瀈);
  
  const editChoice = await ask("閫夋嫨瑕佷慨鏀圭殑椤圭洰");
  
  switch (editChoice) {
    case "1":
      const ink = await ask("鏂版枃瀛楅鑹?(濡?#E8E0D0)");
      if (ink) themeData.palette.ink = ink;
      break;
    case "2":
      const accent = await ask("鏂板己璋冭壊 (濡?#E8B84B)");
      if (accent) themeData.palette.accent = accent;
      break;
    case "3":
      const surface = await ask("鏂拌儗鏅壊 (濡?#0F1320)");
      if (surface) themeData.palette.surface = surface;
      break;
    case "4":
      const opaque = await ask("绐楀彛涓嶉€忔槑? (true/false)");
      if (opaque) themeData.palette.opaqueWindows = opaque === "true";
      break;
    case "5":
      const contrast = await ask("瀵规瘮搴?(0-100)");
      if (contrast) themeData.palette.contrast = parseInt(contrast);
      break;
    case "6":
      return;
    default:
      printError("鏃犳晥鐨勯€夋嫨");
      return;
  }
  
  // 淇濆瓨淇敼
  fs.writeFileSync(themeJsonPath, JSON.stringify(themeData, null, 2), "utf8");
  printSuccess("閰嶈壊宸叉洿鏂?);
  
  // 璇㈤棶鏄惁搴旂敤
  const apply = await ask("鏄惁绔嬪嵆搴旂敤姝や富棰? (y/n)");
  if (apply.toLowerCase() === "y") {
    // 閲嶆柊鍔犺浇涓婚鏁版嵁
    theme.theme = themeData;
    await applyTheme(theme);
  }
}

// 閰嶇疆璁剧疆
async function settings() {
  const config = loadConfig();
  
  printHeader("璁剧疆");
  
  console.log("褰撳墠閰嶇疆:");
  console.log(`  1. Codex 璺緞: ${config.codexPath}`);
  console.log(`  2. 璋冭瘯绔彛: ${config.port}`);
  console.log(`  3. 寮€鏈鸿嚜鍚姩: ${config.autoStart ? "鏄? : "鍚?}`);
  console.log(`  4. 杩斿洖涓昏彍鍗昤);
  
  const choice = await ask("閫夋嫨瑕佷慨鏀圭殑椤圭洰");
  
  switch (choice) {
    case "1":
      const newPath = await ask("鏂?Codex 璺緞");
      if (newPath && fs.existsSync(newPath)) {
        config.codexPath = newPath;
        printSuccess("璺緞宸叉洿鏂?);
      } else {
        printError("璺緞涓嶅瓨鍦?);
      }
      break;
    case "2":
      const port = await ask("鏂拌皟璇曠鍙?);
      if (port && !isNaN(port)) {
        config.port = parseInt(port);
        printSuccess("绔彛宸叉洿鏂?);
      } else {
        printError("鏃犳晥鐨勭鍙?);
      }
      break;
    case "3":
      config.autoStart = !config.autoStart;
      printSuccess(`寮€鏈鸿嚜鍚姩宸?{config.autoStart ? "鍚敤" : "绂佺敤"}`);
      break;
    case "4":
      return;
    default:
      printError("鏃犳晥鐨勯€夋嫨");
      return;
  }
  
  saveConfig(config);
}

// 涓昏彍鍗?async function mainMenu() {
  while (true) {
    clear();
    
    console.log(`${colors.bgBlue}${colors.bright} Codex Skin Plus 鎺у埗鍙?${colors.reset}`);
    console.log("");
    
    const config = loadConfig();
    const currentTheme = config.currentTheme || "鏈缃?;
    
    console.log(`  褰撳墠涓婚: ${colors.cyan}${currentTheme}${colors.reset}`);
    console.log(`  Codex 璺緞: ${colors.dim}${config.codexPath}${colors.reset}`);
    console.log("");
    
    console.log(`${colors.bright}鍔熻兘鑿滃崟:${colors.reset}`);
    console.log(`  ${colors.green}1.${colors.reset} 鏌ョ湅骞跺簲鐢ㄤ富棰榒);
    console.log(`  ${colors.green}2.${colors.reset} 鍒涘缓鏂颁富棰榒);
    console.log(`  ${colors.green}3.${colors.reset} 鑷畾涔変富棰橀厤鑹瞏);
    console.log(`  ${colors.green}4.${colors.reset} 璁剧疆`);
    console.log(`  ${colors.green}5.${colors.reset} 鎵撳紑涓婚鐩綍`);
    console.log(`  ${colors.green}6.${colors.reset} 閫€鍑篳);
    console.log("");
    
    const choice = await ask("璇烽€夋嫨鍔熻兘");
    
    switch (choice) {
      case "1":
        const themes = showThemes();
        if (themes && themes.length > 0) {
          const themeChoice = await ask("閫夋嫨涓婚 (杈撳叆搴忓彿)");
          const themeIndex = parseInt(themeChoice) - 1;
          
          if (themeIndex >= 0 && themeIndex < themes.length) {
            await applyTheme(themes[themeIndex]);
          } else {
            printError("鏃犳晥鐨勯€夋嫨");
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
        const openCommand = process.platform === "win32" ? "explorer" : "open";
        execSync(`${openCommand} "${THEMES_DIR}"`, { stdio: "ignore" });
        printSuccess("宸叉墦寮€涓婚鐩綍");
        await waitForKey();
        break;
        
      case "6":
        print("鍐嶈锛?, "cyan");
        rl.close();
        process.exit(0);
        
      default:
        printError("鏃犳晥鐨勯€夋嫨");
        await waitForKey();
    }
  }
}

// 鍚姩
console.log(`${colors.bright}姝ｅ湪鍚姩 Codex Skin Plus 鎺у埗鍙?..${colors.reset}`);

// 妫€鏌ョ洰褰曠粨鏋?if (!fs.existsSync(THEMES_DIR)) {
  fs.mkdirSync(THEMES_DIR, { recursive: true });
}

if (!fs.existsSync(ENGINE_DIR)) {
  printError("engine 鐩綍涓嶅瓨鍦紝璇风‘淇濈▼搴忓畬鏁?);
  process.exit(1);
}

// 鍚姩涓昏彍鍗?mainMenu().catch((error) => {
  printError(`绋嬪簭閿欒: ${error.message}`);
  process.exit(1);
});

