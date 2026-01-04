const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const indexPath = path.join(__dirname, 'dist/faltas-app/browser/index.html');
  console.log('Cargando archivo:', indexPath);

  win.loadFile(indexPath).catch(err => {
    console.error('ERROR cargando Angular:', err);
  });

  win.webContents.openDevTools();
}

app.whenReady().then( () => {
  const dbPath = path.join(__dirname, 'database', 'database.db');
  db = new Database(dbPath);
  Menu.setApplicationMenu(null);
  createWindow();
});


ipcMain.handle('get-cycles', () => {
  const sql = `
      SELECT 
          id AS code,
          name AS name
      FROM 
          cycle
      ORDER BY 
          name ASC;`
  ;

  const stmt = db.prepare(sql);
  return stmt.all(); 
});

ipcMain.handle('get-modules', (event, cycleId) => {
  const sql = `SELECT * FROM modules WHERE cycle_id = ?`;
  const stmt = db.prepare(sql);
  return stmt.all(cycleId); 
});

ipcMain.handle('import-cycles-json', (event, treeData) => {
  // Definimos la transacción
  const insertMany = db.transaction((data) => {
    // 1. Limpiamos tablas para evitar duplicados o inconsistencias (Opcional)
    db.prepare('DELETE FROM modules').run();
    db.prepare('DELETE FROM cycle').run();

    const insertCycle = db.prepare('INSERT INTO cycle (name) VALUES (?)');
    const insertModule = db.prepare('INSERT INTO modules (name, hours, report_code, cycle_id) VALUES (?, ?, ?, ?)');

    for (const cycleNode of data) {
      // Insertar el ciclo y obtener el ID generado automáticamente
      const cycleInfo = insertCycle.run(cycleNode.data.name);
      const newCycleId = cycleInfo.lastInsertRowid;

      // Si el ciclo tiene módulos (children)
      if (cycleNode.children && cycleNode.children.length > 0) {
        for (const moduleNode of cycleNode.children) {
          const m = moduleNode.data;
          insertModule.run(
            m.name,
            m.hours || 0,
            m.report_code || null,
            newCycleId
          );
        }
      }
    }
  });

  try {
    insertMany(treeData);
    return { success: true };
  } catch (error) {
    console.error('Error en la importación:', error);
    return { success: false, error: error.message };
  }
});

/*
SELECT 
    c.id AS cycle_id, 
    c.name AS cycle_name,
    m.id AS module_id, 
    m.name AS module_name, 
    m.report_code,
    m.hours
FROM cycle c
JOIN modules m ON c.id = m.cycle_id
ORDER BY c.name, m.name;

*/

/*// Escuchar petición para AGREGAR usuario
ipcMain.handle('add-usuario', (event, datos) => {
  const stmt = db.prepare('INSERT INTO usuarios (nombre, email) VALUES (?, ?)');
  const info = stmt.run(datos.nombre, datos.email);
  return info.lastInsertRowid; // Retorna el ID del nuevo usuario
});*/