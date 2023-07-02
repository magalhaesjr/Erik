/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { JSDOM } from 'jsdom';
import cloneDeep from 'lodash/cloneDeep';
import Tournament from 'domain/tournament';
import extractEntries from '../domain/avpamerica';
import newExtractEntries from '../domain/entry-import';
import MenuBuilder from './menu';
import { readFile, writeFile } from './fileIO';
import { resolveHtmlPath } from './util';
import { TournamentFinancials } from '../renderer/redux/financials';
import type { Notification } from '../renderer/redux/notifications';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  //new AppUpdater();
};

/** Notifications */

/**
 * Publishes a notification to the renderer (displayed as a snackbar)
 *
 * @param notification is the notification to publish
 */
export const publishNotification = (notification: Notification) => {
  if (mainWindow) {
    mainWindow.webContents.send('tournament:publishNotification', notification);
  }
};

/** Tournament I/O */
ipcMain.handle('tournament:importSheet', () => {
  let htmlString = readFile({
    filters: [
      {
        name: 'Sheet',
        extensions: ['xls', 'xlsx', 'csv'],
      },
    ],
  });

  if (!htmlString) {
    // Failed to read
    publishNotification({
      status: 'error',
      message: 'Failed importing entries sheet',
    });

    return null;
  }

  // Add to string
  htmlString = `<div id="container"'>${htmlString}</div>`;
  const dom = new JSDOM(htmlString);

  try {
    const tourney = extractEntries(dom.window.document);
    const test = newExtractEntries(dom.window.document);
    console.log(test);

    publishNotification({
      status: 'success',
      message: 'Imported entries from sheet',
    });

    // Return extracted entries
    return cloneDeep(tourney);
  } catch {
    // Something failed
    publishNotification({
      status: 'error',
      message: 'Failed to extract entries',
    });

    return null;
  }
});

ipcMain.handle('tournament:importTournament', () => {
  const tournament = readFile({
    filters: [{ name: 'Tournament', extensions: ['json'] }],
  });

  // Notify user of success/failure
  if (!tournament) {
    // Failed to read
    publishNotification({
      status: 'error',
      message: 'Failed importing financial parameters',
    });

    return null;
  }

  publishNotification({
    status: 'success',
    message: 'Imported tournament',
  });

  return JSON.parse(tournament);
});

ipcMain.handle('tournament:exportTournament', (_, tourney: Tournament) => {
  const result = writeFile({
    outString: JSON.stringify(tourney, null, 2),
    filters: [{ name: 'Financials', extensions: ['json'] }],
  });

  // Notify user of operation result
  publishNotification(result);
});

/** Financials */
ipcMain.handle('tournament:importFinancials', () => {
  const financials = readFile({
    filters: [{ name: 'Financials', extensions: ['json'] }],
  });

  // Notify user of success/failure
  if (financials) {
    publishNotification({
      status: 'success',
      message: 'Imported financial parameters',
    });

    return JSON.parse(financials);
  }

  // Failed to read
  publishNotification({
    status: 'error',
    message: 'Failed importing financial parameters',
  });

  return null;
});

ipcMain.handle(
  'tournament:exportFinancials',
  (_, financials: TournamentFinancials) => {
    const result = writeFile({
      outString: JSON.stringify(financials, null, 2),
      filters: [{ name: 'Financials', extensions: ['json'] }],
    });

    // Notify user of operation result
    publishNotification(result);
  }
);

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
