import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

// PrimeNG
import { SelectModule } from 'primeng/select'; 
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';

// Servicios
import { NavigatorService } from '../../services/navigation.service';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-cycle-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    SelectModule, 
    InputTextModule, 
    ButtonModule, 
    PanelModule, 
    TooltipModule
  ],
  templateUrl: './cycle-form.component.html',
  styleUrls: ['./cycle-form.component.css']
})
export class CycleFormComponent implements OnInit {
  cycleId: number | null = null;
  cycleName: string = '';
  selectedYear: any = null;
  isEditMode: boolean = false;

  years = [
    { label: 'primero', value: 'primero' },
    { label: 'segundo', value: 'segundo' },
    { label: 'Curso de especialización', value: 'especializacion' }
  ];

  constructor(
    private route: ActivatedRoute,
    public navigator: NavigatorService,
    private dbService: DatabaseService // Inyectamos el servicio
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.cycleId = +idParam;
      this.isEditMode = true;
      this.loadData(this.cycleId);
    }
  }

  async loadData(id: number) {
    // Obtenemos todos los ciclos de la DB
    const cycles = await this.dbService.getCycles();
    // Buscamos el que corresponde al ID (nota: en tu getCycles el id viene como 'code')
    const item = cycles.find(c => c.code === id);

    if (item) {
      // Aplicamos la lógica para separar el nombre del curso
      if (item.name.endsWith(' primero')) {
        this.cycleName = item.name.replace(' primero', '');
        this.selectedYear = this.years[0];
      } else if (item.name.endsWith(' segundo')) {
        this.cycleName = item.name.replace(' segundo', '');
        this.selectedYear = this.years[1];
      } else {
        this.cycleName = item.name;
        this.selectedYear = this.years[2];
      }
    }
  }

  async save() {
    if (!this.cycleName || !this.selectedYear) return;

    let finalName = '';
    
    if (this.selectedYear.value === 'especializacion') {
      finalName = this.cycleName.trim();
    } else {
      finalName = `${this.cycleName.trim()} ${this.selectedYear.label}`;
    }
    
    // Llamada real al servicio
    const res = await this.dbService.saveCycle(finalName, this.cycleId);
    
    if (res.success) {
      this.navigator.back();
    } else {
      console.error('Error al guardar el ciclo');
    }
  }

}