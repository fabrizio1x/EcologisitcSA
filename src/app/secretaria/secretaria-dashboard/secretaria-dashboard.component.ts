import { Component } from '@angular/core';

@Component({
  selector: 'app-secretaria-dashboard',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Dashboard Secretaria</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="logout()">
            <ion-icon name="log-out-outline"></ion-icon>
            Cerrar Sesión
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h1>Panel de Secretaria</h1>
      <p>Gestiona los pedidos y asigna rutas a los choferes.</p>
      
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Pedidos Pendientes</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item>
                    <ion-label>
                      <h2>Sin Asignar</h2>
                      <p>0 pedidos por asignar</p>
                    </ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-label>
                      <h2>En Proceso</h2>
                      <p>0 pedidos en proceso</p>
                    </ion-label>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
          </ion-col>
          
          <ion-col size="12" size-md="6">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Estado de Choferes</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item>
                    <ion-label>
                      <h2>Disponibles</h2>
                      <p>0 choferes disponibles</p>
                    </ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-label>
                      <h2>En Ruta</h2>
                      <p>0 choferes en ruta</p>
                    </ion-label>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
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
export class SecretariaDashboardComponent {
  constructor() {}

  logout() {
    // Implementar lógica de cierre de sesión
    console.log('Cerrando sesión...');
  }
} 