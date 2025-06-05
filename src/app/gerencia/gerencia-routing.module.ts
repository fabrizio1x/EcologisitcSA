import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GerenciaComponent } from './gerencia.component';

const routes: Routes = [
  {
    path: '',
    component: GerenciaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GerenciaRoutingModule { }
