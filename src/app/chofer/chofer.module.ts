import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ChoferRoutingModule } from './chofer-routing.module';
import { ChoferComponent } from './chofer.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ChoferComponent
  ],
  imports: [
    CommonModule,
    ChoferRoutingModule,
    SharedModule,
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChoferModule { }
