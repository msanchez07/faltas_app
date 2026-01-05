import { NavigationExtras, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class NavigatorService {
    constructor(private router: Router, private location: Location) {}
    
    navigateReport(){
        this.router.navigate(['report']);
    }

    navigateDatabase(){
        this.router.navigate(['database']);
    }

    // Nuevo: Navegación a la creación
    navigateNewCycle() {
        this.router.navigate(['ciclos/nuevo']);
    }

    // Nuevo: Navegación a la edición con ID
    navigateEditCycle(id: number) {
        this.router.navigate(['ciclos/editar', id]);
    }

    navigateNewModule(cycleId: number) {
        this.router.navigate(['modulos/nuevo', cycleId]);
    }

    navigateEditModule(moduleId: number) {
        this.router.navigate(['modulos/editar', moduleId]);
    }

    navigateSettings() {
        this.router.navigate(['/settings']);
    }

    back(){
        this.location.back();
    }
}