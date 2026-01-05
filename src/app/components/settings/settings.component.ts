import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

// Servicios
import { DatabaseService } from '../../services/database.service';
import { NavigatorService } from '../../services/navigation.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    InputNumberModule, 
    ToggleButtonModule, 
    PanelModule, 
    ButtonModule, 
    DividerModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  
  // Valores por defecto
  settings = {
    absencesLimit: 15,
    includeJustified: false
  };

  constructor(
    private dbService: DatabaseService,
    public navigator: NavigatorService,
    private messageService: MessageService
  ) {}

  async ngOnInit() {
    await this.loadSettings();
  }

  async loadSettings() {
    try {
        const savedSettings = await this.dbService.getSettings();
        if (savedSettings) {
            // Asignamos los valores recuperados al modelo del formulario
            this.settings = savedSettings;
        }
    } catch (error) {
        console.error("Error cargando ajustes:", error);
    }
  }

  async saveSettings() {
    
    try {
        await this.dbService.saveSettings(this.settings);
        // Opcional: mostrar un mensaje de éxito con Toast
        this.navigator.back();
    } catch (error) {
        console.error('Error al guardar ajustes:', error);
    }
  }
}