// Video wallpaper theme injector via CDP chunked transfer
const fs = require("fs");
const path = require("path");

// Get base directory (parent of engine folder)
const BASE_DIR = path.resolve(__dirname, "..");
const ACTIVE_THEME_DIR = path.join(BASE_DIR, "active-theme");
const ENGINE_DIR = __dirname;

const CHROME_CSS = `
html.codex-dream-skin.dream-video-mode aside.app-shell-left-panel,
html.codex-dream-skin.dream-video-mode main.main-surface,
html.codex-dream-skin.dream-video-mode main.main-surface > header.app-header-tint,
html.codex-dream-skin.dream-video-mode [class~="group/application-menu-top-bar"],
html.codex-dream-skin.dream-video-mode .composer-surface-chrome {
  border-radius: 0 !important;
  border: none !important;
  box-shadow: none !important;
}
html.codex-dream-skin.dream-video-mode *:focus,
html.codex-dream-skin.dream-video-mode *:focus-visible {
  outline: 2px solid rgba(232,184,75,0.4) !important;
  outline-offset: 2px !important;
}
`;

async function injectVideo(cdpPort) {
  const themePath = path.join(ACTIVE_THEME_DIR, "theme.json");
  
  // Check if theme exists
  if (!fs.existsSync(themePath)) {
    return { error: "Theme not found. Please run the launcher first." };
  }
  
  const theme = JSON.parse(fs.readFileSync(themePath, "utf8"));
  const videoPath = path.join(ACTIVE_THEME_DIR, theme.image);
  const cssPath = path.join(ENGINE_DIR, "dream-skin.css");
  
  // Check if files exist
  if (!fs.existsSync(videoPath)) {
    return { error: `Video file not found: ${theme.image}` };
  }
  if (!fs.existsSync(cssPath)) {
    return { error: "dream-skin.css not found in engine folder" };
  }
  
  const videoData = fs.readFileSync(videoPath);
  const videoBase64 = videoData.toString("base64");
  const css = fs.readFileSync(cssPath, "utf8");

  let targets; 
  try { 
    targets = await (await fetch(`http://127.0.0.1:${cdpPort}/json/list`)).json(); 
  } catch { 
    targets = await (await fetch(`http://[::1]:${cdpPort}/json/list`)).json(); 
  }
  
  const page = targets.find(t => t.type === "page" && t.url.startsWith("app://"));
  if (!page) return { error: "No Codex page found. Make sure Codex is running." };

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let msgId = 1; 
  const pend = new Map();
  
  function send(method, params = {}) {
    return new Promise((r, j) => {
      const id = msgId++; 
      const to = setTimeout(() => { pend.delete(id); j(new Error("timeout")); }, 60000);
      pend.set(id, res => { clearTimeout(to); r(res); });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }
  
  ws.addEventListener("message", e => { 
    const m = JSON.parse(e.data); 
    if (m.id && pend.has(m.id)) { 
      pend.get(m.id)(m.result); 
      pend.delete(m.id); 
    } 
  });
  
  await new Promise(r => ws.addEventListener("open", r));

  // Send video chunks
  const chunkSize = 500000;
  await send("Runtime.evaluate", { expression: 'window.__DV__ = [];' });
  for (let i = 0; i < videoBase64.length; i += chunkSize) {
    await send("Runtime.evaluate", {
      expression: `window.__DV__.push(${JSON.stringify(videoBase64.slice(i, i + chunkSize))});`,
    });
  }

  // Inject everything
  const result = await send("Runtime.evaluate", {
    expression: `(async () => {
      try {
        const b64 = window.__DV__.join(""); delete window.__DV__;
        const raw = atob(b64);
        const bytes = new Uint8Array(raw.length);
        for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
        const blob = new Blob([bytes], { type: "video/mp4" });
        const blobUrl = URL.createObjectURL(blob);

        // Cleanup
        ["codex-dream-skin-video","codex-dream-skin-style","codex-dream-skin-chrome"].forEach(id => {
          const el = document.getElementById(id);
          if (el) { if (el.tagName === "VIDEO") { el.pause(); el.src = ""; } el.remove(); }
        });
        delete window.__CODEX_DREAM_SKIN_STATE__;

        // CSS
        const st = document.createElement("style");
        st.id = "codex-dream-skin-style";
        st.textContent = ${JSON.stringify(css + CHROME_CSS)};
        document.head.appendChild(st);

        // Video
        const vid = document.createElement("video");
        vid.id = "codex-dream-skin-video";
        vid.src = blobUrl;
        vid.autoplay = true; vid.loop = true; vid.muted = true; vid.playsInline = true;
        vid.setAttribute("aria-hidden", "true");
        Object.assign(vid.style, {
          position: "fixed", top: "0", left: "0", width: "100vw", height: "100vh",
          objectFit: "cover", zIndex: "-9999", pointerEvents: "none",
          opacity: "1", filter: "brightness(0.62) saturate(1.1)"
        });
        document.body.insertBefore(vid, document.body.firstChild);

        // Transparent backgrounds
        document.documentElement.style.setProperty("background", "transparent", "important");
        document.body.style.setProperty("background", "transparent", "important");
        const rootEl = document.getElementById("root");
        if (rootEl) rootEl.style.setProperty("background", "transparent", "important");

        // Glass panels
        [["aside.app-shell-left-panel","rgba(8,10,18,0.42)"],["main.main-surface","rgba(6,8,14,0.48)"],["main.main-surface > header.app-header-tint","rgba(8,10,18,0.35)"],["[class*=application-menu-top-bar]","rgba(8,10,18,0.32)"],[".composer-surface-chrome","rgba(8,10,18,0.45)"]].forEach(([sel,bg]) => {
          document.querySelectorAll(sel).forEach(el => {
            el.style.setProperty("background", bg, "important");
            el.style.setProperty("border-radius", "0", "important");
            el.style.setProperty("border", "none", "important");
            el.style.setProperty("box-shadow", "none", "important");
          });
        });

        // Classes
        document.documentElement.classList.add("codex-dream-skin", "dream-video-mode", "dream-theme-dark", "dream-art-standard", "dream-focus-center", "dream-safe-center", "dream-task-ambient");

        await new Promise(r => { vid.addEventListener("canplay", r, {once:true}); setTimeout(r, 5000); });
        vid.play().catch(() => {});
        return { ok: true, ready: vid.readyState, paused: vid.paused, duration: vid.duration };
      } catch(e) { return { error: e.message }; }
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });

  ws.close();
  return result.result?.value;
}

// Run if called directly
if (process.argv[1] && process.argv[1].includes("inject-video-theme")) {
  const port = process.argv[2] || "30123";
  injectVideo(parseInt(port)).then(r => {
    console.log(JSON.stringify(r, null, 2));
    process.exit(r?.ok ? 0 : 1);
  }).catch(e => { console.error(e.message); process.exit(1); });
}

module.exports = { injectVideo };
