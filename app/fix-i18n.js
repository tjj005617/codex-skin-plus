const fs = require("fs");
let html = fs.readFileSync("E:/codex/Codex-Dream-Skin/app/index.html", "utf8");

// Add theme and language switcher to header
const oldHeader = `<h1>Codex Skin Plus Manager</h1>
    <span style="font-size:12px;color:var(--text-dim)">localhost:30200</span>`;

const newHeader = `<h1>Codex Skin Plus Manager</h1>
    <div style="display:flex;align-items:center;gap:12px">
      <button class="btn btn-secondary" style="padding:6px 12px;font-size:12px" onclick="toggleTheme()" id="themeToggle">Light</button>
      <button class="btn btn-secondary" style="padding:6px 12px;font-size:12px" onclick="toggleLang()" id="langToggle">EN</button>
    </div>`;

html = html.replace(oldHeader, newHeader);

// Add light theme CSS
const lightThemeCSS = `
    body.light {
      --bg: #f5f5f5;
      --bg-card: #ffffff;
      --bg-hover: #f0f0f0;
      --border: #e0e0e0;
      --text: #1a1a2e;
      --text-dim: #666666;
      --accent: #d4a640;
      --accent-dim: rgba(212, 166, 64, 0.12);
    }
    body.light .header { background: rgba(245, 245, 245, 0.95); }
    body.light .sidebar { background: rgba(248, 248, 248, 0.95); }
    body.light .toast { background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
`;

html = html.replace("</style>", lightThemeCSS + "\n  </style>");

// Add i18n and theme logic
const i18nScript = `
    // i18n translations
    const i18n = {
      zh: {
        themes: '主题', create: '创建', palette: '调色板', settings: '设置',
        available: '可用主题', refresh: '刷新', imageWallpapers: '图片壁纸',
        videoWallpapers: '视频壁纸', active: '已激活', ready: '就绪',
        createTheme: '创建新主题', themeName: '主题名称', type: '类型',
        video: '视频壁纸', image: '图片壁纸', file: '文件',
        browse: '浏览', uploadCreate: '上传并创建', customizePalette: '自定义配色',
        selectTheme: '选择主题', textColor: '文字颜色', accentColor: '强调色',
        backgroundColor: '背景色', contrast: '对比度', save: '保存',
        saveApply: '保存并应用', codexPath: 'Codex 安装路径', debugPort: '调试端口',
        removeSkin: '移除皮肤', restoreDefault: '恢复 Codex 默认', noThemes: '暂无主题',
        themeApplied: '主题已应用!', themeCreated: '主题已创建!', saved: '已保存!',
        restored: '已恢复默认! 请重启 Codex', confirmRemove: '确定移除皮肤?',
        confirmRestore: '确定恢复 Codex 默认外观?', selectFile: '请选择文件',
        enterName: '请输入主题名称', missingFile: '文件缺失', enterPath: '请输入路径'
      },
      en: {
        themes: 'Themes', create: 'Create', palette: 'Palette', settings: 'Settings',
        available: 'Available Themes', refresh: 'Refresh', imageWallpapers: 'Image Wallpapers',
        videoWallpapers: 'Video Wallpapers', active: 'Active', ready: 'Ready',
        createTheme: 'Create New Theme', themeName: 'Theme Name', type: 'Type',
        video: 'Video Wallpaper', image: 'Image Wallpaper', file: 'File',
        browse: 'Browse', uploadCreate: 'Upload & Create', customizePalette: 'Customize Palette',
        selectTheme: 'Select Theme', textColor: 'Text Color', accentColor: 'Accent Color',
        backgroundColor: 'Background', contrast: 'Contrast', save: 'Save',
        saveApply: 'Save & Apply', codexPath: 'Codex Installation Path', debugPort: 'Debug Port',
        removeSkin: 'Remove Skin', restoreDefault: 'Restore Codex Default', noThemes: 'No themes yet',
        themeApplied: 'Theme applied!', themeCreated: 'Theme created!', saved: 'Saved!',
        restored: 'Restored to default! Restart Codex', confirmRemove: 'Remove skin?',
        confirmRestore: 'Restore Codex to default appearance?', selectFile: 'Please select a file',
        enterName: 'Please enter a theme name', missingFile: 'Missing file', enterPath: 'Please enter path'
      }
    };

    let currentLang = localStorage.getItem('codex-skin-lang') || 'zh';
    let isLight = localStorage.getItem('codex-skin-theme') === 'light';

    function t(key) { return i18n[currentLang][key] || key; }

    function applyLang() {
      // Update sidebar
      document.querySelector('[data-page="themes"] span, [data-page="themes"]').lastChild.textContent = t('themes');
      document.querySelector('[data-page="create"] span, [data-page="create"]').lastChild.textContent = t('create');
      document.querySelector('[data-page="palette"] span, [data-page="palette"]').lastChild.textContent = t('palette');
      document.querySelector('[data-page="settings"] span, [data-page="settings"]').lastChild.textContent = t('settings');
      
      // Update page headers and content
      document.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = t(el.dataset.i18n);
      });
      
      // Update button text
      document.querySelectorAll('[data-i18n-btn]').forEach(el => {
        el.textContent = t(el.dataset.i18nBtn);
      });
      
      document.getElementById('langToggle').textContent = currentLang === 'zh' ? 'EN' : '中';
    }

    function applyTheme() {
      document.body.classList.toggle('light', isLight);
      document.getElementById('themeToggle').textContent = isLight ? 'Dark' : 'Light';
    }

    function toggleTheme() {
      isLight = !isLight;
      localStorage.setItem('codex-skin-theme', isLight ? 'light' : 'dark');
      applyTheme();
    }

    function toggleLang() {
      currentLang = currentLang === 'zh' ? 'en' : 'zh';
      localStorage.setItem('codex-skin-lang', currentLang);
      applyLang();
      renderThemes(); // Re-render with new language
    }

`;

