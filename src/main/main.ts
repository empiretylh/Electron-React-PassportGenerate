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
import { readFileSync, watch, readdir, PathOrFileDescriptor } from 'fs';
import {
  ChildProcessWithoutNullStreams,
  exec,
  execFile,
  spawn,
} from 'child_process';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { readFile, mkdir, access, constants } from 'fs/promises';
import firestore from '../firebase';
const Store = require('electron-store');
const { download } = require('electron-dl');
import WebSocket from 'ws';
import { send } from 'process';

let connection: WebSocket | null = null;

function connectToTheWebsocketServer() {
  connection = new WebSocket('ws://127.0.0.1:13254');
  console.log('WebSocket Connected');
}

const store = new Store();

function createDirectory(folderName) {
  return new Promise((resolve, reject) => {
    // Create the folder
    console.log(folderName);
    mkdir(folderName, { recursive: true })
      .then(() => {
        console.log('Folder created successfully:', folderName);
        resolve();
      })
      .catch((err) => {
        console.error('Error creating folder:', err);
        reject(err);
      });
  });
}

function checkFileExists(filePath: string) {
  let boolean;
  try {
    return access(filePath, constants.F_OK)
      .then((res) => {
        return true;
      })
      .catch((err) => {
        return false;
      });
  } catch (err) {
    console.log('The File Does not exist');
  }

  return boolean;
}

// Get the app or remote app object based on the execution context
const electronApp = app || remote.app;

// Get the user data directory
const documentsPath = electronApp.getPath('documents');

const HomePath = electronApp.getPath('home');

let pythonProcess: any;

let printProcess: ChildProcessWithoutNullStreams;

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

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
const os = process.platform;

