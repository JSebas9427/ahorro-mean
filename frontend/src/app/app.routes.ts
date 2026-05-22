import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Proyecciones } from './pages/proyecciones/proyecciones';

export const routes: Routes = [

  {
    path: '',
    component: Login
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