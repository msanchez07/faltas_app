import { Component } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatabaseService } from '../../services/database.service';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { PdfReaderService } from '../../services/pdfReader.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';

interface Cycle {
    name: String;
    year_id: number;
    
}

@Component({
  selector: 'app-report',
  imports: [SelectModule, ButtonModule, InputTextModule, PanelModule, TableModule, InputNumberModule, FormsModule, ToggleButtonModule, TooltipModule],
  templateUrl: './report.html',
  styleUrl: './report.css',
})


export class ReportComponent {
    cycles: Cycle[] | undefined;
    modules: any[] = []
    data: any = []
    columns: any = []
    fileName: string = '';
    selectedFile: File | null = null;
    percent_absences: number = 15;

    private colorMap: { [key: string]: { background: string; color: string } } = {
        'bg-red-100':    { background: '#fecaca', color: '#991b1b' },
        'bg-orange-100': { background: '#fed7aa', color: '#9a3412' },
        'bg-yellow-100': { background: '#fef08a', color: '#854d0e' },
        'bg-green-100':  { background: '#bbf7d0', color: '#166534' }
    };

    constructor(private database: DatabaseService, private pdfReader: PdfReaderService){}

    onFileSelected(event: any) {
        const file: File = event.target.files[0];

        if (file) {
            this.fileName = file.name;
            this.selectedFile = file;
            
            // Aquí ya tienes el archivo en 'this.selectedFile'
            // Listo para procesar cuando quieras.
            console.log("Archivo cargado:", file.name);
            if(this.modules.length > 0)
                this.generateTable();
        }
    }

    onCycleSelected(event: any) {
        // El objeto seleccionado está en event.value
        const cycle = event.value;
        
        if (cycle && cycle.year_id) {            
            this.loadModules(cycle.year_id);
        }

        
    }

    ngOnInit() {
        this.loadCycles();
    }

    async loadCycles() {
        try {
            // 1. AWAIT: "Espera aquí hasta que la base de datos responda"
            // 'rawData' ya será el array real (ej: ['DAM', 'DAW', 'ASIR'])
            //const rawData = await this.database.getCycles();
            const rawData = this.fakeCycles();


            // 2. Ahora que ya tenemos los datos, los transformamos (Mapeo)
            // Esto convierte el array de strings en el formato que quiere PrimeNG {name, code}
            this.cycles = rawData.map(cycle => ({
                name: cycle.name, // o cycle.nombre si viene como objeto
                year_id: cycle.code  // o cycle.id si viene como objeto
            }));
            console.log(rawData);

        } catch (error) {
            console.error("Error cargando ciclos:", error);
        }
    }

    async loadModules(cicle_year_id: number){
        try{
            //const rawData = await this.database.getModules(cicle_year_id);
            const rawData = this.fakeData();
            this.modules = rawData;
            if(this.selectedFile)
                this.generateTable();

        } catch (error) {
            console.error("Error cargando modulos:", error);
        }
    }

    async generateTable() {
        this.data = await this.pdfReader.getLinesFromPdfPage(this.selectedFile!, 1);
        //this.data = this.fakeData();
        this.columns = Object.keys(this.data[0]);
        this.columns[0] = "Alumno";
        let reports = [];
       
        for(let i = 0; i < this.modules.length; i++){
            reports.push(this.modules[i].report_code);
        }
        for(let i = 1; i < this.columns.length; i++){
            if(!reports.includes(this.columns[i])){
                this.columns.splice(i, 1);
            }
        }
        for(const row in this.data){
            for(const res in this.modules){
                const report_code = this.modules[res].report_code;
                const hours = this.modules[res].hours;
                
                //const module_max_absences = Math.ceil(hours * this.percent_absences / 100);
                const actual_absences = this.data[row][report_code];
                
                this.data[row]["p_"+report_code] = Math.round(actual_absences * 100 / hours);
            }
                
        }
        
        this.columns.push("Acciones")       
        this.columns = this.columns.filter(function(item: any) {
            return item !== 'TU01CF'
        });
        
    }

    getColsAreSpan() {
        return this.columns.filter((col: string) => col !== 'Alumno' && col !== "Acciones");
    }