function runServerFile() {
  return new Promise<void>((resolve, reject) => {
    let pythonProcess;
    if (!connection) {
      if (os === 'win32') {
        // Windows-specific code
        pythonProcess = spawn('./Depend/main_p.exe', [], {
          detached: true,
          stdio: 'ignore',
        });
      } else if (os === 'darwin') {
        // macOS-specific code
        pythonProcess = spawn('./Depend/main_p', [], {
          detached: true,
          stdio: 'ignore',
        });
      } else if (os === 'linux') {
        pythonProcess = spawn('./Depend/main_p', [], {
          detached: true,
          stdio: 'ignore',
        });
      } else {
        // Unknown operating system
        console.log('Running on an unknown operating system');
      }
    } else {
      resolve();
    }

    pythonProcess?.stdout?.on('data', (data: any) => {
      console.log(`Python server output: ${data}`);

      // Check if the server is ready
      if (data.includes('WebSocket server started')) {
        resolve();
      }
    });

    pythonProcess?.stderr?.on('data', (data: any) => {
      console.error(`Python server error: ${data}`);
      reject(new Error(data));
    });

    pythonProcess?.on('close', (code: any) => {
      console.log(`Python server process exited with code ${code}`);
      reject(new Error(`Python server process exited with code ${code}`));
    });
  });
}

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

  mainWindow.setMenuBarVisibility(false);

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

  const os = process.platform;

  if (os === 'win32') {
    printProcess = spawn('./Depend/print_paper.exe');
  } else if (os === 'darwin') {
    printProcess = spawn('./Depend/print_paper');
  } else if (os === 'linux') {
    printProcess = spawn('./Depend/print_paper');
  } else {
    // Unknown operating system
    console.log('Running on an unknown operating system');
  }

  try {
    await runServerFile();

    await new Promise((resolve) => setTimeout(resolve, 5000));

    connectToTheWebsocketServer();
  } catch (error) {
    console.error('Failed to run Python FIle', error);
  }

  connection.onopen = () => {
    console.log('WebSocket connection established');
  };
  connection.onmessage = (event: any) => {
    const message = event.data;
    console.log('Received message:', message);

    if (message.startsWith('IMG:')) {
      const path = message.substring(4);
      ListenImageFromPython(path);
    } else if (message.startsWith('PAPER:')) {
      const path = message.substring(6);
      ListenPaperFromPython(path);
    }
  };

  // Receive data from the executable
  printProcess.stdout.on('data', (data) => {
    const receivedData: string = data.toString().trim();

    console.log('Received data from Python:', receivedData);
  });

  // Handle executable process exit
  printProcess.on('exit', (code) => {
    console.log(`Executable process exited with code ${code}`);
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

function SendMessage(arg) {
  connection?.send('Images:' + arg[0]);
  connection?.send('Qty:' + arg[1]);
  connection?.send('ImgSize:' + arg[2]);
  connection?.send('PaperSize:' + arg[3]);
  connection?.send('Bw:' + arg[4]);
  connection?.send('BgColor:' + arg[5]);
  connection?.send('Mode:pasport');
  connection?.send('FMode:false');
  connection?.send('start_processing');
}


function GenerateBeauty(arg){
  connection?.send('Images:' + arg[0]);
  connection?.send('Qty:' + arg[1]);
  connection?.send('ImgSize:' + arg[2]);
  connection?.send('PaperSize:' + arg[3]);
  connection?.send('FMode:'+arg[4]);
  connection?.send('Mode:beauty');
  connection?.send('start_processing')
}



ipcMain.on('runExecutable', (event, { arg }) => {
  try {
    if (connection) {
      console.log('Connection Shi thi');
      SendMessage(arg);
    } else {
      connection = new WebSocket('ws://127.0.0.1:13254');
      connection.onopen = () => {
        console.log('WebSocket connection established');
        SendMessage(arg);
      };
    }

    if (connection) {
      connection.onmessage = (event: any) => {
        const message = event.data;
        console.log('Received message:', message);

        if (message.startsWith('IMG:')) {
          const path = message.substring(4);
          ListenImageFromPython(path);
        } else if (message.startsWith('PAPER:')) {
          const path = message.substring(6);
          ListenPaperFromPython(path);
        }
      };

      console.log('Finsished');
    }
  } catch (e) {
    console.log(e);
  }
});


ipcMain.on('generateBeauty', (event, { arg }) => {
  try {
    if (connection) {
      console.log('Connection Shi thi');
      GenerateBeauty(arg);
    } else {
      connection = new WebSocket('ws://127.0.0.1:13254');
      connection.onopen = () => {
        console.log('WebSocket connection established');
        GenerateBeauty(arg);
      };
    }

    if (connection) {
      connection.onmessage = (event: any) => {
        const message = event.data;
        console.log('Received message:', message);

        if (message.startsWith('BUTY:')) {
          const path = message.substring(5);
          ListenImageFromPython(path);
        } else if (message.startsWith('PAPER:')) {
          const path = message.substring(6);
          ListenPaperFromPython(path);
        }
      };

      console.log('Finsished');
    }
  } catch (e) {
    console.log(e);
  }
});



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
    folderWatchingandCreating();
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
  const qtys = []

  const fileData = result.filePaths.map((filePath) => {
    const data = readFileSync(filePath).toString('base64');
    const mimeType = `image/${filePath.split('.').pop()}`;
    qtys.push(1);
    return `data:${mimeType};base64,${data}`;
  });

  return { imgdata: fileData, uridata: result.filePaths,qtys:qtys };
});

ipcMain.handle('uritoimg', async (event, fileuri) => {
  const fileData = fileuri.map((filePath: PathOrFileDescriptor) => {
    const data = readFileSync(filePath).toString('base64');
    const mimeType = `image/${filePath.split('.').pop()}`;
    return `data:${mimeType};base64,${data}`;
  });

  return fileData;
});

function getPaperSize(value: string) {
  switch (value) {
    case '2480,3508':
      return 'A4';
    case '1200,1800':
      return '4x6';
    case '1748,2480':
      return 'A5';
    case '2550,3300':
      return 'Legal';
    default:
      return 'Unknown';
  }
}
ipcMain.on('print-paper', (event, args) => {
  console.log(args['image']);
  console.log(getPaperSize(args['papersize']));
  printProcess.stdin.write(args['image'] + '\n');
  printProcess.stdin.write(getPaperSize(args['papersize']) + '\n');
});

function openLocationInExplorer(url: string) {
  let eurl = url;
  if (os === 'win32') {
    eurl = url.replace(/\//g, '\\');
  }
  shell.showItemInFolder(eurl);
}

ipcMain.on('openLocation', (event, url) => {
  openLocationInExplorer(url);
});

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

// Watch the folder for changes
const folderPath = documentsPath + '/Pascal/img/'; // Provide your folder path here

const CreateFolders = async () => {
  await createDirectory(documentsPath + '/Pascal/img');
  await createDirectory(documentsPath + '/Pascal/paper');
  await createDirectory(HomePath + '/.u2net');
};

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

      mainWindow?.webContents.send('imageUpdated', { file, fileData });
    });
  });

  console.log(result, 'result........');

  return result;
});

