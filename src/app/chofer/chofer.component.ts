import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { PedidoService } from '../services/pedido.service';
import { Pedido } from '../interfaces/pedido.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as L from 'leaflet';
import { COMUNAS_COORDS } from './comunas-coords';

@Component({
  selector: 'app-chofer',
  templateUrl: './chofer.component.html',
})
export class ChoferComponent implements OnInit, OnDestroy {
  pedidos: Pedido[] = [];
  loading = true;
  private destroy$ = new Subject<void>();
  private map: L.Map | null = null;
  private markers: L.Marker[] = [];
  private polylines: L.Polyline[] = [];

  constructor(
    private authService: AuthService,
    private pedidoService: PedidoService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      console.log('Usuario autenticado:', user);
      if (!user || user.role !== 'chofer') {
        this.router.navigate(['/login']);
        return;
      }
      const choferId = user.uid || user.id;
      this.cargarPedidos(choferId);
    });
  }

  cargarPedidos(choferId: string) {
    this.loading = true;
    this.pedidoService.getPedidosPorChofer(choferId).pipe(takeUntil(this.destroy$)).subscribe({
      next: pedidos => {
        // Asignar coordenadas aproximadas por comuna si no existen
        this.pedidos = pedidos.map(pedido => ({
          ...pedido,
          coordenadasOrigen: pedido.coordenadasOrigen || COMUNAS_COORDS[pedido.origen.comuna] || null,
          coordenadasDestino: pedido.coordenadasDestino || COMUNAS_COORDS[pedido.destino.comuna] || null,
        }));
        this.loading = false;
        setTimeout(() => this.initMap(), 200); // Espera a que el DOM esté listo
      },
      error: () => {
        this.pedidos = [];
        this.loading = false;
    }
    });
  }

  private initMap() {
    const mapContainer = document.getElementById('mapa-pedidos');
    if (!mapContainer) return;

    if (!this.map) {
      this.map = L.map('mapa-pedidos', {
        zoomControl: false,
        attributionControl: false
      }).setView([-33.45, -70.66], 6);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        minZoom: 3,
        maxZoom: 16
      }).addTo(this.map);
    }

    // Limpiar marcadores y rutas anteriores
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
    this.polylines.forEach(poly => poly.remove());
    this.polylines = [];

    // Agregar marcadores y rutas de pedidos
    const bounds: L.LatLngBounds = L.latLngBounds([]);
    for (const pedido of this.pedidos) {
      // Marcador de origen
      if (pedido.coordenadasOrigen && pedido.coordenadasOrigen.length === 2) {
        const marker = L.marker(pedido.coordenadasOrigen as [number, number], {
          title: pedido.numeroSeguimiento,
          icon: this.getMarkerIcon(pedido)
        })
        .bindPopup(`<b>${pedido.numeroSeguimiento}</b><br>Origen: ${pedido.origen.direccion}, ${pedido.origen.comuna}`)
          .addTo(this.map!);
        this.markers.push(marker);
        bounds.extend(marker.getLatLng());
      }
      // Marcador de destino
      if (pedido.coordenadasDestino && pedido.coordenadasDestino.length === 2) {
        const marker = L.marker(pedido.coordenadasDestino as [number, number], {
          title: pedido.numeroSeguimiento + ' (Destino)',
          icon: this.getMarkerIcon(pedido)
        })
        .bindPopup(`<b>${pedido.numeroSeguimiento}</b><br>Destino: ${pedido.destino.direccion}, ${pedido.destino.comuna}`)
          .addTo(this.map!);
        this.markers.push(marker);
        bounds.extend(marker.getLatLng());
      }
      // Simulación de ruta (línea entre origen y destino)
      if (
        pedido.coordenadasOrigen && pedido.coordenadasOrigen.length === 2 &&
        pedido.coordenadasDestino && pedido.coordenadasDestino.length === 2
      ) {
        const polyline = L.polyline([
          pedido.coordenadasOrigen as [number, number],
          pedido.coordenadasDestino as [number, number]
        ], {
          color: '#10b981',
          weight: 4,
          opacity: 0.7,
          dashArray: '8, 8'
        }).addTo(this.map!);
        this.polylines.push(polyline);
      }
    }
    if (this.markers.length > 0) {
      this.map!.fitBounds(bounds.pad(0.2));
    } else {
      this.map!.setView([-33.45, -70.66], 6);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  marcarEntregado(pedido: Pedido) {
    if (!pedido.id) return;
    this.pedidoService.actualizarEstadoPedido(pedido.id, 'entregado').then(() => {
      pedido.estado = 'entregado';
    });
  }

  getEstadoTexto(estado: string): string {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'en_proceso': return 'En Proceso';
      case 'en_ruta': return 'En Ruta';
      case 'entregado': return 'Entregado';
      case 'cancelado': return 'Cancelado';
      default: return estado.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
  }

  getMarkerIcon(pedido: Pedido): L.Icon {
    if (pedido.estado === 'pendiente') {
      return L.icon({
        iconUrl: 'assets/markers/marker-icon-2x-yellow.png',
        iconSize: [28, 42],
        iconAnchor: [14, 42],
        popupAnchor: [0, -36]
      });
    }
    if (pedido.estado === 'en_proceso' || pedido.estado === 'en_ruta') {
      return L.icon({
        iconUrl: 'assets/markers/marker-icon-2x-green.png',
        iconSize: [28, 42],
        iconAnchor: [14, 42],
        popupAnchor: [0, -36]
      });
    }
    if (pedido.estado === 'entregado') {
      return L.icon({
        iconUrl: 'assets/markers/marker-icon-2x-grey.png',
        iconSize: [28, 42],
        iconAnchor: [14, 42],
        popupAnchor: [0, -36]
      });
    }
    if (pedido.estado === 'cancelado') {
      return L.icon({
        iconUrl: 'assets/markers/marker-icon-2x-red.png',
        iconSize: [28, 42],
        iconAnchor: [14, 42],
        popupAnchor: [0, -36]
      });
    }
    // Default
    return L.icon({
      iconUrl: 'assets/markers/marker-icon-2x-green.png',
      iconSize: [28, 42],
      iconAnchor: [14, 42],
      popupAnchor: [0, -36]
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
} 