    getSeverityClass(porcentaje: number): string {
        if (porcentaje >= this.percent_absences) {
            return 'text-center bg-red-100 text-red-800';
        }
        if (porcentaje >= this.percent_absences * 0.66) {
            return 'text-center bg-orange-100 text-orange-800'; 
        }
        if (porcentaje >= this.percent_absences * 0.33) {
            return 'text-center bg-yellow-100 text-yellow-800'; 
        }
        if (porcentaje > 0) {
            return 'text-center bg-green-100 text-green-800'; 
        }
        return ''; 
    }

    async copyRowAsHtml(rowData: any) {
        const columnsToRemove = ['name', 'TU01CF'];
        const allKeys = Object.keys(rowData);

        const baseCols = allKeys.filter(key =>
            !columnsToRemove.includes(key) && !key.startsWith('p_')
        );
        const percentCols = allKeys.filter(key => key.startsWith('p_'));

        const finalHeaders: string[] = [];
        const orderedDataKeys: string[] = [];

        baseCols.forEach(baseCol => {
            finalHeaders.push(baseCol);
            orderedDataKeys.push(baseCol);

            const percentColKey = `p_${baseCol}`;
            if (percentCols.includes(percentColKey)) {
            finalHeaders.push(`% ${baseCol}`);
            orderedDataKeys.push(percentColKey);
            }
        });

        // --- TABLA con atributos antiguos (compatibilidad máxima) ---
        let htmlTable = `<table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse; font-family:sans-serif; font-size:14px; width:100%;">`;

        // Cabecera con bgcolor fijo gris claro
        htmlTable += `<thead><tr>`;
        finalHeaders.forEach(h => {
            htmlTable += `<th bgcolor="#f3f4f6" style="border:1px solid #d1d5db; font-weight:bold; text-align:left;">${this.escapeHtml(String(h))}</th>`;
        });
        htmlTable += `</tr></thead>`;

        // Cuerpo
        htmlTable += `<tbody><tr>`;
        orderedDataKeys.forEach(key => {
            let raw = rowData[key];
            let display = raw;
            let bgcolorAttr = '';
            let fontOpen = '';
            let fontClose = '';

            if (key.startsWith('p_')) {
            const percentage = Number(raw) || 0;
            const severityClass = this.getSeverityClass(percentage).split(' ')[0]; 
            const colors = this.colorMap[severityClass] || { background: '', color: '' };

            if (colors.background) bgcolorAttr = `bgcolor="${colors.background}"`;
            if (colors.color) {
                fontOpen = `<font color="${colors.color}">`;
                fontClose = `</font>`;
            }
            display = `${percentage}%`;
            }

            htmlTable += `<td ${bgcolorAttr} style="border:1px solid #d1d5db;">${fontOpen}${this.escapeHtml(String(display))}${fontClose}</td>`;
        });
        htmlTable += `</tr></tbody></table>`;

        // --- Copiar al portapapeles ---
        try {
            if (navigator.clipboard && (window as any).ClipboardItem) {
            await navigator.clipboard.write([
                new (window as any).ClipboardItem({
                'text/html': new Blob([htmlTable], { type: 'text/html' }),
                'text/plain': new Blob([this.htmlToPlainText(htmlTable)], { type: 'text/plain' })
                })
            ]);
            //this.messages.showConfirmation('Fila copiada al portapapeles (HTML)');
            } else {
            //this.messages.showError('El navegador no soporta la API moderna del portapapeles');
            }
        } catch (err) {
            console.error('Error al copiar HTML:', err);
            //this.messages.showError('No se pudo copiar. Revisa permisos del navegador.');
        }
        }

