import { Routes } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { DashboardService } from './dashboard.service';

export const dashboardRoutes: Routes = [
  {
    path: '',
    providers: [provideCharts(withDefaultRegisterables()), DashboardService],
    loadComponent: () => import('./dashboard.component').then((m) => m.DashboardComponent),
  },
];
