import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() { }

  // Angular usa Promesas aquí porque la comunicación IPC es asíncrona
  async getCycles(): Promise<any[]> {
    if (window.dbApi) {
      return await window.dbApi.getCycles();
    } else {
      console.error('Electron API no encontrada (¿Estás en el navegador web?)');
      return [];
    }
  }

  async getModules(cicle_year_id: number): Promise<any[]> {
      if (window.dbApi) {
        return await window.dbApi.getModules(cicle_year_id);
      } else {
        console.error('Electron API no encontrada (¿Estás en el navegador web?)');
        return [];
      }
  }

  /*async crearUsuario(nombre: string, email: string): Promise<number> {
    if (window.dbApi) {
      return await window.dbApi.addUsuario(nombre, email);
    }
    return -1;
  }*/
}