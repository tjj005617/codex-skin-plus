const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  getThemes: () => ipcRenderer.invoke("get-themes"),
  getConfig: () => ipcRenderer.invoke("get-config"),
  saveConfig: (config) => ipcRenderer.invoke("save-config", config),
  applyTheme: (themeId) => ipcRenderer.invoke("apply-theme", themeId),
  createTheme: (data) => ipcRenderer.invoke("create-theme", data),
  updateThemePalette: (data) =>
    ipcRenderer.invoke("update-theme-palette", data),
  restoreOriginal: () => ipcRenderer.invoke("restore-original"),
  selectFile: (type) => ipcRenderer.invoke("select-file", type),
  openFolder: (folder) => ipcRenderer.invoke("open-folder", folder),
  minimize: () => ipcRenderer.invoke("minimize-window"),
  maximize: () => ipcRenderer.invoke("maximize-window"),
  close: () => ipcRenderer.invoke("close-window"),
});
