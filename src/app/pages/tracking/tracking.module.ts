import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TrackingComponent } from './tracking.component';

@NgModule({
  declarations: [TrackingComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: TrackingComponent
      }
    ])
  ]
})
export class TrackingModule { } 