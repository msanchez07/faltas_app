import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() { }

  /**
   * Obtiene la lista de ciclos (que ahora incluye el año en el nombre)
   */
  async getCycles(): Promise<any[]> {
    if ((window as any).dbApi) {
      return await (window as any).dbApi.getCycles();
    } else {
      this.handleError();
      return [];
    }
  }

  /**
   * Obtiene los módulos de un ciclo específico.
   * Nota: Ahora usamos 'cycleId' ya que la tabla cycle_years desapareció.
   */
  async getModules(cycleId: number): Promise<any[]> {
    if ((window as any).dbApi) {
      return await (window as any).dbApi.getModules(cycleId);
    } else {
      this.handleError();
      return [];
    }
  }

  /**
   * Importa la estructura jerárquica TreeNode (Ciclos -> Módulos)
   * directamente a la base de datos SQLite en Electron.
   */
  async importHierarchy(treeData: any[]): Promise<{ success: boolean, error?: string }> {
    if ((window as any).dbApi) {
      return await (window as any).dbApi.importCyclesJson(treeData);
    } else {
      this.handleError();
      return { success: false, error: 'Electron API no disponible' };
    }
  }

  private handleError() {
    console.error('Electron API (dbApi) no encontrada. Asegúrate de estar ejecutando la app dentro de Electron.');
  }
}