import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chofer-dashboard',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Panel de Chofer</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cerrarSesion()">
            <ion-icon name="log-out-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-grid>
        <ion-row>
          <ion-col size="12">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Ruta Actual</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <div class="mapa-placeholder">
                  <!-- Aquí irá el mapa de Google Maps -->
                  <ion-img src="assets/map-placeholder.png"></ion-img>
                </div>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size="12">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Pedidos Asignados</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item *ngFor="let pedido of pedidosAsignados">
                    <ion-label>
                      <h2>Pedido #{{pedido.id}}</h2>
                      <p>Destino: {{pedido.destino}}</p>
                      <p>Cliente: {{pedido.cliente}}</p>
                      <p>Hora estimada: {{pedido.horaEstimada}}</p>
                    </ion-label>
                    <ion-button 
                      slot="end" 
                      color="success" 
                      (click)="marcarEntregado(pedido.id)"
                      *ngIf="pedido.estado === 'en_ruta'">
                      Marcar Entregado
                    </ion-button>
                    <ion-badge 
                      slot="end" 
                      color="success" 
                      *ngIf="pedido.estado === 'entregado'">
                      Entregado
                    </ion-badge>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size="12">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Estado Actual</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item>
                    <ion-label>Pedidos Pendientes</ion-label>
                    <ion-badge color="warning" slot="end">{{pedidosPendientes}}</ion-badge>
                  </ion-item>
                  <ion-item>
                    <ion-label>Pedidos Entregados</ion-label>
                    <ion-badge color="success" slot="end">{{pedidosEntregados}}</ion-badge>
                  </ion-item>
                  <ion-item>
                    <ion-label>Kilómetros Recorridos</ion-label>
                    <ion-note slot="end">{{kilometrosRecorridos}} km</ion-note>
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
    .mapa-placeholder {
      width: 100%;
      height: 200px;
      background-color: #f4f4f4;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class DashboardComponent implements OnInit {
  pedidosAsignados = [
    {
      id: '005',
      destino: 'Ñuñoa 123, Santiago',
      cliente: 'Pedro González',
      horaEstimada: '14:30',
      estado: 'en_ruta'
    },
    {
      id: '006',
      destino: 'Macul 456, Santiago',
      cliente: 'Ana López',
      horaEstimada: '15:15',
      estado: 'en_ruta'
    }
  ];

  pedidosPendientes = 2;
  pedidosEntregados = 3;
  kilometrosRecorridos = 45.5;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Aquí cargaríamos los datos iniciales y la ubicación del chofer
  }

  marcarEntregado(pedidoId: string) {
    // Aquí se implementaría la lógica para marcar como entregado
    const pedido = this.pedidosAsignados.find(p => p.id === pedidoId);
    if (pedido) {
      pedido.estado = 'entregado';
      this.pedidosPendientes--;
      this.pedidosEntregados++;
    }
  }

  async cerrarSesion() {
    await this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
} 