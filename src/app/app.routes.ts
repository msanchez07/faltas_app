import { Routes } from '@angular/router';
import { MainComponent } from './components/main/main';
import { ReportComponent } from './components/report/report';

export const routes: Routes = [
  // 2. Esta línea dice: "Cuando la ruta esté vacía, carga MainComponent"
  { path: '', component: MainComponent },
  { path: 'report', component: ReportComponent },

  // Opcional: Redirigir cualquier ruta desconocida al inicio
  { path: '**', redirectTo: '' }
];
