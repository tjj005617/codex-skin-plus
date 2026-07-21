const fs = require("fs");
let html = fs.readFileSync("E:/codex/Codex-Dream-Skin/app/index.html", "utf8");

// 1. Fix shadowed variable - rename parameter in createThemeCard
html = html.replace("function createThemeCard(t) {", "function createThemeCard(theme) {");

// Fix references inside createThemeCard - use word boundary
html = html.replace(/\bt\.id\b/g, "theme.id");
html = html.replace(/\bt\.type\b/g, "theme.type");
html = html.replace(/\bt\.name\b/g, "theme.name");
html = html.replace(/\bt\.hasFile\b/g, "theme.hasFile");

// Fix forEach loop variables
html = html.replace("imageThemes.forEach(t => {", "imageThemes.forEach(theme => {");
html = html.replace("videoThemes.forEach(t => {", "videoThemes.forEach(theme => {");

// 2. Fix video preview - use preload metadata for faster loading
html = html.replace(
  'preload="none" style="background:#1a1a25"',
  'preload="metadata" playsinline style="background:#1a1a25"'
);

// 3. Fix light theme CSS - remove duplicate and ensure it works
const lightCSS = `
    body.light {
      --bg: #f8f9fa;
      --bg-card: #ffffff;
      --bg-hover: #eee;
      --border: #ddd;
      --text: #1a1a2e;
      --text-dim: #666;
      --accent: #c49a30;
      --accent-dim: rgba(196, 154, 48, 0.12);
    }
    body.light .header { background: rgba(248, 249, 250, 0.95); border-bottom-color: #ddd; }
    body.light .sidebar { background: rgba(248, 249, 250, 0.95); border-right-color: #ddd; }
    body.light .toast { background: #fff; border-color: #ddd; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
`;

// Remove old light theme CSS if exists
html = html.replace(/body\.light \{[\s\S]*?\}[\s\S]*?body\.light \.[\s\S]*?\}[\s\S]*?body\.light \.[\s\S]*?\}[\s\S]*?body\.light \.[\s\S]*?\}/g, "");

// Add light theme before closing style tag
html = html.replace("</style>", lightCSS + "  </style>");

fs.writeFileSync("E:/codex/Codex-Dream-Skin/app/index.html", html, "utf8");
console.log("Fixed preview and theme issues");
