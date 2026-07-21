# Codex Skin Plus

给 Codex 桌面版换上动态视频壁纸主题，支持磨砂毛玻璃效果和自定义风格。

## 功能特性

- **动态视频壁纸** - 支持 MP4 视频作为背景
- **磨砂毛玻璃效果** - 半透明界面，隐约透出背景
- **自定义主题配色** - 支持修改强调色、背景色、文字颜色
- **自动注入** - 一键启动，自动应用主题
- **无需修改源码** - 通过 CDP 协议注入，不破坏原文件
- **便携式设计** - 使用相对路径，可放在任意位置

## 系统要求

- Windows 10/11
- [Node.js](https://nodejs.org/) 16.0 或更高版本
- Codex 桌面版已安装（[下载地址](https://openai.com/codex/)）

## 快速开始

### 方法一：一键安装（推荐）

1. 下载本仓库到本地（点击 Code → Download ZIP）
2. 解压到任意目录，例如 `E:\codex\Codex-Skin-Plus`
3. 双击运行 `install.bat`
4. 按提示完成安装

### 方法二：Git 克隆

```bash
git clone https://github.com/tjj005617/codex-skin-plus.git
cd codex-skin-plus
.\install.bat
```

## 使用方法

### 启动带皮肤的 Codex

**方式一：使用快捷方式**（安装后自动生成）
- 双击 Codex 安装目录下的 `launch-codex.bat`

**方式二：直接运行**
```powershell
powershell -ExecutionPolicy Bypass -File "你的安装路径\launch-codex-dream.ps1"
```

**方式三：创建桌面快捷方式**
1. 右键 `launch-codex-dream.ps1` → 创建快捷方式
2. 右键快捷方式 → 属性 → 目标栏开头添加：
   ```
   powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File 
   ```
3. 可以修改图标为 Codex 的图标

### 首次使用步骤

1. **关闭所有 Codex 窗口**
2. **运行启动脚本**
3. **等待自动注入**（约 5-10 秒）
4. **看到效果** - 视频壁纸 + 毛玻璃界面

### 注意事项

- 每次启动 Codex 都需要使用启动脚本
- 如果直接打开 Codex，主题不会生效
- 更新 Codex 后需要重新运行安装脚本

## 主题配置

### 当前主题：蒙德城黄昏

- 风格：原神蒙德城黄昏风景
- 视频：`themes/mondstadt-dusk/mondstadt-dusk.mp4`
- 配色：金色主题（#E8B84B）

### 自定义主题

1. **准备视频文件**
   - 格式：MP4（H.264 编码）
   - 分辨率：推荐 1080p
   - 大小：建议 < 20MB（避免卡顿）
   - 时长：建议 10-30 秒（自动循环）

2. **创建主题目录**
   ```bash
   mkdir themes/my-theme
   ```

3. **复制视频文件**
   ```bash
   cp my-video.mp4 themes/my-theme/
   ```

4. **创建 theme.json**
   ```json
   {
     "id": "my-theme",
     "name": "My Custom Theme",
     "palette": {
       "ink": "#E8E0D0",
       "opaqueWindows": false,
       "accent": "#E8B84B",
       "diffRemoved": "#E8A0B0",
       "surface": "#0F1320",
       "uiFont": "Microsoft YaHei UI",
       "codeFont": "Cascadia Code",
       "diffAdded": "#7EC8A0",
       "contrast": 50,
       "skill": "#C0A0E8"
     },
     "art": {
       "focusY": 0.4,
       "safeArea": "center",
       "focusX": 0.5,
       "taskMode": "ambient"
     },
     "image": "my-video.mp4",
     "appearance": "dark"
   }
   ```

5. **修改启动脚本**
   - 打开 `launch-codex-dream.ps1`
   - 找到 `$ThemeDir` 变量
   - 改为你的主题路径

### 配色说明

| 参数 | 说明 | 示例 |
|------|------|------|
| `ink` | 文字颜色 | `#E8E0D0` (暖白) |
| `accent` | 强调色 | `#E8B84B` (金色) |
| `surface` | 界面背景 | `#0F1320` (深蓝黑) |
| `opaqueWindows` | 窗口是否不透明 | `false` (透明) |
| `contrast` | 对比度 (0-100) | `50` |

## 项目结构

```
codex-skin-plus/
├── install.bat                    # 一键安装脚本
├── launch-codex-dream.ps1         # 启动脚本
├── README.md                      # 本文档
├── LICENSE                        # MIT 许可证
├── .gitignore                     # Git 忽略规则
├── engine/                        # 核心引擎
│   ├── inject-video-theme.cjs     # CDP 注入器
│   └── dream-skin.css             # 主题样式表
└── themes/                        # 主题目录
    └── mondstadt-dusk/            # 蒙德城黄昏主题
        ├── theme.json             # 主题配置
        └── mondstadt-dusk.mp4     # 背景视频
```

## 工作原理

本项目使用 Chrome DevTools Protocol (CDP) 注入主题：

1. **启动 Codex** - 带 `--remote-debugging-port=30123` 参数
2. **连接 CDP** - 通过 WebSocket 连接到渲染进程
3. **注入 CSS** - 修改界面样式，添加毛玻璃效果
4. **注入视频** - 将视频设为背景，设置透明度

**优点：**
- 不修改 Codex 原始文件
- 更新 Codex 后仍可使用
- 随时可恢复原生界面

**局限：**
- 每次启动都需要注入
- 需要保持调试端口开启
- 视频文件过大会影响性能

## 常见问题

### Q: 启动后没有看到主题效果？

**检查清单：**
- [ ] 是否使用启动脚本而非直接打开 Codex
- [ ] Node.js 是否已安装（运行 `node --version`）
- [ ] Codex 安装路径是否正确
- [ ] 是否有其他程序占用端口 30123

**解决步骤：**
1. 关闭所有 Codex 窗口
2. 打开任务管理器，结束所有 `ChatGPT.exe` 进程
3. 重新运行启动脚本

### Q: 视频播放卡顿？

**优化建议：**
- 降低视频分辨率（720p）
- 压缩视频大小（< 10MB）
- 使用更短的视频（10-15秒）
- 降低视频帧率（24fps）

**推荐工具：**
- [HandBrake](https://handbrake.fr/) - 免费视频压缩
- [FFmpeg](https://ffmpeg.org/) - 命令行工具

### Q: 如何恢复原生界面？

**方法一：** 直接重启 Codex（不用启动脚本）

**方法二：** 运行清理命令
```powershell
# 在 Codex 中按 F12 打开控制台，执行：
document.querySelectorAll('[id*="codex-dream-skin"]').forEach(el => el.remove());
document.documentElement.classList.remove('codex-dream-skin');
```

### Q: 更新 Codex 后主题失效？

重新运行安装脚本即可，无需重新下载主题。

### Q: 端口 30123 被占用？

```powershell
# 查找占用端口的进程
netstat -ano | findstr :30123

# 结束进程（替换 PID）
taskkill /PID <进程ID> /F
```

### Q: 如何开机自启动？

1. 按 `Win + R`，输入 `shell:startup`
2. 将启动脚本的快捷方式放到打开的文件夹中
3. 右键快捷方式 → 属性 → 运行方式选择"最小化"

## 开发指南

### 修改 CSS 样式

1. 打开 `engine/dream-skin.css`
2. 使用浏览器开发者工具查看元素类名
3. 修改对应的 CSS 规则
4. 重新运行启动脚本测试

**常用选择器：**
- `html.codex-dream-skin` - 根选择器
- `aside.app-shell-left-panel` - 左侧边栏
- `main.main-surface` - 主内容区
- `.composer-surface-chrome` - 输入框区域

### 创建新主题

1. 复制现有主题目录
2. 替换视频文件
3. 修改 `theme.json` 配置
4. 测试效果
5. 提交到 GitHub 分享

### 调试注入问题

1. 打开 Codex
2. 按 `F12` 打开开发者工具
3. 在控制台执行：
   ```javascript
   // 检查注入状态
   console.log(document.getElementById('codex-dream-skin-video'));
   console.log(document.getElementById('codex-dream-skin-style'));
   console.log(document.documentElement.classList);
   ```

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/my-feature`
3. 提交更改：`git commit -m 'Add my feature'`
4. 推送分支：`git push origin feature/my-feature`
5. 提交 Pull Request

### 主题分享

如果你创建了好看的主题，欢迎提交到 `themes/` 目录！

要求：
- 包含 `theme.json` 配置文件
- 包含 MP4 视频文件
- 视频大小 < 20MB
- 提供预览截图（可选）

## 许可证

MIT License - 详见 [LICENSE](LICENSE)

## 致谢

- 原理参考：[Codex-Dream-Skin](https://github.com/Fei-Away/Codex-Dream-Skin) by Fei-Away
- 视频来源：原神蒙德城黄昏场景
- 感谢所有贡献者和用户

## 支持

- 提交 Issue：[GitHub Issues](https://github.com/tjj005617/codex-skin-plus/issues)
- 讨论交流：[GitHub Discussions](https://github.com/tjj005617/codex-skin-plus/discussions)

---

**如果这个项目对你有帮助，请给个 Star 支持一下！**

---

## 附录：给 AI 的提示词

如果你需要 AI 帮你安装或解决问题，可以使用以下提示词：

```
我想给 Codex 桌面版换皮肤，使用 Codex Skin Plus 项目。

项目地址：https://github.com/tjj005617/codex-skin-plus

我的系统环境：
- 操作系统：Windows 10/11
- Node.js 版本：[运行 node --version 查看]
- Codex 安装路径：[默认是 E:\codex\Codex 或 C:\Users\用户名\AppData\Local\Codex]

请帮我完成以下任务：

1. **检查环境**
   - 确认 Node.js 已安装
   - 确认 Codex 已安装
   - 确认端口 30123 未被占用

2. **下载项目**
   - 克隆仓库到本地
   - 或下载 ZIP 并解压

3. **运行安装**
   - 执行 install.bat
   - 创建启动快捷方式

4. **测试主题**
   - 使用启动脚本打开 Codex
   - 确认视频壁纸正常显示
   - 确认毛玻璃效果生效

5. **解决问题**（如果遇到问题）
   - 检查 Codex 是否正确启动调试端口
   - 检查 Node.js 是否在 PATH 中
   - 检查防火墙是否阻止连接
   - 查看错误日志并提供解决方案

6. **自定义配置**（可选）
   - 修改主题配色
   - 更换视频壁纸
   - 设置开机自启动

请提供详细的步骤说明，如果遇到错误请给出具体的解决命令。
```

**复制上面的提示词发给 AI，它会帮你完成安装和配置。**
