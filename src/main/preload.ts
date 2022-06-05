import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  importFile: () => {
    return ipcRenderer.invoke('tournament:importFile');
  },
  loadTournament: () => {
    return ipcRenderer.invoke('tournament:loadTournament');
  },
  requestSave(func: (...args: unknown[]) => void) {
    ipcRenderer.on('tournament:requestSave', (_event, ...args) =>
      func(...args)
    );
  },
  requestLoad(func: (...args: unknown[]) => void) {
    ipcRenderer.on('tournament:requestLoad', (_event, ...args) =>
      func(...args)
    );
  },
  saveTournament: (tourney: unknown) => {
    ipcRenderer.invoke('tournament:saveTournament', tourney);
  },
});