html = html.replace("    let themes = [];", i18nScript + "\n    let themes = [];");

// Update renderThemes to use i18n
html = html.replace(
  `html += \`<h3>Image Wallpapers <span class="count">\${imageThemes.length}</span></h3>\`;`,
  `html += \`<h3>\${t('imageWallpapers')} <span class="count">\${imageThemes.length}</span></h3>\`;`
);
html = html.replace(
  `html += \`<h3>Video Wallpapers <span class="count">\${videoThemes.length}</span></h3>\`;`,
  `html += \`<h3>\${t('videoWallpapers')} <span class="count">\${videoThemes.length}</span></h3>\`;`
);
html = html.replace(
  `html = '<div class="empty-state">No themes found. Create one in the Create tab.</div>';`,
  `html = '<div class="empty-state">' + t('noThemes') + '</div>';`
);

// Update theme card text
html = html.replace(
  `\${isActive ? '<span class="badge active">Active</span>' : ''}`,
  `\${isActive ? '<span class="badge active">' + t('active') + '</span>' : ''}`
);
html = html.replace(
  `\${t.hasFile ? 'Ready' : 'Missing file'}`,
  `\${t.hasFile ? t('ready') : t('missingFile')}`
);

// Add data-i18n attributes to static elements
html = html.replace('Create New Theme', '<span data-i18n="createTheme">Create New Theme</span>');
html = html.replace('Theme Name', '<span data-i18n="themeName">Theme Name</span>');
html = html.replace('<label>Type</label>', '<label data-i18n="type">Type</label>');
html = html.replace('Video Wallpaper (.mp4/.webm)', '<span data-i18n="video">Video Wallpaper</span> (.mp4/.webm)');
html = html.replace('Image Wallpaper (.jpg/.png/.webp/.svg)', '<span data-i18n="image">Image Wallpaper</span> (.jpg/.png/.webp/.svg)');
html = html.replace('<label>File</label>', '<label data-i18n="file">File</label>');
html = html.replace('>Browse<', ' data-i18n-btn="browse">Browse<');
html = html.replace('>Upload & Create<', ' data-i18n-btn="uploadCreate">Upload & Create<');
html = html.replace('Customize Palette', '<span data-i18n="customizePalette">Customize Palette</span>');
html = html.replace('<label>Select Theme</label>', '<label data-i18n="selectTheme">Select Theme</label>');
html = html.replace('Text Color (ink)', '<span data-i18n="textColor">Text Color</span> (ink)');
html = html.replace('Accent Color', '<span data-i18n="accentColor">Accent Color</span>');
html = html.replace('Background', '<span data-i18n="backgroundColor">Background</span>');
html = html.replace('Contrast (0-100)', '<span data-i18n="contrast">Contrast</span> (0-100)');
html = html.replace('>Save<', ' data-i18n-btn="save">Save<');
html = html.replace('>Save & Apply<', ' data-i18n-btn="saveApply">Save & Apply<');
html = html.replace('Codex Installation Path', '<span data-i18n="codexPath">Codex Installation Path</span>');
html = html.replace('Debug Port', '<span data-i18n="debugPort">Debug Port</span>');
html = html.replace('>Remove Skin<', ' data-i18n-btn="removeSkin">Remove Skin<');
html = html.replace('>Restore Codex Default<', ' data-i18n-btn="restoreDefault">Restore Codex Default<');

// Add init calls
html = html.replace("    loadThemes();", "    applyTheme(); applyLang(); loadThemes();");

// Update toast messages to use i18n
html = html.replace("showToast('Theme applied!'", "showToast(t('themeApplied')");
html = html.replace("showToast('Theme created!'", "showToast(t('themeCreated')");
html = html.replace("showToast('Saved!'", "showToast(t('saved')");
html = html.replace("showToast('Restored to default!'", "showToast(t('restored')");
html = html.replace("showToast('Please enter a theme name'", "showToast(t('enterName')");
html = html.replace("showToast('Please select a file'", "showToast(t('selectFile')");

// Update confirm dialogs
html = html.replace("if (!confirm('Remove skin?'))", "if (!confirm(t('confirmRemove')))");
html = html.replace("if (!confirm('Restore Codex to default appearance? This will remove the skin.'))", "if (!confirm(t('confirmRestore')))");

fs.writeFileSync("E:/codex/Codex-Dream-Skin/app/index.html", html, "utf8");
console.log("Added theme and language switcher");
