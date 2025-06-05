import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GerenciaRoutingModule } from './gerencia-routing.module';
import { GerenciaComponent } from './gerencia.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    GerenciaComponent
  ],
  imports: [
    CommonModule,
    GerenciaRoutingModule,
    SharedModule,
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GerenciaModule { }
