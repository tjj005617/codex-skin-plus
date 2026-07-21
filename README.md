# Codex Skin Plus

Transform your Codex desktop app with dynamic video/image wallpapers and frosted glass effects.

## Features

- **Video Wallpaper** - MP4/WebM video backgrounds
- **Image Wallpaper** - JPG/PNG/WebP image backgrounds
- **Frosted Glass Effect** - Semi-transparent UI with blur
- **Custom Themes** - Modify colors, contrast, opacity
- **Console Manager** - Easy-to-use interactive tool
- **No Source Modification** - CDP injection, safe and reversible

## Requirements

- Windows 10/11
- [Node.js](https://nodejs.org/) 16.0+
- Codex Desktop App

## Quick Start

### Install

```bash
git clone https://github.com/tjj005617/codex-skin-plus.git
cd codex-skin-plus
install.bat
```

### Launch with Skin

```bash
powershell -ExecutionPolicy Bypass -File "launch-codex-dream.ps1"
```

### Console Manager

```bash
bin\codex-skin.bat
```

Features:
1. View & apply themes (video/image)
2. Create new theme from any video/image file
3. Customize theme palette (colors, contrast)
4. Settings (Codex path, port)
5. Restore original Codex appearance

## Project Structure

```
codex-skin-plus/
├── bin/
│   ├── codex-skin.bat           # Console launcher
│   └── codex-skin.js            # Console manager app
├── engine/
│   ├── inject-theme.cjs         # Theme injector (video+image)
│   └── dream-skin.css           # Theme stylesheet
├── themes/
│   ├── mondstadt-dusk/          # Mondstadt dusk video theme
│   └── example-image/           # Example image theme template
├── install.bat                  # One-click installer
├── launch-codex-dream.ps1       # Launcher script
└── README.md
```

## Themes

### Built-in Themes

- **Mondstadt Dusk** - Genshin Impact Mondstadt sunset scenery (video)

### Create Custom Theme

1. Run console: `bin\codex-skin.bat`
2. Select "Create new theme"
3. Choose type (video or image)
4. Enter file path
5. Theme will be created in `themes/` folder

### Theme Configuration (theme.json)

```json
{
  "id": "my-theme",
  "name": "My Theme",
  "palette": {
    "ink": "#E8E0D0",
    "accent": "#E8B84B",
    "surface": "#0F1320",
    "opaqueWindows": false,
    "contrast": 50
  },
  "image": "wallpaper.mp4",
  "appearance": "dark"
}
```

| Parameter | Description | Example |
|-----------|-------------|---------|
| ink | Text color | #E8E0D0 |
| accent | Accent/highlight color | #E8B84B |
| surface | Background color | #0F1320 |
| opaqueWindows | Make windows opaque | false |
| contrast | Contrast level (0-100) | 50 |

## How It Works

1. Codex starts with debug port (30123)
2. Script connects via Chrome DevTools Protocol
3. Injects CSS for frosted glass effect
4. Injects video/image as background
5. Sets transparent backgrounds on UI panels

**Advantages:**
- No modification to Codex files
- Survives Codex updates
- Easy to remove (just restart Codex)

## FAQ

### Theme not showing?

- Make sure you use the launcher script (not direct Codex shortcut)
- Check Node.js is installed: `node --version`
- Close all Codex windows first
- Check if port 30123 is available

### Video laggy?

- Use smaller video (< 10MB)
- Lower resolution (720p)
- Shorter duration (10-15s)
- Lower frame rate (24fps)

### How to remove skin?

Option 1: Restart Codex without launcher script

Option 2: Use console manager -> "Restore original"

### Port 30123 in use?

```powershell
netstat -ano | findstr :30123
taskkill /PID <PID> /F
```

## AI Prompt for Installation Help

Copy and paste this to any AI assistant:

```
I want to add custom skins to Codex desktop app using Codex Skin Plus.

Repository: https://github.com/tjj005617/codex-skin-plus

My environment:
- OS: Windows 10/11
- Node.js version: [run: node --version]
- Codex path: [default: E:\codex\Codex]

Please help me:

1. CHECK ENVIRONMENT
   - Verify Node.js is installed
   - Verify Codex is installed
   - Check if port 30123 is available

2. INSTALL PROJECT
   - Clone repository to local
   - Or download ZIP and extract
   - Run install.bat

3. TEST THEME
   - Launch Codex with skin script
   - Verify video/image wallpaper displays
   - Verify frosted glass effect works

4. FIX ISSUES (if any)
   - Check Codex debug port
   - Check Node.js PATH
   - Check firewall settings
   - Provide specific error solutions

5. CUSTOMIZE (optional)
   - Modify theme colors
   - Change wallpaper video/image
   - Set auto-start on boot

Provide step-by-step commands and specific solutions for errors.
```

## License

MIT License - See [LICENSE](LICENSE)

## Credits

- Original concept: [Codex-Dream-Skin](https://github.com/Fei-Away/Codex-Dream-Skin) by Fei-Away
- Video source: Genshin Impact Mondstadt dusk scenery
- Thanks to all contributors

## Support

- Issues: [GitHub Issues](https://github.com/tjj005617/codex-skin-plus/issues)
- Discussions: [GitHub Discussions](https://github.com/tjj005617/codex-skin-plus/discussions)

---

**If this project helps you, please give it a Star!**