async function folderWatchingandCreating() {
  let oldfilename;

  let timeout: string | number | NodeJS.Timeout | undefined;

  const timeoutDuration = 1500;

  try {
    await CreateFolders();

    // watch(folderPath, (eventType, filename) => {
    //   console.log(eventType, filename, 'File Name');
    //   if (eventType === 'change') {
    //     if (filename) {
    //       oldfilename = filename;

    //       clearTimeout(timeout);

    //       timeout = setTimeout(() => {
    //         const file = folderPath + filename;
    //         const mimeType = `image/${file.split('.').pop()}`;
    //         readFile(file)
    //           .then((data) => {
    //             const fileData = `data:${mimeType};base64,${data.toString(
    //               'base64'
    //             )}`;
    //             mainWindow?.webContents.send('imageUpdated', { file, fileData });
    //           })
    //           .catch((error) => {
    //             // Handle error
    //           });
    //       }, timeoutDuration);
    //     }
    //   }
    // });
  } catch (e) {
    console.log('errors', e);
  }
}

ipcMain.handle('register_id', (event) => {
  let key = store.get('my_key_id');
  return key;
});

ipcMain.handle('delete_register_id', (event) => {
  let key = store.delete('my_key_id');
});

ipcMain.handle('create_acc', (event, phoneno) => {
  const collectionRef = firestore.collection('Pascal_Database');
  const documentRef = collectionRef.doc();

  return documentRef
    .set({
      phoneno: phoneno,
      avaliable: false,
    })
    .then((res) => {
      console.log('Created Sucess', res);
      // Get the document ID
      const documentId = documentRef.id;
      console.log('Document created with ID:', documentId);

      store.set('my_key_id', documentRef.id);
      return documentRef.id;
    })
    .catch((err) => {
      console.log('Errors', err);
    });
});

ipcMain.handle('last_avaliable', (event) => {
  let lastavaliable = store.get('last_avaliable');
  if (lastavaliable) {
    return lastavaliable;
  } else {
    return false;
  }
  return lastavaliable;
});

ipcMain.on('key_listen', (event) => {
  const collectionRef = firestore.collection('Pascal_Database');

  let my_key_id = store.get('my_key_id');

  if (my_key_id) {
    console.log('Key ID has');

    const documentRef = collectionRef.doc(my_key_id);

    documentRef.onSnapshot((snapshot) => {
      console.log(snapshot.data(), 'Change.......');
      // event.reply('key_listen',snapshot.data())
      snapshot.data() &&
        store.set('last_avaliable', snapshot.data()?.avaliable);

      snapshot.data() &&
        mainWindow?.webContents.send('key_listen', snapshot.data());
    });
  } else {
    console.log('No Key ID');
  }
});

ipcMain.on('download-file', (event, fileUrl) => {
  const options = {
    directory: path.join(app.getPath('home'), '.u2net'), // User's directory
    onProgress: (progress: any) => {
      console.log(progress);
      mainWindow?.webContents.send('download-progress', progress);
    },
  };

  download(mainWindow, fileUrl, options)
    .then((dl: any) => {
      mainWindow?.webContents.send('download-complete', true);
    })
    .catch((error: any) => {
      // Handle download error
      console.error('Download error:', error);
    });
});

//Check ML Models Exists or not.

ipcMain.handle('checkmodels', async (event) => {
  const isfile =
    checkFileExists(HomePath + '/.u2net/silueta.onnx') &&
    checkFileExists(HomePath + '/.u2net/u2net.onnx');
  return isfile;
});

function ListenImageFromPython(path: string) {
  const file = path;
  const mimeType = `image/${file.split('.').pop()}`;
  readFile(file)
    .then((data) => {
      const fileData = `data:${mimeType};base64,${data.toString('base64')}`;
      mainWindow?.webContents.send('imageUpdated', { file, fileData });
    })
    .catch((error) => {
      // Handle error
    });
}

function ListenPaperFromPython(path: string) {
  const file = path;

  mainWindow?.webContents.send('paperUpdated', file);
}