        // Helpers
        private escapeHtml(str: string) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
        }

        private htmlToPlainText(html: string) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.innerText || tmp.textContent || '';
    }

    fakeData(){
        return [
            {
                "id": 61,
                "is_active": 1,
                "created_at": "2025-09-24 10:20:58",
                "updated_at": "2025-09-24 10:20:58",
                "name": "Programación",
                "description": "Creación de algoritmos y programas con distintos lenguajes.",
                "path": "prg_daw",
                "image": null,
                "has_content": 0,
                "hours": 266,
                "acronym": "PRG_DAW",
                "cicle_year_id": 5,
                "report_code": "PRO"
            },
            {
                "id": 62,
                "is_active": 1,
                "created_at": "2025-09-24 10:20:58",
                "updated_at": "2025-09-24 10:20:58",
                "name": "Bases de datos",
                "description": "Diseño y gestión de BBDD relacionales.",
                "path": "bd_daw",
                "image": null,
                "has_content": 0,
                "hours": 166,
                "acronym": "BD_DAW",
                "cicle_year_id": 5,
                "report_code": "BDA"
            },
            {
                "id": 63,
                "is_active": 1,
                "created_at": "2025-09-24 10:20:58",
                "updated_at": "2025-09-24 10:20:58",
                "name": "Entornos de desarrollo",
                "description": "Uso de IDE y control de versiones.",
                "path": "ed_daw",
                "image": null,
                "has_content": 0,
                "hours": 100,
                "acronym": "ED_DAW",
                "cicle_year_id": 5,
                "report_code": "EDE"
            },
            {
                "id": 64,
                "is_active": 1,
                "created_at": "2025-09-24 10:20:58",
                "updated_at": "2025-09-24 10:20:58",
                "name": "Sistemas informáticos",
                "description": "Instalación de sistemas operativos y redes.",
                "path": "si_daw",
                "image": null,
                "has_content": 0,
                "hours": 166,
                "acronym": "SI_DAW",
                "cicle_year_id": 5,
                "report_code": "SIN"
            },
            {
                "id": 65,
                "is_active": 1,
                "created_at": "2025-09-24 10:20:58",
                "updated_at": "2025-09-24 10:20:58",
                "name": "Lenguajes de marcas",
                "description": "HTML, XML, CSS y otras tecnologías.",
                "path": "lm_daw",
                "image": null,
                "has_content": 0,
                "hours": 100,
                "acronym": "LM_DAW",
                "cicle_year_id": 5,
                "report_code": "LMSGI"
            },
            {
                "id": 66,
                "is_active": 1,
                "created_at": "2025-09-24 10:20:58",
                "updated_at": "2025-09-24 10:20:58",
                "name": "Inglés profesional GS",
                "description": "Comunicación en inglés aplicada a la informática web.",
                "path": "ing_daw",
                "image": null,
                "has_content": 0,
                "hours": 68,
                "acronym": "ING_DAW",
                "cicle_year_id": 5,
                "report_code": "ING"
            },
            {
                "id": 67,
                "is_active": 1,
                "created_at": "2025-09-24 10:20:58",
                "updated_at": "2025-09-24 10:20:58",
                "name": "Itinerario personal para la empleabilidad I",
                "description": "Desarrollo de habilidades personales y empleabilidad.",
                "path": "ipe1_daw",
                "image": null,
                "has_content": 0,
                "hours": 100,
                "acronym": "IPE1_DAW",
                "cicle_year_id": 5,
                "report_code": "IPE1"
            },
            {
                "id": 68,
                "is_active": 1,
                "created_at": "2025-09-24 10:20:58",
                "updated_at": "2025-09-24 10:20:58",
                "name": "Proyecto intermodular DAW I",
                "description": "Proyecto inicial de desarrollo web.",
                "path": "pidaw1",
                "image": null,
                "has_content": 0,
                "hours": 34,
                "acronym": "PIDAW1",
                "cicle_year_id": 5,
                "report_code": "PI1DAW"
            }
        ]
    }

    fakeCycles(){
        return [
    {
        "code": 1,
        "name": "SMR - primero"
    },
    {
        "code": 2,
        "name": "SMR - segundo"
    },
    {
        "code": 3,
        "name": "DAM - primero"
    },
    {
        "code": 4,
        "name": "DAM - segundo"
    },
    {
        "code": 5,
        "name": "DAW - primero"
    },
    {
        "code": 6,
        "name": "DAW - segundo"
    },
    {
        "code": 7,
        "name": "ASIR - primero"
    },
    {
        "code": 8,
        "name": "ASIR - segundo"
    },
    {
        "code": 9,
        "name": "Inteligencia Artificial y Big Data"
    },
    {
        "code": 10,
        "name": "Ciberseguridad en Entornos TI"
    },
    {
        "code": 11,
        "name": "Desarrollo Videojuegos y Realidad Virtual"
    }
]
    }

}
