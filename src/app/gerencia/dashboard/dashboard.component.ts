import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-gerencia-dashboard',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Panel de Gerencia</ion-title>
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
          <ion-col size="12" size-md="6">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Resumen Operacional</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <canvas #operationalChart></canvas>
                <ion-list>
                  <ion-item>
                    <ion-label>Total Pedidos Hoy</ion-label>
                    <ion-badge color="primary" slot="end">{{estadisticas.pedidosHoy}}</ion-badge>
                  </ion-item>
                  <ion-item>
                    <ion-label>Pedidos Completados</ion-label>
                    <ion-badge color="success" slot="end">{{estadisticas.pedidosCompletados}}</ion-badge>
                  </ion-item>
                  <ion-item>
                    <ion-label>Pedidos en Tránsito</ion-label>
                    <ion-badge color="warning" slot="end">{{estadisticas.pedidosEnTransito}}</ion-badge>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size="12" size-md="6">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Eficiencia de Flota</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <canvas #fleetChart></canvas>
                <ion-list>
                  <ion-item>
                    <ion-label>Vehículos Activos</ion-label>
                    <ion-badge color="primary" slot="end">{{estadisticas.vehiculosActivos}}</ion-badge>
                  </ion-item>
                  <ion-item>
                    <ion-label>Km Totales Recorridos</ion-label>
                    <ion-note slot="end">{{estadisticas.kmRecorridos}} km</ion-note>
                  </ion-item>
                  <ion-item>
                    <ion-label>Consumo Promedio</ion-label>
                    <ion-note slot="end">{{estadisticas.consumoPromedio}} kWh/km</ion-note>
                  </ion-item>
                </ion-list>
              </ion-card-content>
            </ion-card>
          </ion-col>

          <ion-col size="12">
            <ion-card>
              <ion-card-header>
                <ion-card-title>Acciones Rápidas</ion-card-title>
              </ion-card-header>
              <ion-card-content>
                <ion-grid>
                  <ion-row>
                    <ion-col size="6">
                      <ion-button expand="block" (click)="verReporteDetallado()">
                        <ion-icon name="document-text-outline" slot="start"></ion-icon>
                        Reporte Detallado
                      </ion-button>
                    </ion-col>
                    <ion-col size="6">
                      <ion-button expand="block" color="secondary" (click)="verEstadisticasFlota()">
                        <ion-icon name="car-outline" slot="start"></ion-icon>
                        Estado de Flota
                      </ion-button>
                    </ion-col>
                    <ion-col size="6">
                      <ion-button expand="block" color="tertiary" (click)="verRendimientoChoferes()">
                        <ion-icon name="people-outline" slot="start"></ion-icon>
                        Rendimiento Choferes
                      </ion-button>
                    </ion-col>
                    <ion-col size="6">
                      <ion-button expand="block" color="success" (click)="exportarDatos()">
                        <ion-icon name="download-outline" slot="start"></ion-icon>
                        Exportar Datos
                      </ion-button>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </ion-card-content>
            </ion-card>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  `
})
export class DashboardComponent implements OnInit {
  estadisticas = {
    pedidosHoy: 45,
    pedidosCompletados: 32,
    pedidosEnTransito: 13,
    vehiculosActivos: 8,
    kmRecorridos: 450.5,
    consumoPromedio: 0.15
  };

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Aquí cargaríamos los datos iniciales y configuramos los gráficos
  }

  verReporteDetallado() {
    this.router.navigate(['/gerencia/reportes/detallado']);
  }

  verEstadisticasFlota() {
    this.router.navigate(['/gerencia/flota/estadisticas']);
  }

  verRendimientoChoferes() {
    this.router.navigate(['/gerencia/choferes/rendimiento']);
  }

  exportarDatos() {
    // Aquí implementaríamos la lógica para exportar datos
    console.log('Exportando datos...');
  }

  async cerrarSesion() {
    await this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
} 