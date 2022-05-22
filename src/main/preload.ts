import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  importFile: () => {
    ipcRenderer.invoke('tournament:importFile');
  },
  showContents: () => {
    ipcRenderer.invoke('tournament:showContents');
  },
});
