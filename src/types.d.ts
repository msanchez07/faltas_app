export interface IElectronAPI {
  getCycles: () => Promise<any[]>;
  getModules: (id: number) => Promise<any[]>;
  //addUsuario: (nombre: string, email: string) => Promise<number>;
}

declare global {
  interface Window {
    dbApi: IElectronAPI;

  }
}