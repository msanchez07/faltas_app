const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dbApi', {
  // Función para pedir usuarios
  getCycles: () => ipcRenderer.invoke('get-cycles'),

  getModules: (cicle_year_id) => ipcRenderer.invoke('get-modules', { cicle_year_id}),
  
  // Función para guardar usuario
  //addUsuario: (nombre, email) => ipcRenderer.invoke('add-usuario', { nombre, email })
});