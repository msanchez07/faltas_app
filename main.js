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

  //win.webContents.openDevTools();
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
      cy.id AS code,
      CASE 
        -- Subconsulta: Contamos cuántos años activos tiene este ciclo concreto
        WHEN (SELECT COUNT(*) FROM cycle_years WHERE cicle_id = c.id AND is_active = 1) > 1 
        THEN c.name || ' - ' || cy.year
        ELSE c.name
      END AS name
    FROM 
      cycle_years cy
    JOIN 
      cycle c ON cy.cicle_id = c.id
    WHERE 
      cy.is_active = 1 
      AND c.is_active = 1
  `;

  const stmt = db.prepare(sql);
  return stmt.all(); 
});

ipcMain.handle('get-modules', (event, data) => {
  const sql = `
    SELECT 
      *
    FROM 
      modules
    WHERE 
      cicle_year_id = ?
  `;

  const stmt = db.prepare(sql);
  return stmt.all(data.cicle_year_id); 
});


/*// Escuchar petición para AGREGAR usuario
ipcMain.handle('add-usuario', (event, datos) => {
  const stmt = db.prepare('INSERT INTO usuarios (nombre, email) VALUES (?, ?)');
  const info = stmt.run(datos.nombre, datos.email);
  return info.lastInsertRowid; // Retorna el ID del nuevo usuario
});*/