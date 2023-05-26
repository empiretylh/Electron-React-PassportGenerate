// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
<<<<<<< HEAD
  
  return      ipcRenderer.on(channel, subscription);
=======

      return ipcRenderer.on(channel, subscription);
>>>>>>> 2a065f488538723148ea359cfde63625c03aab06

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    invoke(channel: Channels, args: unknown[]) {
<<<<<<< HEAD
     return ipcRenderer.invoke(channel, args);
    },
    removeListener(channel:Channels){
      return ipcRenderer.removeAllListeners(channel)
    }
  },
  ipcRenderer2: ipcRenderer
=======
      return ipcRenderer.invoke(channel, args);
    },
    removeListener(channel: Channels) {
      return ipcRenderer.removeAllListeners(channel);
    },
  },
  ipcRenderer2: ipcRenderer,
>>>>>>> 2a065f488538723148ea359cfde63625c03aab06
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
