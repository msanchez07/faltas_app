import { Routes } from '@angular/router';
import { ReportComponent } from './components/report/report';
import { DatabaseComponent } from './components/database/database.component';
import { CycleFormComponent } from './components/cycle-form/cycle-form.component';


export const routes: Routes = [
  // 2. Esta línea dice: "Cuando la ruta esté vacía, carga MainComponent"
  { path: '', component: ReportComponent },
  { path: 'database', component: DatabaseComponent },
  { path: 'ciclos/nuevo', component: CycleFormComponent },
  { path: 'ciclos/editar/:id', component: CycleFormComponent },
  // Opcional: Redirigir cualquier ruta desconocida al inicio
  { path: '**', redirectTo: '' }
];
