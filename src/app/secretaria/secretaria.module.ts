import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SecretariaRoutingModule } from './secretaria-routing.module';
import { SecretariaComponent } from './secretaria.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    SecretariaComponent
  ],
  imports: [
    CommonModule,
    SecretariaRoutingModule,
    SharedModule,
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SecretariaModule { }
