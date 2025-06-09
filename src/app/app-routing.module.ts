import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { TrackingComponent } from './pages/tracking/tracking.component';
import { GerenciaComponent } from './gerencia/gerencia.component';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'cliente',
    loadChildren: () => import('./cliente/cliente.module').then(m => m.ClienteModule),
    canActivate: [AuthGuard],
    data: { roles: ['cliente'] }
  },
  {
    path: 'secretaria',
    loadChildren: () => import('./secretaria/secretaria.module').then(m => m.SecretariaModule),
    canActivate: [AuthGuard],
    data: { roles: ['secretaria'] }
  },
  {
    path: 'gerencia',
    loadChildren: () => import('./gerencia/gerencia.module').then(m => m.GerenciaModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['gerencia'] }
  },
  {
    path: 'chofer',
    loadChildren: () => import('./chofer/chofer.module').then(m => m.ChoferModule),
    canActivate: [AuthGuard],
    data: { roles: ['chofer'] }
  },
  {
    path: 'cotizar',
    loadChildren: () => import('./quote-delivery/quote-delivery.module').then(m => m.QuoteDeliveryModule)
  },
  {
    path: 'solicitar-despacho',
    loadChildren: () => import('./solicitar-despacho/solicitar-despacho.module').then(m => m.SolicitarDespachoModule)
  },
  {
    path: 'tracking/:id',
    component: TrackingComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
