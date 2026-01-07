import { Component } from '@angular/core';
import { TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TreeNode, ConfirmationService, MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { DatabaseService } from '../../services/database.service';
import { NavigatorService } from '../../services/navigation.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-database',
  imports: [TreeTableModule, ButtonModule, PanelModule, TooltipModule, ConfirmDialogModule],
  templateUrl: './database.component.html',
  providers: [ConfirmationService, MessageService]
})


export class DatabaseComponent {

    cycles!: TreeNode[];
    constructor(private databaseService: DatabaseService, public navigatorService: NavigatorService, private confirmationService: ConfirmationService) {}

    ngOnInit() {
        this.loadData();
    }

    mapToPrimeNGTree(data: any[]): TreeNode[] {
        const tree: TreeNode[] = [];

        data.forEach(item => {
            // 1. NIVEL CICLO (Ahora ya incluye el curso en el nombre)
            let cycleNode = tree.find(n => n.data.id === item.cycle_id);

            if (!cycleNode) {
                cycleNode = {
                    data: { 
                        id: item.cycle_id, 
                        name: item.cycle_name, 
                        type: 'cycle' 
                    },
                    children: [],
                    expanded: false // Cerrados por defecto
                };
                tree.push(cycleNode);
            }

            // 2. NIVEL MÓDULO (Cuelga directamente del ciclo)
            cycleNode.children?.push({
                data: { 
                    id: item.module_id, 
                    name: item.module_name, 
                    report_code: item.report_code, 
                    hours: item.hours, 
                    type: 'module' 
                }
            });
        });

        return tree;
        
    }

    async loadData() {
        try {
            // 1. Pedimos los datos a la base de datos a través del servicio
            const data = await this.databaseService.getHierarchyData();
            
            // 2. Mapeamos los datos planos a la estructura jerárquica de PrimeNG
            if (data && data.length > 0) {
                this.cycles = this.mapToPrimeNGTree(data);
            } else {
                this.cycles = [];
            }
        } catch (error) {
            console.error('Error al cargar datos de la DB:', error);
            this.cycles = [];
        }
    }

    exportToJSON(): void {
        if (!this.cycles || this.cycles.length === 0) {
            console.warn("No hay datos para exportar");
            return;
        }

        // El segundo parámetro de stringify es el 'replacer'. 
        // Filtramos las propiedades que no queremos exportar.
        const jsonExport = JSON.stringify(this.cycles, (key, value) => {
            if (key === 'id' || key === 'parent' || key === 'expanded') {
                return undefined; // Elimina la propiedad del JSON resultante
            }
            return value;
        }, 4);

        const blob = new Blob([jsonExport], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `plantilla_ciclos_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        
        window.URL.revokeObjectURL(url);
    }

    confirmDeleteCycle(nodeData: any) {
        this.confirmationService.confirm({
            message: `¿Eliminar el ciclo "${nodeData.name}"? Esta acción borrará PERMANENTEMENTE todos los módulos asociados.`,
            header: 'ADVERTENCIA: Eliminación de Ciclo',
            icon: 'pi pi-trash',
            acceptLabel: 'Eliminar todo',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-text',
            accept: async () => {
                const res = await this.databaseService.deleteCycle(nodeData.id);
                if (res.success) {
                    this.loadData();
                }
            }
        });
    }

    confirmDeleteModule(nodeData: any) {
        this.confirmationService.confirm({
            message: `¿Estás seguro de que deseas eliminar el módulo "${nodeData.name}"?`,
            header: 'Confirmar Eliminación de Módulo',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-text',
            accept: async () => {
                const res = await this.databaseService.deleteModule(nodeData.id);
                if (res.success) {
                    this.loadData();
                }
            }
        });
    }

    async importJSON(event: any) {
        // 1. Obtenemos el archivo desde el input del HTML
        const file: File = event.target.files[0];
        if (!file) return;

        // 2. Leemos el contenido del archivo
        const reader = new FileReader();
        reader.onload = async (e: any) => {
            try {
                // Parseamos el contenido a JSON
                const jsonData = JSON.parse(e.target.result);
                
                // 3. Enviamos al proceso principal a través de nuestro servicio
                // Usamos el método 'importHierarchy' que añadimos al DatabaseService
                const result = await this.databaseService.importHierarchy(jsonData);

                if (result.success) {
                    alert('Base de datos SQLite actualizada con éxito');
                    
                    // 4. Refrescar la vista
                    // Aquí deberías llamar a la función que carga tus ciclos de nuevo
                    this.loadData(); 
                } else {
                    alert('Error al importar en la base de datos: ' + result.error);
                }
            } catch (error) {
                console.error('Error al procesar el archivo JSON:', error);
                alert('El archivo seleccionado no es un JSON válido.');
            } finally {
                // Limpiamos el input para permitir cargar el mismo archivo otra vez si fuera necesario
                event.target.value = '';
            }
        };

        reader.readAsText(file);
    }

    goBack(){
        this.navigatorService.back();
    }

}
