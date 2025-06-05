import { Component } from '@angular/core';

@Component({
  selector: 'app-gerencia-dashboard',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Dashboard Gerencia</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="logout()">
            <ion-icon name="log-out-outline"></ion-icon>
            Cerrar Sesión
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <h1>Panel de Gerencia</h1>
      <p>Monitorea el rendimiento general de la empresa.</p>
      
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-md="6">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Resumen Operacional</ion-card-title>
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
                      <p>0 pedidos este mes</p>
                    </ion-label>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
          </ion-col>
          
          <ion-col size="12" size-md="6">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Recursos</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item>
                    <ion-label>
                      <h2>Vehículos Activos</h2>
                      <p>0 vehículos en ruta</p>
                    </ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-label>
                      <h2>Personal Activo</h2>
                      <p>0 empleados en turno</p>
                    </ion-label>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col size="12">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Indicadores de Rendimiento</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item>
                    <ion-label>
                      <h2>Eficiencia de Entregas</h2>
                      <p>0% de entregas a tiempo</p>
                    </ion-label>
                  </ion-item>
                  <ion-item>
                    <ion-label>
                      <h2>Satisfacción del Cliente</h2>
                      <p>No hay datos disponibles</p>
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
export class GerenciaDashboardComponent {
  constructor() {}

  logout() {
    // Implementar lógica de cierre de sesión
    console.log('Cerrando sesión...');
  }
} 