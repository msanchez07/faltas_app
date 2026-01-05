import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';

// Servicios
import { NavigatorService } from '../../services/navigation.service';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-module-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    InputTextModule, 
    InputNumberModule, 
    ButtonModule, 
    PanelModule,
    TooltipModule
  ],
  templateUrl: './module-form.component.html'
})
export class ModuleFormComponent implements OnInit {
  moduleId: number | null = null;
  cycleId: number | null = null;
  
  // Datos del formulario
  moduleName: string = '';
  reportCode: string = '';
  hours: number = 0;
  
  isEditMode: boolean = false;

  constructor(
    private route: ActivatedRoute,
    public navigator: NavigatorService,
    private dbService: DatabaseService
  ) {}

  async ngOnInit() {
    const moduleIdParam = this.route.snapshot.paramMap.get('moduleId');
    const cycleIdParam = this.route.snapshot.paramMap.get('cycleId');

    if (moduleIdParam) {
      this.moduleId = +moduleIdParam;
      this.isEditMode = true;
      await this.loadModuleData();
    } else if (cycleIdParam) {
      this.cycleId = +cycleIdParam;
    }
  }

  async loadModuleData() {
    // Obtenemos la jerarquía completa para buscar el módulo específico
    const data = await this.dbService.getHierarchyData();
    
    // Buscamos en la lista plana el módulo que coincida con el ID
    const module = data.find(m => m.module_id === this.moduleId);
    
    if (module) {
      this.moduleName = module.module_name;
      this.reportCode = module.report_code || '';
      this.hours = module.hours || 0;
      this.cycleId = module.cycle_id;
    } else {
      console.error('No se ha encontrado el módulo en la base de datos');
    }
  }

  async save() {
    if (!this.moduleName) return;

    const payload = {
      id: this.moduleId,         // null si es nuevo
      cycle_id: this.cycleId,    // id del padre
      name: this.moduleName,
      report_code: this.reportCode,
      hours: this.hours
    };

    // Llamada real a Electron a través del servicio
    const res = await this.dbService.saveModule(payload);

    if (res.success) {
      this.navigator.back();
    } else {
      alert('Error al guardar el módulo en la base de datos');
    }
  }

}