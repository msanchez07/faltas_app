import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';


@Injectable({
  providedIn: 'root'
})
export class PdfReaderService {

  START_DELIMITERT = "Sesiones:";
  END_DELIMITERT = "TOTAL";
  
    constructor() {
      (pdfjsLib as any).GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.worker.min.mjs';
    }

    async getLinesFromPdfPage(pdfFile: File, pageNumber: number, justify: boolean): Promise<any[]> {
        const arrayBuffer = await pdfFile.arrayBuffer();
        const typedArray = new Uint8Array(arrayBuffer);

        const pdf = await pdfjsLib.getDocument(typedArray).promise;

        if (pageNumber < 1 || pageNumber > pdf.numPages) {
            throw new Error('El número de página está fuera de rango.');
        }

        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const items = content.items;
        const modules = this.getModules(items, justify);
        const students = this.getStudents(items);
        const table = this.getData(modules, students, items);
        return table;
    }
    
    private getStartPosition(items: [any]){
        let position = 1;
        for(let item of items){
            if('str' in item && item.str === this.START_DELIMITERT){
                break;
            } 

            position++;
        }

        return position;

    }

    private getEndPosition(items: [any]){
        let position = 0;
        for(let item of items){
            if('str' in item && item.str === this.END_DELIMITERT){
                break;
            } 

            position++;
        }

        return position;

    }

    private getStudentPosition(items: [any]){
        let position = this.getStartPosition(items);
        for(let i = this.getStartPosition(items); i<items.length; i++){
            const item = items[i];
            if('str' in item && item.str.length > 10){
                break;
            } 

            position++;
        }

        return position;
    }

    private getModules(items: any, justify: boolean){
        let modules: any = {};

        const startPosition = this.getStartPosition(items as [any]);
        const endPosition = this.getEndPosition(items as [any]);

        for(let i = startPosition; i<endPosition; i++){
            const item = items[i];
            // Validamos: 
            // 1. Que exista 'str'
            // 2. Que sea un string (typeof)
            // 3. Que tenga longitud >= 3
            // 4. Que contenga al menos una letra (Regex)
            if (
                'str' in item && 
                typeof item.str === 'string' && 
                item.str.length >= 3 && 
                /[a-zA-Z]/.test(item.str)
            ){
                modules[(items[i+4] as any).transform[5]] = item.str;
                if(justify)
                    modules[(items[i+6] as any).transform[5]] = item.str;                  
            } 
            
        }

        return modules;

    }
    
    private getStudents(items: any){
        
        let students: any = {};
        
        for(let i = this.getStartPosition(items); i<items.length; i++){
            const item = items[i];
            if((item as any).str && (item as any).str.length > 10 && (item as any).str.includes(','))
            {
                let name = item.str.split(',');
                name = name[1] + ' ' + name[0];
                students[(item as any).transform[4] | 0] =  name;
            }
        }

        return students;

    }

    private getData(modules: any, students: any, items: any){
        const stds = Object.values(students);
        const mds =  [...new Set(Object.values(modules))];

        const table = this.prepareTable(stds, mds);

        for(let i = this.getStudentPosition(items); i<items.length; i++){
            const item = items[i];
            if (this.isInteger(item.str)){
                const row = item.transform[4] | 0;
                const col = item.transform[5] | 0;
                

                const student = students[row];
                const module = this.getModule(modules, col);
                const num = Number(item.str);

                if(module != 0){
                    for(let j = 0; j<table.length; j++){
                        if(table[j].name === student){
                            table[j][module] += num;
                        }
                    }
                }
                
            }
        }

        return table;
    }

    private prepareTable(students: any, modules: any){
        const table: any = [];
        let mds: any = {}

        for(const module in modules){
            mds[modules[module]] = 0;
        }

        for(const student in students){
            let std = {name: students[student], ...mds}
            table.push(std);
        }

        return table;
    }

    private isInteger(str: string): boolean {
        return /^[0-9]+$/.test(str);
    }

    private getModule(modules: any, col: number) {
        // Convertir las claves del objeto a números
        const claves = Object.keys(modules).map(Number);
        if (claves.length === 0) return null;

        // Calcular las menores y mayores
        const menores = claves.filter(k => k < col);
        const mayores = claves.filter(k => k > col);

        // Buscar las más cercanas en cada grupo
        const menorMasCercana = menores.length ? Math.max(...menores) : null;
        const mayorMasCercana = mayores.length ? Math.min(...mayores) : null;

        // Elegir la más cercana entre ambas
        let masCercana: number | null = null;
        if (menorMasCercana !== null && mayorMasCercana !== null) {
            // Comparar distancias
            const distMenor = Math.abs(col - menorMasCercana);
            const distMayor = Math.abs(col - mayorMasCercana);
            masCercana = distMenor <= distMayor ? menorMasCercana : mayorMasCercana;
        } else {
            // Si solo hay una de las dos opciones
            masCercana = menorMasCercana ?? mayorMasCercana;
        }

        if (masCercana === null) return null;

        // Límite de distancia (si aplica)
        if (Math.abs(col - masCercana) > 10) return 0;

        return modules[masCercana.toString()];
    }

    

}
