import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ClienteComponent } from './cliente.component';
import { PedidoService } from '../services/pedido.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ClienteRoutingModule } from './cliente-routing.module';

@NgModule({
  declarations: [
    ClienteComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    AngularFirestoreModule,
    ClipboardModule,
    ClienteRoutingModule
  ],
  providers: [
    PedidoService,
    AuthService
  ]
})
export class ClienteModule { }
