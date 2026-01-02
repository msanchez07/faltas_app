import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DatabaseService } from './services/database.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App  implements OnInit{
    protected readonly title = signal('faltas-app');

    items: MenuItem[] | undefined;

    constructor(private dbService: DatabaseService){}


    ngOnInit() {
        this.cargarDatos();
    }

    
    async cargarDatos() {
        // Angular detectará el cambio automáticamente tras el await
        let cycles = await this.dbService.getCycles();
        console.log('Ciclos cargados:', cycles);
    }

    
}
