import { Component } from '@angular/core';
import { TreeTableModule } from 'primeng/treetable';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TreeNode } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { DatabaseService } from '../../services/database.service';
import { NavigatorService } from '../../services/navigation.service';

interface RawData {
    cycle_id: number;
    cycle_name: string;
    year_id: number;
    year_label: string;
    module_id: number;
    module_name: string;
    acronym: string;
}


@Component({
  selector: 'app-database',
  imports: [TreeTableModule, ButtonModule, PanelModule, TooltipModule],
  templateUrl: './database.component.html'
})


export class DatabaseComponent {

    cycles!: TreeNode[];
    constructor(private databaseService: DatabaseService, public navigatorService: NavigatorService) {}

    ngOnInit() {
        const data = this.fakeData();
        this.cycles = this.mapToPrimeNGTree(data);
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

    loadData(){
       
    }

    exportToJSON(fileName: string = 'datos-ciclos.json'): void {
        // Verificamos que haya datos
        if (!this.cycles || this.cycles.length === 0) {
            console.warn("No hay datos para exportar");
            return;
        }

        // Convertimos la estructura de nodos completa (incluyendo children)
        const blob = new Blob([JSON.stringify(this.cycles, null, 4)], { type: 'application/json' });
        
        // Proceso de descarga
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `exportacion_ciclos_${new Date().getTime()}.json`;
        a.click();
        
        window.URL.revokeObjectURL(url);
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




    fakeData(){
        return [
  {
    "cycle_id": 7,
    "cycle_name": "ASIR primero",
    "module_id": 103,
    "module_name": "Fundamentos de hardware",
    "report_code": null,
    "hours": 100
  },
  {
    "cycle_id": 7,
    "cycle_name": "ASIR primero",
    "module_id": 104,
    "module_name": "Gestión de bases de datos",
    "report_code": null,
    "hours": 166
  },
  {
    "cycle_id": 7,
    "cycle_name": "ASIR primero",
    "module_id": 101,
    "module_name": "Implantación de sistemas operativos",
    "report_code": null,
    "hours": 233
  },
  {
    "cycle_id": 7,
    "cycle_name": "ASIR primero",
    "module_id": 105,
    "module_name": "Lenguajes de marcas y sistemas de gestión de información",
    "report_code": null,
    "hours": 100
  },
  {
    "cycle_id": 7,
    "cycle_name": "ASIR primero",
    "module_id": 102,
    "module_name": "Planificación y administración de redes",
    "report_code": null,
    "hours": 200
  },
  {
    "cycle_id": 7,
    "cycle_name": "ASIR primero",
    "module_id": 106,
    "module_name": "Proyecto intermodular ASIR I",
    "report_code": null,
    "hours": 34
  },
  {
    "cycle_id": 8,
    "cycle_name": "ASIR segundo",
    "module_id": 110,
    "module_name": "Administración de sistemas gestores de bases de datos",
    "report_code": null,
    "hours": 67
  },
  {
    "cycle_id": 8,
    "cycle_name": "ASIR segundo",
    "module_id": 107,
    "module_name": "Administración de sistemas operativos",
    "report_code": null,
    "hours": 133
  },
  {
    "cycle_id": 8,
    "cycle_name": "ASIR segundo",
    "module_id": 109,
    "module_name": "Implantación de aplicaciones web",
    "report_code": null,
    "hours": 133
  },
  {
    "cycle_id": 8,
    "cycle_name": "ASIR segundo",
    "module_id": 112,
    "module_name": "Proyecto intermodular ASIR II",
    "report_code": null,
    "hours": 100
  },
  {
    "cycle_id": 8,
    "cycle_name": "ASIR segundo",
    "module_id": 111,
    "module_name": "Seguridad y alta disponibilidad",
    "report_code": null,
    "hours": 133
  },
  {
    "cycle_id": 8,
    "cycle_name": "ASIR segundo",
    "module_id": 108,
    "module_name": "Servicios de red e internet",
    "report_code": null,
    "hours": 166
  },
  {
    "cycle_id": 10,
    "cycle_name": "Ciberseguridad en Entornos TI",
    "module_id": 120,
    "module_name": "Análisis forense",
    "report_code": null,
    "hours": 60
  },
  {
    "cycle_id": 10,
    "cycle_name": "Ciberseguridad en Entornos TI",
    "module_id": 118,
    "module_name": "Fundamentos de ciberseguridad",
    "report_code": null,
    "hours": 100
  },
  {
    "cycle_id": 10,
    "cycle_name": "Ciberseguridad en Entornos TI",
    "module_id": 121,
    "module_name": "Pentesting y auditoría",
    "report_code": null,
    "hours": 80
  },
  {
    "cycle_id": 10,
    "cycle_name": "Ciberseguridad en Entornos TI",
    "module_id": 122,
    "module_name": "Seguridad en aplicaciones",
    "report_code": null,
    "hours": 80
  },
  {
    "cycle_id": 10,
    "cycle_name": "Ciberseguridad en Entornos TI",
    "module_id": 119,
    "module_name": "Seguridad en redes",
    "report_code": null,
    "hours": 80
  },
  {
    "cycle_id": 3,
    "cycle_name": "DAM primero",
    "module_id": 85,
    "module_name": "Bases de datos",
    "report_code": null,
    "hours": 166
  },
  {
    "cycle_id": 3,
    "cycle_name": "DAM primero",
    "module_id": 86,
    "module_name": "Entornos de desarrollo",
    "report_code": null,
    "hours": 100
  },
  {
    "cycle_id": 3,
    "cycle_name": "DAM primero",
    "module_id": 89,
    "module_name": "Inglés profesional GS",
    "report_code": null,
    "hours": 68
  },
  {
    "cycle_id": 3,
    "cycle_name": "DAM primero",
    "module_id": 88,
    "module_name": "Lenguajes de marcas",
    "report_code": null,
    "hours": 100
  },
  {
    "cycle_id": 3,
    "cycle_name": "DAM primero",
    "module_id": 84,
    "module_name": "Programación",
    "report_code": null,
    "hours": 266
  },
  {
    "cycle_id": 3,
    "cycle_name": "DAM primero",
    "module_id": 90,
    "module_name": "Proyecto intermodular DAM I",
    "report_code": null,
    "hours": 34
  },
  {
    "cycle_id": 3,
    "cycle_name": "DAM primero",
    "module_id": 87,
    "module_name": "Sistemas informáticos",
    "report_code": null,
    "hours": 166
  },
  {
    "cycle_id": 4,
    "cycle_name": "DAM segundo",
    "module_id": 91,
    "module_name": "Acceso a datos",
    "report_code": null,
    "hours": 133
  },
  {
    "cycle_id": 4,
    "cycle_name": "DAM segundo",
    "module_id": 92,
    "module_name": "Desarrollo de interfaces",
    "report_code": null,
    "hours": 166
  },
  {
    "cycle_id": 4,
    "cycle_name": "DAM segundo",
    "module_id": 94,
    "module_name": "Digitalización aplicada al sistema productivo GS",
    "report_code": null,
    "hours": 34
  },
  {
    "cycle_id": 4,
    "cycle_name": "DAM segundo",
    "module_id": 93,
    "module_name": "Programación multimedia y dispositivos móviles",
    "report_code": null,
    "hours": 133
  },
  {
    "cycle_id": 4,
    "cycle_name": "DAM segundo",
    "module_id": 95,
    "module_name": "Proyecto intermodular DAM II",
    "report_code": null,
    "hours": 100
  },
  {
    "cycle_id": 5,
    "cycle_name": "DAW primero",
    "module_id": 129,
    "module_name": "Bases de datos",
    "report_code": "BDA",
    "hours": 166
  },
  {
    "cycle_id": 5,
    "cycle_name": "DAW primero",
    "module_id": 130,
    "module_name": "Entornos de desarrollo",
    "report_code": "EDE",
    "hours": 100
  },
  {
    "cycle_id": 5,
    "cycle_name": "DAW primero",
    "module_id": 133,
    "module_name": "Inglés profesional GS",
    "report_code": "ING",
    "hours": 68
  },
  {
    "cycle_id": 5,
    "cycle_name": "DAW primero",
    "module_id": 134,
    "module_name": "Itinerario personal para la empleabilidad I",
    "report_code": "IPE1",
    "hours": 100
  },
  {
    "cycle_id": 5,
    "cycle_name": "DAW primero",
    "module_id": 132,
    "module_name": "Lenguajes de marcas",
    "report_code": "LMSGI",
    "hours": 100
  },
  {
    "cycle_id": 5,
    "cycle_name": "DAW primero",
    "module_id": 128,
    "module_name": "Programación",
    "report_code": "PRO",
    "hours": 266
  },
  {
    "cycle_id": 5,
    "cycle_name": "DAW primero",
    "module_id": 135,
    "module_name": "Proyecto intermodular DAW I",
    "report_code": "PI1DAW",
    "hours": 34
  },
  {
    "cycle_id": 5,
    "cycle_name": "DAW primero",
    "module_id": 131,
    "module_name": "Sistemas informáticos",
    "report_code": "SIN",
    "hours": 166
  },
  {
    "cycle_id": 6,
    "cycle_name": "DAW segundo",
    "module_id": 96,
    "module_name": "Desarrollo web en entorno cliente",
    "report_code": null,
    "hours": 200
  },
  {
    "cycle_id": 6,
    "cycle_name": "DAW segundo",
    "module_id": 97,
    "module_name": "Desarrollo web en entorno servidor",
    "report_code": null,
    "hours": 200
  },
  {
    "cycle_id": 6,
    "cycle_name": "DAW segundo",
    "module_id": 98,
    "module_name": "Despliegue de aplicaciones web",
    "report_code": null,
    "hours": 100
  },
  {
    "cycle_id": 6,
    "cycle_name": "DAW segundo",
    "module_id": 99,
    "module_name": "Diseño de interfaces web",
    "report_code": null,
    "hours": 133
  },
  {
    "cycle_id": 6,
    "cycle_name": "DAW segundo",
    "module_id": 100,
    "module_name": "Proyecto intermodular DAW II",
    "report_code": null,
    "hours": 99
  },
  {
    "cycle_id": 11,
    "cycle_name": "Desarrollo Videojuegos y Realidad Virtual",
    "module_id": 126,
    "module_name": "Diseño de niveles y narrativa",
    "report_code": null,
    "hours": 80
  },
  {
    "cycle_id": 11,
    "cycle_name": "Desarrollo Videojuegos y Realidad Virtual",
    "module_id": 123,
    "module_name": "Fundamentos de videojuegos",
    "report_code": null,
    "hours": 100
  },
  {
    "cycle_id": 11,
    "cycle_name": "Desarrollo Videojuegos y Realidad Virtual",
    "module_id": 125,
    "module_name": "Gráficos 3D y realidad virtual",
    "report_code": null,
    "hours": 100
  },
  {
    "cycle_id": 11,
    "cycle_name": "Desarrollo Videojuegos y Realidad Virtual",
    "module_id": 124,
    "module_name": "Programación de videojuegos",
    "report_code": null,
    "hours": 120
  },
  {
    "cycle_id": 11,
    "cycle_name": "Desarrollo Videojuegos y Realidad Virtual",
    "module_id": 127,
    "module_name": "Proyecto videojuegos",
    "report_code": null,
    "hours": 60
  },
  {
    "cycle_id": 9,
    "cycle_name": "Inteligencia Artificial y Big Data",
    "module_id": 117,
    "module_name": "Big data aplicado",
    "report_code": null,
    "hours": 80
  },
  {
    "cycle_id": 9,
    "cycle_name": "Inteligencia Artificial y Big Data",
    "module_id": 113,
    "module_name": "Modelos de inteligencia artificial",
    "report_code": null,
    "hours": 120
  },
  {
    "cycle_id": 9,
    "cycle_name": "Inteligencia Artificial y Big Data",
    "module_id": 115,
    "module_name": "Programación de inteligencia artificial",
    "report_code": null,
    "hours": 100
  },
  {
    "cycle_id": 9,
    "cycle_name": "Inteligencia Artificial y Big Data",
    "module_id": 114,
    "module_name": "Sistemas de aprendizaje automático",
    "report_code": null,
    "hours": 100
  },
  {
    "cycle_id": 9,
    "cycle_name": "Inteligencia Artificial y Big Data",
    "module_id": 116,
    "module_name": "Sistemas de big data",
    "report_code": null,
    "hours": 80
  },
  {
    "cycle_id": 1,
    "cycle_name": "SMR primero",
    "module_id": 72,
    "module_name": "Aplicaciones ofimáticas",
    "report_code": null,
    "hours": 233
  },
  {
    "cycle_id": 1,
    "cycle_name": "SMR primero",
    "module_id": 69,
    "module_name": "Inglés profesional",
    "report_code": null,
    "hours": 68
  },
  {
    "cycle_id": 1,
    "cycle_name": "SMR primero",
    "module_id": 74,
    "module_name": "Itinerario personal para la empleabilidad I",
    "report_code": null,
    "hours": 100
  },
  {
    "cycle_id": 1,
    "cycle_name": "SMR primero",
    "module_id": 70,
    "module_name": "Montaje y mantenimiento de equipos",
    "report_code": null,
    "hours": 233
  },
  {
    "cycle_id": 1,
    "cycle_name": "SMR primero",
    "module_id": 73,
    "module_name": "Redes locales",
    "report_code": null,
    "hours": 233
  },
  {
    "cycle_id": 1,
    "cycle_name": "SMR primero",
    "module_id": 71,
    "module_name": "Sistemas operativos monopuesto",
    "report_code": null,
    "hours": 133
  },
  {
    "cycle_id": 2,
    "cycle_name": "SMR segundo",
    "module_id": 78,
    "module_name": "Aplicaciones web",
    "report_code": null,
    "hours": 100
  },
  {
    "cycle_id": 2,
    "cycle_name": "SMR segundo",
    "module_id": 82,
    "module_name": "Digitalización aplicada al sistema productivo",
    "report_code": null,
    "hours": 34
  },
  {
    "cycle_id": 2,
    "cycle_name": "SMR segundo",
    "module_id": 79,
    "module_name": "Itinerario personal para la empleabilidad II",
    "report_code": null,
    "hours": 100
  },
  {
    "cycle_id": 2,
    "cycle_name": "SMR segundo",
    "module_id": 80,
    "module_name": "Módulo optativo",
    "report_code": null,
    "hours": 100
  },
  {
    "cycle_id": 2,
    "cycle_name": "SMR segundo",
    "module_id": 83,
    "module_name": "Proyecto intermodular",
    "report_code": null,
    "hours": 66
  },
  {
    "cycle_id": 2,
    "cycle_name": "SMR segundo",
    "module_id": 76,
    "module_name": "Seguridad informática",
    "report_code": null,
    "hours": 133
  },
  {
    "cycle_id": 2,
    "cycle_name": "SMR segundo",
    "module_id": 77,
    "module_name": "Servicios en red",
    "report_code": null,
    "hours": 233
  },
  {
    "cycle_id": 2,
    "cycle_name": "SMR segundo",
    "module_id": 75,
    "module_name": "Sistemas operativos en red",
    "report_code": null,
    "hours": 200
  },
  {
    "cycle_id": 2,
    "cycle_name": "SMR segundo",
    "module_id": 81,
    "module_name": "Sostenibilidad aplicada al sistema productivo",
    "report_code": null,
    "hours": 34
  }
]
    }

}
