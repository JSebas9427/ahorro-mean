import { Routes } from '@angular/router';
import { Login } from './pages/login/login';

import { Proyecciones } from './pages/proyecciones/proyecciones';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'proyecciones',
    component: Proyecciones
  }
];