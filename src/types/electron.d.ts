interface Window {
  isElectron?: boolean;
  electronAPI?: {
    copyToClipboard: (text: string) => boolean;
    getAppVersion: () => string | undefined;
    getPlatform: () => NodeJS.Platform;
  };
}
