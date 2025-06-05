import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { QuoteDeliveryComponent } from './quote-delivery.component';

const routes: Routes = [
  {
    path: '',
    component: QuoteDeliveryComponent
  }
];

@NgModule({
  declarations: [QuoteDeliveryComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class QuoteDeliveryModule { } 