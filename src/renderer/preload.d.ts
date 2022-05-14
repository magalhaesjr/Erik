declare global {
  interface Window {
    electron: {
      importFile(): void;
      showContents(): void;
    };
  }
}

export {};
