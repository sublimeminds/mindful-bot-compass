
// Electron API type definitions
export interface ElectronAPI {
  getVersion: () => Promise<string>;
  getPlatform: () => Promise<string>;
  openExternal: (url: string) => Promise<void>;
  showNotification: (title: string, body: string) => Promise<void>;
  selectFile: () => Promise<string>;
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  close: () => Promise<void>;
  isElectron: boolean;
  log: (message: string) => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
