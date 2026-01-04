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

// Servicio
import { NavigatorService } from '../../services/navigation.service';

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
})
export class CycleFormComponent implements OnInit {
  cycleId: number | null = null;
  cycleName: string = '';
  selectedYear: any = null;
  isEditMode: boolean = false;

  // Opciones para el select (usamos labels en minúsculas para facilitar la concatenación)
  years = [
    { label: 'primero', value: 'primero' },
    { label: 'segundo', value: 'segundo' },
    { label: 'Curso de especialización', value: 'especializacion' }
  ];

  private fakeDatabase = [
    {"id":1,"name":"SMR primero"},
    {"id":2,"name":"SMR segundo"},
    {"id":3,"name":"DAM primero"},
    {"id":4,"name":"DAM segundo"},
    {"id":9,"name":"Inteligencia Artificial y Big Data"}
  ];

  constructor(
    private route: ActivatedRoute,
    public navigator: NavigatorService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.cycleId = +idParam;
      this.isEditMode = true;
      this.loadData(this.cycleId);
    }
  }

  loadData(id: number) {
    const item = this.fakeDatabase.find(c => c.id === id);
    if (item) {
      if (item.name.endsWith('primero')) {
        this.cycleName = item.name.replace(' primero', '');
        this.selectedYear = this.years[0];
      } else if (item.name.endsWith('segundo')) {
        this.cycleName = item.name.replace(' segundo', '');
        this.selectedYear = this.years[1];
      } else {
        this.cycleName = item.name;
        this.selectedYear = this.years[2];
      }
    }
  }

  save() {
    if (!this.cycleName || !this.selectedYear) return;

    // LÓGICA DE CONCATENACIÓN SOLICITADA
    let finalName = '';
    
    if (this.selectedYear.value === 'especializacion') {
      // Si es curso de especialización, no se añade nada
      finalName = this.cycleName.trim();
    } else {
      // Si es primero o segundo, se añade el label en minúsculas
      // Usamos el valor del label que ya está en minúsculas
      finalName = `${this.cycleName.trim()} ${this.selectedYear.label}`;
    }
    

    this.navigator.back();
  }
}