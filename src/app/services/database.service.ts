import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

    constructor() { }

    /**
     * Obtiene la estructura completa (JOIN de ciclos y módulos) para el TreeTable
     */
    async getHierarchyData(): Promise<any[]> {
      if ((window as any).dbApi) {
        return await (window as any).dbApi.getHierarchy();
      }
      this.handleError();
      return [];
    }

    /**
     * Obtiene la lista simple de ciclos
     */
    async getCycles(): Promise<any[]> {
      if ((window as any).dbApi) {
        return await (window as any).dbApi.getCycles();
      }
      this.handleError();
      return [];
    }

    /**
     * Guarda un ciclo (Crea si id es null, actualiza si existe)
     */
    async saveCycle(name: string, id: number | null = null): Promise<{ success: boolean }> {
      if ((window as any).dbApi) {
        return await (window as any).dbApi.saveCycle({ id, name });
      }
      return { success: false };
    }

    /**
     * Elimina un ciclo (y sus módulos por CASCADE)
     */
    async deleteCycle(id: number): Promise<{ success: boolean }> {
      if ((window as any).dbApi) {
        return await (window as any).dbApi.deleteCycle(id);
      }
      return { success: false };
    }

    async getModules(id: number): Promise<any[]> {
      if ((window as any).dbApi) {
        return await (window as any).dbApi.getModules(id);
      }
      this.handleError();
      return [];
    }

    /**
     * Guarda un módulo (Crea o actualiza)
     */
    async saveModule(moduleData: { id: number | null, cycle_id: number | null, name: string, report_code: string, hours: number }): Promise<{ success: boolean }> {
      if ((window as any).dbApi) {
        return await (window as any).dbApi.saveModule(moduleData);
      }
      return { success: false };
    }

    /**
     * Elimina un módulo individual
     */
    async deleteModule(id: number): Promise<{ success: boolean }> {
      if ((window as any).dbApi) {
        return await (window as any).dbApi.deleteModule(id);
      }
      return { success: false };
    }

    /**
     * Importación masiva desde JSON
     */
    async importHierarchy(treeData: any[]): Promise<{ success: boolean, error?: string }> {
      if ((window as any).dbApi) {
        return await (window as any).dbApi.importCyclesJson(treeData);
      }
      this.handleError();
      return { success: false, error: 'Electron API no disponible' };
    }

    async getSettings(): Promise<any> {
      if ((window as any).dbApi) {
        return await (window as any).dbApi.getSettings();
      }
      return { absencesLimit: 15, includeJustified: false }; // Fallback
    }

    async saveSettings(settings: any): Promise<any> {
      if ((window as any).dbApi) {
        return await (window as any).dbApi.saveSettings(settings);
      }
    }

    private handleError() {
      console.error('Electron API (dbApi) no encontrada. Asegúrate de estar ejecutando la app dentro de Electron.');
    }
}