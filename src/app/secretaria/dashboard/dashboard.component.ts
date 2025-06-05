import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-secretaria-dashboard',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Panel de Secretaria</ion-title>
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
          <ion-col size="12" size-md="8">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Pedidos Pendientes de Asignación</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item *ngFor="let pedido of pedidosPendientes">
                    <ion-label>
                      <h2>Pedido #{{pedido.id}}</h2>
                      <p>Cliente: {{pedido.cliente}}</p>
                      <p>Destino: {{pedido.destino}}</p>
                      <p>Fecha: {{pedido.fecha}}</p>
                    </ion-label>
                    <ion-button slot="end" (click)="asignarChofer(pedido.id)">
                      Asignar Chofer
                    </ion-button>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size="12" size-md="4">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Resumen</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-list>
                  <ion-item>
                    <ion-label>Pedidos Pendientes</ion-label>
                    <ion-badge color="warning" slot="end">{{pedidosPendientes.length}}</ion-badge>
                  </ion-item>
                  <ion-item>
                    <ion-label>En Tránsito</ion-label>
                    <ion-badge color="primary" slot="end">{{pedidosEnTransito}}</ion-badge>
                  </ion-item>
                  <ion-item>
                    <ion-label>Entregados Hoy</ion-label>
                    <ion-badge color="success" slot="end">{{pedidosEntregadosHoy}}</ion-badge>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>

            <ion-card>
              <ion-card-header>
                <ion-card-title>Acciones Rápidas</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-button expand="block" (click)="verChoferes()">
                  <ion-icon name="people-outline" slot="start"></ion-icon>
                  Ver Choferes Disponibles
                </ion-button>
                <ion-button expand="block" color="secondary" (click)="verReportes()">
                  <ion-icon name="bar-chart-outline" slot="start"></ion-icon>
                  Reportes Diarios
                </ion-button>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  `
})
export class DashboardComponent implements OnInit {
  pedidosPendientes = [
    { 
      id: '003', 
      cliente: 'Juan Pérez', 
      destino: 'Las Condes 789, Santiago',
      fecha: '2024-03-20'
    },
    { 
      id: '004', 
      cliente: 'María Silva', 
      destino: 'Vitacura 456, Santiago',
      fecha: '2024-03-20'
    }
  ];

  pedidosEnTransito = 5;
  pedidosEntregadosHoy = 12;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Aquí cargaríamos los datos iniciales
  }

  asignarChofer(pedidoId: string) {
    this.router.navigate(['/secretaria/asignar-chofer', pedidoId]);
  }

  verChoferes() {
    this.router.navigate(['/secretaria/choferes']);
  }

  verReportes() {
    this.router.navigate(['/secretaria/reportes']);
  }

  async cerrarSesion() {
    await this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
} 