import { Component } from '@angular/core';

@Component({
  selector: 'app-chofer-dashboard',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Dashboard Chofer</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="logout()">
            <ion-icon name="log-out-outline"></ion-icon>
            Cerrar Sesión
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h1>Panel de Chofer</h1>
      <p>Gestiona tus rutas y entregas asignadas.</p>
      
      <ion-card>
        <ion-card-header>
          <ion-card-title>Ruta Actual</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item>
              <ion-label>
                <h2>Estado</h2>
                <p>Sin ruta asignada</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label>
                <h2>Entregas Pendientes</h2>
                <p>0 entregas</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Resumen del Día</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item>
              <ion-label>
                <h2>Entregas Completadas</h2>
                <p>0 entregas</p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label>
                <h2>Kilómetros Recorridos</h2>
                <p>0 km</p>
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
    ion-card {
      margin-bottom: 1rem;
    }
  `]
})
export class ChoferDashboardComponent {
  constructor() {}

  logout() {
    // Implementar lógica de cierre de sesión
    console.log('Cerrando sesión...');
  }
} 