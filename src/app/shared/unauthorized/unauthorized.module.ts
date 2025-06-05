import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { UnauthorizedComponent } from './unauthorized.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [UnauthorizedComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: UnauthorizedComponent
      }
    ])
  ]
})
export class UnauthorizedModule { } 