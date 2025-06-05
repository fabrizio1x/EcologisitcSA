import { Component } from '@angular/core';
import { CotizacionService, Comuna, Tarifa } from '../services/cotizacion.service';

@Component({
  selector: 'app-quote-delivery',
  templateUrl: './quote-delivery.component.html',
  styleUrls: ['./quote-delivery.component.scss']
})
export class QuoteDeliveryComponent {
  selectedOrigin: string = '';
  selectedDestination: string = '';
  distancia: number = 0;
  preciosPuntoEcologistic?: Tarifa;
  preciosDomicilio?: Tarifa;
  mostrarPrecios: boolean = false;
  mostrarEjemplos: boolean = false;

  ejemplosTamanos: { [key: string]: { descripcion: string; peso: string; icono: string } } = {
    'xs': {
      descripcion: 'Documentos, sobres, pequeños accesorios',
      peso: 'Hasta 1 kg',
      icono: '📄 💳'
    },
    's': {
      descripcion: 'Cajas pequeñas, ropa, libros',
      peso: 'Hasta 3 kg',
      icono: '👕 📚'
    },
    'm': {
      descripcion: 'Cajas medianas, equipaje pequeño',
      peso: 'Hasta 10 kg',
      icono: '🧳 📦'
    },
    'l': {
      descripcion: 'Cajas grandes, equipaje grande',
      peso: 'Hasta 25 kg',
      icono: '🛄 📦'
    }
  };

  regiones: string[] = [];
  comunasPorRegion: { [key: string]: Comuna[] } = {};

  constructor(private cotizacionService: CotizacionService) {
    this.comunasPorRegion = this.cotizacionService.getComunasPorRegion();
    this.regiones = Object.keys(this.comunasPorRegion);
  }

  calcularCotizacion() {
    if (this.selectedOrigin && this.selectedDestination) {
      const origen = this.cotizacionService.getComuna(this.selectedOrigin);
      const destino = this.cotizacionService.getComuna(this.selectedDestination);

      if (origen && destino) {
        this.distancia = this.cotizacionService.calcularDistancia(origen, destino);
        this.preciosPuntoEcologistic = this.cotizacionService.calcularPrecios(this.distancia, 'puntoEcologistic');
        this.preciosDomicilio = this.cotizacionService.calcularPrecios(this.distancia, 'domicilio');
        this.mostrarPrecios = true;
      }
    }
  }

  toggleEjemplos() {
    this.mostrarEjemplos = !this.mostrarEjemplos;
  }

  formatearPrecio(precio: number): string {
    return `$${precio.toLocaleString('es-CL')}`;
  }
} 