# Codex Dream Skin

给 Codex 桌面版换上动态视频壁纸主题，支持磨砂毛玻璃效果和二次元风格。

![Preview](preview.gif)

## 功能特性

- **动态视频壁纸** - 支持 MP4 视频作为背景
- **磨砂毛玻璃效果** - 半透明界面，隐约透出背景
- **金色主题配色** - 蒙德城夜景风格，温暖柔和
- **自动注入** - 一键启动，自动应用主题
- **无需修改源码** - 通过 CDP 协议注入，不破坏原文件

## 系统要求

- Windows 10/11
- [Node.js](https://nodejs.org/) 16.0 或更高版本
- Codex 桌面版已安装

## 快速安装

### 方法一：一键安装（推荐）

1. 下载本仓库到本地
2. 双击运行 `install.bat`
3. 按提示完成安装

### 方法二：手动安装

1. 下载本仓库到本地，例如放到 `E:\codex\Codex-Dream-Skin`
2. 确保 Node.js 已安装（在命令行输入 `node --version` 检查）
3. 运行以下命令：
   ```powershell
   powershell -ExecutionPolicy Bypass -File "E:\codex\Codex-Dream-Skin\launch-codex-dream.ps1"
   ```

## 使用方法

### 启动带皮肤的 Codex

**方式一：双击启动**

- 双击 `E:\codex\Codex-Dream-Skin\install.bat` 创建好 `launch-codex.bat`（在 Codex 安装目录下）

**方式二：直接运行**

```powershell
powershell -ExecutionPolicy Bypass -File "E:\codex\Codex-Dream-Skin\launch-codex-dream.ps1"
```

### 首次使用

1. 关闭正在运行的 Codex
2. 运行上述启动命令
3. Codex 会自动开启调试端口（30123）
4. 主题会自动注入，等待几秒即可看到效果

### 切换主题

编辑 `themes/mondstadt-dusk/theme.json` 可自定义：

- `accent` - 主题强调色（金色 #E8B84B）
- `surface` - 界面背景色
- `ink` - 文字颜色
- `image` - 背景视频文件路径

## 项目结构

```
Codex-Dream-Skin/
├── install.bat                    # 一键安装脚本
├── launch-codex-dream.ps1        # 主启动脚本
├── engine/
│   ├── inject-video-theme.cjs    # CDP 注入器
│   └── dream-skin.css            # 主题样式表
├── themes/
│   └── mondstadt-dusk/          # 蒙德城夜景主题
│       ├── theme.json            # 主题配置
│       └── mondstadt-dusk.mp4   # 背景视频
└── README.md
```

## 自定义视频壁纸

1. 准备一个 MP4 视频文件（建议 1080p，5MB 以内）
2. 复制到 `themes/mondstadt-dusk/` 目录
3. 修改 `theme.json` 中的 `image` 字段为你的文件名
4. 重新运行启动脚本

## 工作原理

本项目使用 Chrome DevTools Protocol (CDP) 注入主题：

1. 启动 Codex 时开启远程调试端口（30123）
2. 通过 WebSocket 连接到 Codex 的渲染进程
3. 注入 CSS 样式表和视频背景
4. 设置毛玻璃效果和透明背景

**优点：**

- 不修改 Codex 原始文件
- 更新 Codex 后仍可使用
- 随时可恢复原生界面

**注意事项：**

- 每次重启 Codex 都需要重新注入
- 建议使用启动脚本而非直接打开 Codex

## 常见问题

### Q: 启动后没有看到主题效果？

A: 确保：

- 已关闭所有 Codex 窗口
- 使用启动脚本而非直接打开 Codex
- Node.js 已正确安装

### Q: 视频播放卡顿？

A: 尝试：

- 使用更小的视频文件（< 10MB）
- 降低视频分辨率（720p）
- 使用更短的视频循环

### Q: 如何恢复原生界面？

A: 直接重启 Codex（不用启动脚本）即可恢复。

### Q: 更新 Codex 后主题失效？

A: 重新运行启动脚本即可，无需重新安装。

## 自定义开发

### 修改 CSS 样式

编辑 `engine/dream-skin.css`，使用浏览器开发者工具查看元素类名：

- `html.codex-dream-skin` - 根选择器
- `aside.app-shell-left-panel` - 左侧边栏
- `main.main-surface` - 主内容区
- `.composer-surface-chrome` - 输入框区域

### 创建新主题

1. 复制 `themes/mondstadt-dusk/` 目录
2. 替换视频文件
3. 修改 `theme.json` 配置
4. 更新启动脚本中的主题路径

## 许可证

MIT License

## 致谢

- 原理参考：[Codex-Dream-Skin](https://github.com/Fei-Away/Codex-Dream-Skin)
- 视频来源：原神蒙德城夜景

---

**提示：** 如果你遇到问题，可以复制下面的提示词给 AI，让它帮你解决：

```
我想给 Codex 桌面版换皮肤，使用 Codex Dream Skin 项目。
项目地址：https://github.com/tjj005617/codex-skin-plus

请帮我：
1. 检查 Node.js 是否已安装
2. 克隆仓库到 E:\codex\Codex-Dream-Skin
3. 运行安装脚本
4. 启动带主题的 Codex

如果遇到问题，请检查：
- Codex 安装路径是否正确
- 调试端口 30123 是否被占用
- 视频文件是否完整
```
