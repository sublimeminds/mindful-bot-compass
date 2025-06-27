const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require('path');

// Environment detection
const isDev = process.env.NODE_ENV === 'development' || process.env.ELECTRON_IS_DEV === 'true' || process.argv.includes('--dev');

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true, // Re-enabled for security
      allowRunningInsecureContent: false,
    },
    icon: path.join(__dirname, 'icons', 'icon.png'),
    show: false,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default'
  });

  // Load the app with proper URL handling
  let startUrl;
  if (isDev) {
    startUrl = 'http://localhost:5173';
  } else {
    // Use file protocol for production builds
    startUrl = `file://${path.join(__dirname, '../dist/index.html')}`;
  }
  
  console.log('Electron: Loading URL:', startUrl);
  console.log('Electron: isDev:', isDev);
  console.log('Electron: __dirname:', __dirname);

  // Enhanced error handling for loading
  mainWindow.loadURL(startUrl).catch(error => {
    console.error('Electron: Failed to load URL:', error);
    
    // Fallback for production builds
    if (!isDev) {
      const fallbackPath = path.join(__dirname, '../dist/index.html');
      console.log('Electron: Trying fallback path:', fallbackPath);
      mainWindow.loadFile(fallbackPath).catch(fallbackError => {
        console.error('Electron: Fallback also failed:', fallbackError);
      });
    }
  });

  // Enhanced error handling for the renderer process
  mainWindow.webContents.on('crashed', (event, killed) => {
    console.error('Electron: Renderer process crashed:', { killed });
  });

  mainWindow.webContents.on('unresponsive', () => {
    console.error('Electron: Renderer process became unresponsive');
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Electron: Failed to load:', { errorCode, errorDescription, validatedURL });
  });

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    console.log('Electron: Window ready to show');
    mainWindow.show();
    
    // Only open DevTools in development
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links securely
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Security: Prevent new window creation
  mainWindow.webContents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });

  // Enhanced console logging
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`Electron Renderer Console [${level}]:`, message);
    if (line && sourceId) {
      console.log(`  at ${sourceId}:${line}`);
    }
  });
}

// App event handlers
app.whenReady().then(() => {
  console.log('Electron: App ready, creating window');
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  createMenu();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Enhanced security: Navigation control
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    // Allow localhost in development and file protocol in production
    const allowedOrigins = ['http://localhost:5173', 'http://localhost:8080'];
    const isFileProtocol = navigationUrl.startsWith('file://');
    const isAllowedOrigin = allowedOrigins.includes(parsedUrl.origin);
    
    if (!isFileProtocol && !isAllowedOrigin && !isDev) {
      console.log('Electron: Preventing navigation to:', navigationUrl);
      event.preventDefault();
    }
  });
});

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', role: 'undo' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { label: 'Force Reload', accelerator: 'CmdOrCtrl+Shift+R', role: 'forceReload' },
        { label: 'Toggle Developer Tools', accelerator: 'F12', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Actual Size', accelerator: 'CmdOrCtrl+0', role: 'resetZoom' },
        { label: 'Zoom In', accelerator: 'CmdOrCtrl+Plus', role: 'zoomIn' },
        { label: 'Zoom Out', accelerator: 'CmdOrCtrl+-', role: 'zoomOut' },
        { type: 'separator' },
        { label: 'Toggle Fullscreen', accelerator: 'F11', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize' },
        { label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close' }
      ]
    }
  ];

  // macOS specific menu adjustments
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { label: 'About ' + app.getName(), role: 'about' },
        { type: 'separator' },
        { label: 'Services', role: 'services', submenu: [] },
        { type: 'separator' },
        { label: 'Hide ' + app.getName(), accelerator: 'Command+H', role: 'hide' },
        { label: 'Hide Others', accelerator: 'Command+Shift+H', role: 'hideothers' },
        { label: 'Show All', role: 'unhide' },
        { type: 'separator' },
        { label: 'Quit', accelerator: 'Command+Q', click: () => app.quit() }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// Enhanced IPC handlers
ipcMain.handle('app-version', () => {
  return app.getVersion();
});

ipcMain.handle('platform', () => {
  return process.platform;
});

ipcMain.handle('open-external', async (event, url) => {
  return shell.openExternal(url);
});

ipcMain.handle('show-notification', async (event, { title, body }) => {
  // Implementation for notifications if needed
  console.log('Notification:', title, body);
});

ipcMain.handle('minimize-window', async () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.handle('maximize-window', async () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.handle('close-window', async () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Electron: Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('Electron: Unhandled Promise Rejection:', reason);
});
