import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  importFile: () => {
    return ipcRenderer.invoke('tournament:importFile');
  },
  showContents: () => {
    ipcRenderer.invoke('tournament:showContents');
  },
});
