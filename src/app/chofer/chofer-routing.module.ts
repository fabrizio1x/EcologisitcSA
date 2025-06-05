import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChoferComponent } from './chofer.component';

const routes: Routes = [
  {
    path: '',
    component: ChoferComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChoferRoutingModule { }
