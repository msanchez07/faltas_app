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
import { NavigatorService } from '../../services/navigation.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Cycle {
    name: String;
    id: number;
    
}

@Component({
  selector: 'app-report',
  imports: [SelectModule, ButtonModule, InputTextModule, PanelModule, TableModule, InputNumberModule, FormsModule, ToggleButtonModule, TooltipModule],
  templateUrl: './report.html',
  styleUrl: './report.css',
})


export class ReportComponent {
    cycles: Cycle[] = [];
    modules: any[] = []
    data: any = []
    columns: any = []
    fileName: string = '';
    selectedFile: File | null = null;
    percent_absences: number = 15;
    justify = false;
    selectedCycle : Cycle | null = null;


    private colorMap: { [key: string]: { background: string; color: string } } = {
        'bg-red-100':    { background: '#fecaca', color: '#991b1b' },
        'bg-orange-100': { background: '#fed7aa', color: '#9a3412' },
        'bg-yellow-100': { background: '#fef08a', color: '#854d0e' },
        'bg-green-100':  { background: '#bbf7d0', color: '#166534' }
    };

    constructor(private database: DatabaseService, private pdfReader: PdfReaderService, public navigator: NavigatorService){}

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
        this.selectedCycle = event.value;
        
        if (this.selectedCycle && this.selectedCycle.id) {            
            this.loadModules(this.selectedCycle.id);
        }

        
    }

    ngOnInit() {
        this.loadCycles();
        this.loadSettings();
    }

    async loadSettings(){
        const config = await this.database.getSettings();
        this.percent_absences = config.absencesLimit;
        this.justify = config.includeJustified;
    }

    disableSelectCycles(){
        return this.cycles!.length == 0;
    }

    async loadCycles() {
        try {
            const rawData = await this.database.getCycles();

            this.cycles = rawData.map(cycle => ({
                name: cycle.name, // o cycle.nombre si viene como objeto
                id: cycle.code  // o cycle.id si viene como objeto
            }));
            console.log(rawData);

        } catch (error) {
            console.error("Error cargando ciclos:", error);
        }
    }

    async loadModules(cicle_id: number){
        try{
            const rawData = await this.database.getModules(cicle_id);
            this.modules = rawData;
            if(this.selectedFile)
                this.generateTable();

        } catch (error) {
            console.error("Error cargando modulos:", error);
        }
    }

    async generateTable() {
        this.data = await this.pdfReader.getLinesFromPdfPage(this.selectedFile!, 1, this.justify);
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

        // 1. Filtrar y preparar las columnas (esto faltaba en tu snippet)
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

        // 2. Construcción de la tabla HTML
        let htmlTable = `<table border="1" cellpadding="5" cellspacing="0" style="border-collapse:collapse; font-family:sans-serif; font-size:14px; width:100%;">`;
        
        // Cabecera
        htmlTable += `<thead><tr>`;
        finalHeaders.forEach(h => {
            htmlTable += `<th style="background-color:#f3f4f6; border:1px solid #d1d5db; font-weight:bold; text-align:left; padding:8px;">${this.escapeHtml(String(h))}</th>`;
        });
        htmlTable += `</tr></thead><tbody><tr>`;

        // Cuerpo
        orderedDataKeys.forEach(key => {
            let raw = rowData[key];
            let display = raw;
            let cellStyle = "border:1px solid #d1d5db; padding:8px; text-align:left;";

            if (key.startsWith('p_')) {
                const percentage = Number(raw) || 0;
                // 1. Obtenemos el string largo: 'text-center bg-red-100 text-red-800'
                const fullClassString = this.getSeverityClass(percentage);
                
                // 2. Buscamos cuál de tus claves ('bg-red-100', etc.) está dentro de ese string
                const colorKey = Object.keys(this.colorMap).find(cls => fullClassString.includes(cls));

                if (colorKey) {
                    const colors = this.colorMap[colorKey];
                    // 3. Aplicamos los Hexadecimales que ya tienes en el mapa
                    cellStyle += `background-color: ${colors.background} !important; color: ${colors.color} !important;`;
                }
                display = `${percentage}%`;
            }

            htmlTable += `<td style="${cellStyle}">${this.escapeHtml(String(display))}</td>`;
        });
        
        htmlTable += `</tr></tbody></table>`;

        // 3. Texto plano para aplicaciones que no aceptan HTML
        const plainText = this.htmlToPlainText(htmlTable);

        // 4. EL PUENTE (Verifica que el preload esté cargado)
        if ((window as any).electronAPI) {
            console.log('Solicitando copia al proceso principal...');
            (window as any).electronAPI.copyHtml(htmlTable, plainText)
                .then((result: any) => {
                    if (result.success) {
                        console.log('¡Copiado con éxito desde el Main Process!');
                    } else {
                        console.error('Error en el Main Process:', result.error);
                    }
                });
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

    navigateToDatabase(){
        this.navigator.navigateDatabase();
    }

    exportToPdf() {
        const doc = new jsPDF('l', 'mm', 'a4');

        doc.setFontSize(16);
        doc.text('Informe Detallado de Faltas', 14, 15);
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Ciclo: ${this.selectedCycle!.name} | Porcentaje de faltas: ${this.percent_absences}% | Se cuentan las faltas justificadas: ${this.justify ? "Sí" : "No"}`, 14, 22);

        // 1. Definir las dos filas de la cabecera
        // Fila 1: Alumno | Módulo 1 (ocupa 2 col) | Módulo 2 (ocupa 2 col) ...
        const headerRow1: any[] = [{ content: 'Alumno', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } }];
        
        // Fila 2: (Alumno está spanneado) | Total | % | Total | % ...
        const headerRow2: any[] = [];

        // 2. Definir las columnas de datos (DataKeys)
        const dataKeys: string[] = ['Alumno'];

        this.modules.forEach(m => {
            // Añadimos a la fila superior el nombre del módulo ocupando 2 columnas
            headerRow1.push({ 
                content: m.report_code, 
                colSpan: 2, 
                styles: { halign: 'center' } 
            });

            // Añadimos a la fila inferior los subencabezados
            headerRow2.push({ content: 'Total', styles: { halign: 'center' } });
            headerRow2.push({ content: '%', styles: { halign: 'center' } });

            // Registramos las claves de datos para mapear el body
            dataKeys.push(m.report_code);
            dataKeys.push(`p_${m.report_code}`);
        });

        // 3. Preparar el Body
        const body = this.data.map((row: any) => {
            // Mapeamos cada fila según el orden de dataKeys
            return dataKeys.map(key => {
                if (key === 'Alumno') return row['name'] || row[Object.keys(row)[0]];
                if (key.startsWith('p_')) return `${row[key]}%`;
                return row[key];
            });
        });

        // 4. Generar la tabla
        autoTable(doc, {
            head: [headerRow1, headerRow2],
            body: body,
            startY: 30,
            theme: 'grid',
            styles: { fontSize: 7, cellPadding: 1.5, halign: 'center' },
            headStyles: { fillColor: [51, 65, 85], textColor: 255 },
            columnStyles: {
                // EXCEPCIÓN: La columna 0 (Alumno) se alinea a la izquierda
                0: { cellWidth: 40, fontStyle: 'bold', halign: 'left' } 
            },
            
            didParseCell: (data) => {
                // Aplicar colores solo a las celdas del cuerpo que contienen porcentajes
                if (data.section === 'body') {
                    const colIndex = data.column.index;
                    const key = dataKeys[colIndex];

                    if (key.startsWith('p_')) {
                        const percentage = parseInt(data.cell.raw as string);
                        if (!isNaN(percentage)) {
                            // Obtenemos la clase de severidad (ej: bg-red-100)
                            const severityClass = this.getSeverityClass(percentage).split(' ')[1];
                            const colors = this.colorMap[severityClass];

                            if (colors) {
                                data.cell.styles.fillColor = colors.background;
                                data.cell.styles.textColor = colors.color;
                            }
                        }
                    }
                }
            }
        });

        doc.save(`Informe_Faltas_${new Date().getTime()}.pdf`);
    }
    
}
