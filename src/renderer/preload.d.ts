declare global {
  interface Window {
    electron: {
      importFile(): unknown;
      showContents(): void;
    };
  }
}

export {};
