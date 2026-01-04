const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dbApi', {
  // Función para pedir usuarios
  getCycles: () => ipcRenderer.invoke('get-cycles'),

  getModules: (cycleId) => ipcRenderer.invoke('get-modules', cycleId),
  
  importCyclesJson: (treeData) => ipcRenderer.invoke('import-cycles-json', treeData),

});