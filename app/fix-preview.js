const fs = require("fs");
const path = "E:/codex/Codex-Dream-Skin/app/index.html";
let html = fs.readFileSync(path, "utf8");

// Update preview section to show images
const oldPreview = `          <div class="theme-preview">
            <span>\${t.type.toUpperCase()}</span>
            <span class="theme-type">\${t.type}</span>
          </div>`;

const newPreview = `          <div class="theme-preview">
            \${t.hasFile && t.type === "image" ? '<img src="/api/preview/' + t.id + '" onerror="this.style.display=\\'none\\'">' : '<span>' + t.type.toUpperCase() + '</span>'}
            <span class="theme-type">\${t.type}</span>
          </div>`;

html = html.replace(oldPreview, newPreview);

// Add CSS for preview images
const oldCSS = `    .theme-preview {
      height: 120px;
      background: linear-gradient(135deg, #1a1a25, #0a0a15);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      color: var(--text-dim);
      position: relative;
    }`;

const newCSS = `    .theme-preview {
      height: 120px;
      background: linear-gradient(135deg, #1a1a25, #0a0a15);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      color: var(--text-dim);
      position: relative;
      overflow: hidden;
    }
    .theme-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }`;

html = html.replace(oldCSS, newCSS);

fs.writeFileSync(path, html, "utf8");
console.log("Updated index.html successfully");
