// eslint-disable-next-line import/no-extraneous-dependencies
import { contextBridge } from 'electron';
import ipcAPI from './ipc-api';

contextBridge.exposeInMainWorld('ipcAPI', ipcAPI);
