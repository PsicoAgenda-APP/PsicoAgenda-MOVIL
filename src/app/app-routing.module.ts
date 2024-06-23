import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full'
  },
  {
    path: 'start',
    loadChildren: () => import('./pages/start/start.module').then( m => m.StartPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'cliente',
    loadChildren: () => import('./pages/cliente/cliente.module').then( m => m.ClientePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'psicologo',
    loadChildren: () => import('./pages/psicologo/psicologo.module').then( m => m.PsicologoPageModule)
  },
  {
    path: 'busqueda',
    loadChildren: () => import('./pages/busqueda/busqueda.module').then( m => m.BusquedaPageModule)
  },
  {
    path: 'calendario',
    loadChildren: () => import('./pages/calendario/calendario.module').then( m => m.CalendarioPageModule)
  },
  {
    path: 'commitpay',
    loadChildren: () => import('./pages/commitpay/commitpay.module').then( m => m.CommitpayPageModule)
  },
  {
    path: 'soportepaciente',
    loadChildren: () => import('./pages/soportepaciente/soportepaciente.module').then( m => m.SoportepacientePageModule)
  },
  {
    path: 'fichapsicologo',
    loadChildren: () => import('./pages/fichapsicologo/fichapsicologo.module').then( m => m.FichapsicologoPageModule)
  },
  {
    path: 'atencionespaciente',
    loadChildren: () => import('./pages/atencionespaciente/atencionespaciente.module').then( m => m.AtencionespacientePageModule)
  },
  {
    path: 'historialpsicologo',
    loadChildren: () => import('./pages/historialpsicologo/historialpsicologo.module').then( m => m.HistorialpsicologoPageModule)
  },
  {
    path: 'editarpsicologo',
    loadChildren: () => import('./pages/editarpsicologo/editarpsicologo.module').then( m => m.EditarpsicologoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
