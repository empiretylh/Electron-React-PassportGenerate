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
import { app, BrowserWindow, shell, ipcMain, dialog, remote } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { readFileSync, watch, readdir } from 'fs';
import { exec, execFile, spawn } from 'child_process';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { readFile, mkdir } from 'fs/promises';
import { webContents } from 'electron/main';

function CreateDirectory(folderName: string) {
  // Create the folder
  mkdir(folderName, { recursive: true }, (err) => {
    if (err) {
      console.error('Error creating folder:', err);
      return;
    }

    console.log('Folder created successfully:', folderPath);
  });
}

// Get the app or remote app object based on the execution context
const electronApp = app || remote.app;

// Get the user data directory
const documentsPath = electronApp.getPath('documents');

// // Construct the path to the Documents folder based on the operating system
// let documentsPath;
// switch (process.platform) {
//   case 'win32':
//     documentsPath = path.join(userDataPath, 'Documents');
//     break;
//   case 'darwin':
//     documentsPath = path.join(userDataPath, 'Documents');
//     break;
//   case 'linux':
//     documentsPath = path.join(userDataPath, 'Documents');
//     break;
//   default:
//     console.error('Unsupported operating system');
// }

console.log('Documents folder path:', documentsPath);

class AppUpdater {
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

ipcMain.on('runExecutable', (event, { arg }) => {
  let executablePath = 'Depend/Gimg';

  
switch (process.platform) {
  case 'win32':
    executablePath = 'Depend/Gimg.exe';
    break;
  case 'darwin':
    executablePath = 'Depend/Gimg';
    break;
  case 'linux':
     executablePath = 'Depend/Gimg';
    break;
  default:
    console.error('Unsupported operating system');
}


  console.log('Executing.....');

  execFile(executablePath, arg, (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error}`);
      return;
    } else {
      console.log(stdout);
      event.reply('runExecutable', stdout);
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    console.log(`stdout:\n${stdout}`);
  });

  console.log('Finsished');
});

// Watch the folder for changes
const folderPath = documentsPath + '/Pascal/img/'; // Provide your folder path here

ipcMain.handle('imageUpdated', async () => {
  // Initial scan of the folder to get the list of files
  let result;

  readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading folder:', err);
      return;
    }
    files.map((filename) => {
      const file = folderPath + filename;
      const data = readFileSync(file).toString('base64');
      const mimeType = `image/${file.split('.').pop()}`;
      const fileData = `data:${mimeType};base64,${data}`;

      mainWindow.webContents.send('imageUpdated', fileData);
    });
  });

  console.log(result, 'result........');

  return result;
});

let oldfilename;

let timeout;

const timeoutDuration = 1500;

try {
  watch(folderPath, (eventType, filename) => {
    console.log(eventType, filename, 'File Name');
    if (eventType === 'change') {
      if (filename) {
        oldfilename = filename;

        clearTimeout(timeout);

        timeout = setTimeout(() => {
          const file = folderPath + filename;
          const mimeType = `image/${file.split('.').pop()}`;
          readFile(file)
            .then((data) => {
              const fileData = `data:${mimeType};base64,${data.toString(
                'base64'
              )}`;
              mainWindow.webContents.send('imageUpdated', fileData);
            })
            .catch((error) => {
              // Handle error
            });
        }, timeoutDuration);
      }
    }
  });
} catch (e) {
  CreateDirectory(documentsPath + '/Pascal/img');
  CreateDirectory(documentsPath + '/Pascal/paper');

  watch(folderPath, (eventType, filename) => {
    console.log(eventType, filename, 'File Name');
    if (eventType === 'change') {
      if (filename) {
        oldfilename = filename;

        clearTimeout(timeout);

        timeout = setTimeout(() => {
          const file = folderPath + filename;
          const mimeType = `image/${file.split('.').pop()}`;
          readFile(file)
            .then((data) => {
              const fileData = `data:${mimeType};base64,${data.toString(
                'base64'
              )}`;
              mainWindow.webContents.send('imageUpdated', fileData);
            })
            .catch((error) => {
              // Handle error
            });
        }, timeoutDuration);
      }
    }
  });
}

const paperFolderPath = documentsPath + '/Pascal/paper/';
let paper_oldfilename;

watch(paperFolderPath, (eventType, filename) => {
  console.log(eventType, filename, 'File Name');
  if (eventType === 'change') {
    if (paper_oldfilename != filename) {
      mainWindow.webContents.send('paperUpdated', paperFolderPath + filename);
      paper_oldfilename = filename;
    }
  }
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
  new AppUpdater();
};

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

ipcMain.handle('open-files-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }],
  });

  const fileData = result.filePaths.map((filePath) => {
    const data = readFileSync(filePath).toString('base64');
    const mimeType = `image/${filePath.split('.').pop()}`;
    return `data:${mimeType};base64,${data}`;
  });

  return { imgdata: fileData, uridata: result.filePaths };
});

ipcMain.handle('uritoimg', async (event, fileuri) => {
  const fileData = fileuri.map((filePath) => {
    const data = readFileSync(filePath).toString('base64');
    const mimeType = `image/${filePath.split('.').pop()}`;
    return `data:${mimeType};base64,${data}`;
  });

  return fileData;
});

ipcMain.handle('print-paper', (event, img) => {
  mainWindow?.webContents.print({
    slient: true,
    image: img,
  })
  console.log('Printing paper')
 
});
