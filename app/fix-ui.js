const fs = require("fs");
let html = fs.readFileSync("E:/codex/Codex-Dream-Skin/app/index.html", "utf8");

// 1. Remove play button from video preview
html = html.replace(/<div class="play-icon">[\s\S]*?<\/div>/g, "");

// 2. Add file upload to Create page - replace File Path input with file selector
html = html.replace(
  `<label>File Path</label>
          <input type="text" id="newThemeFile" placeholder="D:\\wallpapers\\my-video.mp4">`,
  `<label>File</label>
          <div style="display:flex;gap:8px">
            <input type="text" id="newThemeFile" placeholder="Select file..." readonly style="flex:1">
            <button class="btn btn-secondary" onclick="document.getElementById('fileInput').click()">Browse</button>
            <input type="file" id="fileInput" accept="video/mp4,video/webm,image/jpeg,image/png,image/webp" style="display:none" onchange="handleFileSelect(this)">
          </div>`
);

// 3. Add restore button in Settings
html = html.replace(
  `<button class="btn btn-danger" onclick="restoreOriginal()">Remove Skin</button>
        </div>`,
  `<button class="btn btn-danger" onclick="restoreOriginal()">Remove Skin</button>
          <button class="btn btn-secondary" onclick="restoreDefault()">Restore Codex Default</button>
        </div>`
);

// 4. Add JavaScript functions before loadThemes()
const newFunctions = `
    // File upload handler
    function handleFileSelect(input) {
      if (input.files && input.files[0]) {
        window.selectedFile = input.files[0];
        document.getElementById('newThemeFile').value = input.files[0].name;
        // Auto-detect type
        const ext = input.files[0].name.split('.').pop().toLowerCase();
        const isVideo = ['mp4', 'webm'].includes(ext);
        document.getElementById('newThemeType').value = isVideo ? 'video' : 'image';
      }
    }

    // Upload and create theme
    async function uploadAndCreateTheme() {
      const name = document.getElementById('newThemeName').value;
      const type = document.getElementById('newThemeType').value;
      if (!name) { showToast('Please enter a theme name', 'error'); return; }
      if (!window.selectedFile) { showToast('Please select a file', 'error'); return; }

      const formData = new FormData();
      formData.append('file', window.selectedFile);
      formData.append('name', name);
      formData.append('type', type);

      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const result = await res.json();
        if (result.ok) {
          showToast('Theme created!', 'success');
          document.getElementById('newThemeName').value = '';
          document.getElementById('newThemeFile').value = '';
          window.selectedFile = null;
          loadThemes();
        } else {
          showToast(result.error || 'Upload failed', 'error');
        }
      } catch (e) {
        showToast('Upload failed: ' + e.message, 'error');
      }
    }

    // Restore Codex default
    async function restoreDefault() {
      if (!confirm('Restore Codex to default appearance? This will remove the skin.')) return;
      const result = await api('/api/restore-default', 'POST');
      if (result.ok) {
        showToast('Restored to default! Restart Codex.', 'success');
        currentConfig.currentTheme = null;
        renderThemes();
      }
    }

`;

html = html.replace("    loadThemes();", newFunctions + "    loadThemes();");

// 5. Update Create button
html = html.replace(
  `<button class="btn btn-primary" onclick="createTheme()">Create Theme</button>`,
  `<button class="btn btn-primary" onclick="uploadAndCreateTheme()">Upload & Create</button>`
);

fs.writeFileSync("E:/codex/Codex-Dream-Skin/app/index.html", html, "utf8");
console.log("Updated HTML successfully");
