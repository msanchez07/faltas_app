const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dbApi', {
    // --- CICLOS ---
    getCycles: () => ipcRenderer.invoke('get-cycles'),
    
    // Recibe { id, name }
    saveCycle: (cycleData) => ipcRenderer.invoke('save-cycle', cycleData),
    
    deleteCycle: (id) => ipcRenderer.invoke('delete-cycle', id),

    // --- MÓDULOS ---
    getModules: (cycleId) => ipcRenderer.invoke('get-modules', cycleId),
    
    // Recibe { id, cycle_id, name, report_code, hours }
    saveModule: (moduleData) => ipcRenderer.invoke('save-module', moduleData),
    
    deleteModule: (id) => ipcRenderer.invoke('delete-module', id),

    // --- IMPORTACIÓN / VISTA JERÁRQUICA ---
    // Obtiene la unión de ciclos y módulos para el TreeTable
    getHierarchy: () => ipcRenderer.invoke('get-hierarchy'),
    
    importCyclesJson: (treeData) => ipcRenderer.invoke('import-cycles-json', treeData),
    getSettings: () => ipcRenderer.invoke('get-settings'),
    saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
});