import { contextBridge, ipcRenderer } from 'electron';
import validator from 'validator';

contextBridge.exposeInMainWorld('api', {
  send: (channel, message) => ipcRenderer.send(channel, message),
  on: (channel, callback) => ipcRenderer.on(channel, (...args) => callback(...args)),
  validator: validator
});