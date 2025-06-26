
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getVersion: () => ipcRenderer.invoke('app-version'),
  getPlatform: () => ipcRenderer.invoke('platform'),
  
  // Add more secure APIs as needed
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  
  // Notification API
  showNotification: (title, body) => ipcRenderer.invoke('show-notification', { title, body }),
  
  // File system operations (if needed)
  selectFile: () => ipcRenderer.invoke('select-file'),
  
  // App control
  minimize: () => ipcRenderer.invoke('minimize-window'),
  maximize: () => ipcRenderer.invoke('maximize-window'),
  close: () => ipcRenderer.invoke('close-window'),

  // Debug helpers
  isElectron: true,
  log: (message) => console.log('[Electron]', message),
});

// Add global error handler for debugging
window.addEventListener('error', (event) => {
  console.error('[Electron Renderer Error]:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Electron Unhandled Rejection]:', event.reason);
});

// Security: Remove access to Node.js APIs in renderer
delete window.require;
delete window.exports;
delete window.module;

// Log that preload script loaded successfully
console.log('[Electron] Preload script loaded successfully');
