
const { contextBridge, ipcRenderer } = require('electron');

// Enhanced error handling for preload
try {
  // Expose protected methods that allow the renderer process to use
  // the ipcRenderer without exposing the entire object
  contextBridge.exposeInMainWorld('electronAPI', {
    getVersion: () => ipcRenderer.invoke('app-version'),
    getPlatform: () => ipcRenderer.invoke('platform'),
    
    // External URL handling
    openExternal: (url) => ipcRenderer.invoke('open-external', url),
    
    // Notification API
    showNotification: (title, body) => ipcRenderer.invoke('show-notification', { title, body }),
    
    // File system operations
    selectFile: () => ipcRenderer.invoke('select-file'),
    
    // App control
    minimize: () => ipcRenderer.invoke('minimize-window'),
    maximize: () => ipcRenderer.invoke('maximize-window'),
    close: () => ipcRenderer.invoke('close-window'),

    // Debug helpers
    isElectron: true,
    log: (message) => console.log('[Electron]', message),
    
    // Environment info
    isDev: process.env.NODE_ENV === 'development',
  });

  console.log('[Electron] Preload script loaded successfully');

} catch (error) {
  console.error('[Electron] Error in preload script:', error);
}

// Enhanced global error handlers
window.addEventListener('error', (event) => {
  console.error('[Electron Renderer Error]:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Electron Unhandled Rejection]:', {
    reason: event.reason,
    promise: event.promise
  });
  
  // Prevent the default behavior (logging to console)
  event.preventDefault();
});

// Security: Remove access to Node.js APIs in renderer
delete window.require;
delete window.exports;
delete window.module;

// Add CSP meta tag for security
document.addEventListener('DOMContentLoaded', () => {
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src 'self' https: wss:; img-src 'self' data: https:;";
  document.head.appendChild(meta);
});
