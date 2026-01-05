const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs'); // Añadido fs que faltaba
const Database = require('better-sqlite3');

// DESACTIVAR EL SANDBOX PARA EVITAR ERRORES EN LINUX APPIMAGE
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('disable-setuid-sandbox');

let db; 

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'dist/faltas-app/browser/favicon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const indexPath = path.join(__dirname, 'dist/faltas-app/browser/index.html');
  win.loadFile(indexPath).catch(err => {
    console.error('ERROR cargando Angular:', err);
  });

  // Puedes comentar esto para producción
  // win.webContents.openDevTools();
}

app.whenReady().then(() => {
  // 1. Inicializar Base de Datos en ruta persistente
  const userDataPath = app.getPath('userData');
  const dbFolder = path.join(userDataPath, 'database');

  if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder, { recursive: true });
  }

  const dbPath = path.join(dbFolder, 'database.db');
  db = new Database(dbPath);
  db.pragma('foreign_keys = ON');

  // CREAR TABLAS NECESARIAS SI NO EXISTEN (Ajustes)
  db = new Database(dbPath);
  db.pragma('foreign_keys = ON');

  // Crear todas las tablas necesarias si la DB está vacía
  db.prepare(`
    CREATE TABLE IF NOT EXISTS cycle (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS modules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        hours INTEGER,
        report_code TEXT,
        cycle_id INTEGER,
        FOREIGN KEY (cycle_id) REFERENCES cycle(id) ON DELETE CASCADE
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        absences_limit INTEGER DEFAULT 15,
        include_justified INTEGER DEFAULT 0
    )
  `).run();



  db.prepare(`INSERT OR IGNORE INTO settings (id, absences_limit, include_justified) VALUES (1, 15, 1)`).run();

  // 2. REGISTRAR HANDLERS
  
  ipcMain.handle('get-cycles', () => {
    const sql = `SELECT id AS code, name FROM cycle ORDER BY name ASC;`;
    return db.prepare(sql).all();
  });

  ipcMain.handle('get-modules', (event, cycleId) => {
    return db.prepare(`SELECT * FROM modules WHERE cycle_id = ?`).all(cycleId);
  });

  ipcMain.handle('get-hierarchy', () => {
    const sql = `
      SELECT 
          c.id AS cycle_id, c.name AS cycle_name,
          m.id AS module_id, m.name AS module_name, 
          m.report_code, m.hours
      FROM cycle c
      LEFT JOIN modules m ON c.id = m.cycle_id
      ORDER BY c.name ASC, m.name ASC;
    `;
    return db.prepare(sql).all();
  });

  ipcMain.handle('delete-cycle', (event, id) => {
    const result = db.prepare('DELETE FROM cycle WHERE id = ?').run(id);
    return { success: result.changes > 0 };
  });

  ipcMain.handle('delete-module', (event, id) => {
    const result = db.prepare('DELETE FROM modules WHERE id = ?').run(id);
    return { success: result.changes > 0 };
  });

  ipcMain.handle('import-cycles-json', (event, treeData) => {
    const insertMany = db.transaction((data) => {
      db.prepare('DELETE FROM modules').run();
      db.prepare('DELETE FROM cycle').run();
      const insertCycle = db.prepare('INSERT INTO cycle (name) VALUES (?)');
      const insertModule = db.prepare('INSERT INTO modules (name, hours, report_code, cycle_id) VALUES (?, ?, ?, ?)');

      for (const cycleNode of data) {
        const cycleInfo = insertCycle.run(cycleNode.data.name);
        const newCycleId = cycleInfo.lastInsertRowid;
        if (cycleNode.children) {
          for (const moduleNode of cycleNode.children) {
            const m = moduleNode.data;
            insertModule.run(m.name, m.hours || 0, m.report_code || null, newCycleId);
          }
        }
      }
    });
    try {
      insertMany(treeData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('get-settings', () => {
    const row = db.prepare('SELECT absences_limit, include_justified FROM settings WHERE id = 1').get();
    return {
      absencesLimit: row.absences_limit,
      includeJustified: row.include_justified === 1
    };
  });

  ipcMain.handle('save-settings', (event, settings) => {
    const { absencesLimit, includeJustified } = settings;
    return db.prepare(`
      UPDATE settings 
      SET absences_limit = ?, include_justified = ? 
      WHERE id = 1
    `).run(absencesLimit, includeJustified ? 1 : 0);
  });

  // 3. Ventana y Menú
  Menu.setApplicationMenu(null);
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});