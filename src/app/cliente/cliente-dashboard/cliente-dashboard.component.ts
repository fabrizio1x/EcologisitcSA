import { Component } from '@angular/core';

@Component({
  selector: 'app-cliente-dashboard',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Dashboard Cliente</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="logout()">
            <ion-icon name="log-out-outline"></ion-icon>
            Cerrar Sesión
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h1>Bienvenido al Panel de Cliente</h1>
      <p>Aquí podrás gestionar tus pedidos y ver su estado.</p>
      
      <ion-card>
        <ion-card-header>
          <ion-card-title>Resumen</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item>
              <ion-label>
                <h2>Pedidos Activos</h2>
                <p>0 pedidos en proceso</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label>
                <h2>Pedidos Completados</h2>
                <p>0 pedidos finalizados</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>
  `,
  styles: [`
    ion-content {
      --background: var(--ion-color-light);
    }
    h1 {
      color: var(--ion-color-primary);
      margin-bottom: 1rem;
    }
  `]
})
export class ClienteDashboardComponent {
  constructor() {}

  logout() {
    // Implementar lógica de cierre de sesión
    console.log('Cerrando sesión...');
  }
} 