import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SolicitarDespachoComponent } from './solicitar-despacho.component';

const routes: Routes = [
  {
    path: '',
    component: SolicitarDespachoComponent
  }
];

@NgModule({
  declarations: [
    SolicitarDespachoComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class SolicitarDespachoModule { } 