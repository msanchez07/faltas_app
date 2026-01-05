import { Routes } from '@angular/router';
import { ReportComponent } from './components/report/report';
import { DatabaseComponent } from './components/database/database.component';
import { CycleFormComponent } from './components/cycle-form/cycle-form.component';
import { ModuleFormComponent } from './components/module-form/module-form.component';
import { SettingsComponent } from './components/settings/settings.component';


export const routes: Routes = [
  // 2. Esta línea dice: "Cuando la ruta esté vacía, carga MainComponent"
  { path: '', component: ReportComponent },
  { path: 'database', component: DatabaseComponent },
  { path: 'ciclos/nuevo', component: CycleFormComponent },
  { path: 'ciclos/editar/:id', component: CycleFormComponent },
  { path: 'modulos/nuevo/:cycleId', component: ModuleFormComponent },
  { path: 'modulos/editar/:moduleId', component: ModuleFormComponent },
  { path: 'settings', component: SettingsComponent },
  // Opcional: Redirigir cualquier ruta desconocida al inicio
  { path: '**', redirectTo: '' }
];
