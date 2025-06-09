import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PedidoService } from '../../services/pedido.service';
import { Pedido, EstadoPedido } from '../../interfaces/pedido.interface';
import * as L from 'leaflet';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
})
export class TrackingComponent implements OnInit {
  trackingNumber: string = '';
  pedido: Pedido | null = null;
  loading = true;
  error: string | null = null;
  currentYear = new Date().getFullYear();
  private map: L.Map | null = null;
  private markers: L.Marker[] = [];
  private polyline: L.Polyline | null = null;

  constructor(
    private route: ActivatedRoute,
    private pedidoService: PedidoService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.trackingNumber = params['id'];
        this.cargarPedido();
      } else {
        this.error = 'No se proporcionó un número de seguimiento.';
        this.loading = false;
      }
    });
  }

  private async cargarPedido() {
    if (!this.trackingNumber) {
      this.error = 'No se proporcionó un número de seguimiento.';
      this.loading = false;
      return;
    }

    try {
      console.log('Cargando pedido con número:', this.trackingNumber);
      this.loading = true;
      this.error = null;
      this.pedido = await this.pedidoService.getPedidoPorSeguimiento(this.trackingNumber);
      
      if (!this.pedido) {
        this.error = 'No se encontró el pedido con el número de seguimiento proporcionado.';
        console.log('No se encontró el pedido');
      } else {
        console.log('Pedido cargado exitosamente:', this.pedido);
        this.initMap(this.pedido);
      }
    } catch (error) {
      console.error('Error al cargar el pedido:', error);
      this.error = 'Ocurrió un error al cargar la información del pedido. Por favor intente nuevamente.';
    } finally {
      this.loading = false;
    }
  }

  getEstadoTexto(estado: EstadoPedido | undefined): string {
    if (!estado) return '';
    
    const estados: { [key in EstadoPedido]: string } = {
      'pendiente': 'Pendiente',
      'en_proceso': 'En Proceso',
      'en_ruta': 'En Ruta',
      'en_camino': 'En Camino',
      'entregado': 'Entregado',
      'no_recibido': 'No Recibido',
      'cancelado': 'Cancelado'
    };
    return estados[estado] || estado;
  }

  private initMap(pedido: Pedido) {
    setTimeout(() => {
      const mapContainer = document.getElementById('map');
      if (!mapContainer) {
        console.error('Contenedor del mapa no encontrado');
        return;
      }

      if (!this.map) {
        this.map = L.map('map').setView([-33.4489, -70.6693], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
      }

      // Limpiar marcadores y rutas existentes
      this.markers.forEach(marker => marker.remove());
      this.markers = [];
      if (this.polyline) {
        this.polyline.remove();
        this.polyline = null;
      }

      if (pedido.coordenadasOrigen && pedido.coordenadasDestino) {
        // Agregar marcador de origen
        const markerOrigen = L.marker(pedido.coordenadasOrigen)
          .bindPopup(`Origen: ${pedido.origen.direccion}`)
          .addTo(this.map);
        this.markers.push(markerOrigen);

        // Agregar marcador de destino
        const markerDestino = L.marker(pedido.coordenadasDestino)
          .bindPopup(`Destino: ${pedido.destino.direccion}`)
          .addTo(this.map);
        this.markers.push(markerDestino);

        // Dibujar ruta
        this.polyline = L.polyline([pedido.coordenadasOrigen, pedido.coordenadasDestino], {
          color: '#003828',
          weight: 3,
          opacity: 0.8
        }).addTo(this.map);

        // Ajustar vista para mostrar toda la ruta
        const group = L.featureGroup([...this.markers, this.polyline]);
        this.map.fitBounds(group.getBounds().pad(0.1));
      }
    }, 100);
  }
} 