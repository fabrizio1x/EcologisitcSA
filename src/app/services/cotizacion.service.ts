import { Injectable } from '@angular/core';

export interface Comuna {
  nombre: string;
  region: string;
  latitud: number;
  longitud: number;
}

export interface Tarifa {
  xs: number;
  s: number;
  m: number;
  l: number;
}

@Injectable({
  providedIn: 'root'
})
export class CotizacionService {
  private comunas: { [key: string]: Comuna } = {
    // Región Metropolitana (Santiago)
    'Santiago Centro': { nombre: 'Santiago Centro', region: 'Metropolitana', latitud: -33.45, longitud: -70.6667 },
    'Maipú': { nombre: 'Maipú', region: 'Metropolitana', latitud: -33.5167, longitud: -70.7667 },
    'Las Condes': { nombre: 'Las Condes', region: 'Metropolitana', latitud: -33.4167, longitud: -70.5833 },
    'Providencia': { nombre: 'Providencia', region: 'Metropolitana', latitud: -33.4333, longitud: -70.6167 },
    'Puente Alto': { nombre: 'Puente Alto', region: 'Metropolitana', latitud: -33.6167, longitud: -70.5667 },
    'Ñuñoa': { nombre: 'Ñuñoa', region: 'Metropolitana', latitud: -33.4667, longitud: -70.6167 },
    'San Bernardo': { nombre: 'San Bernardo', region: 'Metropolitana', latitud: -33.5833, longitud: -70.7167 },
    'La Florida': { nombre: 'La Florida', region: 'Metropolitana', latitud: -33.55, longitud: -70.5667 },
    'Recoleta': { nombre: 'Recoleta', region: 'Metropolitana', latitud: -33.4, longitud: -70.6333 },
    'Lo Barnechea': { nombre: 'Lo Barnechea', region: 'Metropolitana', latitud: -33.35, longitud: -70.5167 },
    // Región de Valparaíso
    'Valparaíso': { nombre: 'Valparaíso', region: 'Valparaíso', latitud: -33.0472, longitud: -71.6127 },
    'Viña del Mar': { nombre: 'Viña del Mar', region: 'Valparaíso', latitud: -33.0246, longitud: -71.5518 },
    'Quilpué': { nombre: 'Quilpué', region: 'Valparaíso', latitud: -33.0458, longitud: -71.4428 },
    'Villa Alemana': { nombre: 'Villa Alemana', region: 'Valparaíso', latitud: -33.0422, longitud: -71.3736 },
    'Concón': { nombre: 'Concón', region: 'Valparaíso', latitud: -32.9167, longitud: -71.5167 },
    'San Antonio': { nombre: 'San Antonio', region: 'Valparaíso', latitud: -33.5933, longitud: -71.6217 },
    'Quillota': { nombre: 'Quillota', region: 'Valparaíso', latitud: -32.8833, longitud: -71.25 },
    'La Calera': { nombre: 'La Calera', region: 'Valparaíso', latitud: -32.7833, longitud: -71.2 },
    'Limache': { nombre: 'Limache', region: 'Valparaíso', latitud: -33.0167, longitud: -71.2667 },
    'El Quisco': { nombre: 'El Quisco', region: 'Valparaíso', latitud: -33.4, longitud: -71.7 },
    // Región de La Araucanía (Temuco)
    'Temuco': { nombre: 'Temuco', region: 'La Araucanía', latitud: -38.7359, longitud: -72.5904 },
    'Padre Las Casas': { nombre: 'Padre Las Casas', region: 'La Araucanía', latitud: -38.7667, longitud: -72.5833 },
    'Lautaro': { nombre: 'Lautaro', region: 'La Araucanía', latitud: -38.5167, longitud: -72.45 },
    'Villarrica': { nombre: 'Villarrica', region: 'La Araucanía', latitud: -39.2856, longitud: -72.2272 },
    'Angol': { nombre: 'Angol', region: 'La Araucanía', latitud: -37.8, longitud: -72.7167 },
    'Nueva Imperial': { nombre: 'Nueva Imperial', region: 'La Araucanía', latitud: -38.75, longitud: -72.95 },
    'Pucón': { nombre: 'Pucón', region: 'La Araucanía', latitud: -39.2822, longitud: -71.9772 },
    'Gorbea': { nombre: 'Gorbea', region: 'La Araucanía', latitud: -39.1, longitud: -72.6833 },
    'Loncoche': { nombre: 'Loncoche', region: 'La Araucanía', latitud: -39.3667, longitud: -72.6333 },
    'Curacautín': { nombre: 'Curacautín', region: 'La Araucanía', latitud: -38.4333, longitud: -71.8833 },
  };

  private ejemplosTamanos: { [key: string]: { descripcion: string; peso: string; icono: string } } = {
    'xs': {
      descripcion: 'Documentos, sobres, pequeños accesorios',
      peso: 'Hasta 1 kg',
      icono: '📄 📱'
    },
    's': {
      descripcion: 'Cajas pequeñas, ropa, libros',
      peso: 'Hasta 3 kg',
      icono: '📦 👕'
    },
    'm': {
      descripcion: 'Cajas medianas, equipaje pequeño',
      peso: 'Hasta 10 kg',
      icono: '🧳 📦'
    },
    'l': {
      descripcion: 'Cajas grandes, equipaje grande',
      peso: 'Hasta 25 kg',
      icono: '📦 🛄'
    }
  };

  constructor() { }

  getComunasPorRegion(): { [key: string]: Comuna[] } {
    const regiones: { [key: string]: Comuna[] } = {};
    Object.values(this.comunas).forEach(comuna => {
      if (!regiones[comuna.region]) regiones[comuna.region] = [];
      regiones[comuna.region].push(comuna);
    });
    return regiones;
  }

  getComuna(nombre: string): Comuna | undefined {
    return this.comunas[nombre];
  }

  calcularDistancia(origen: Comuna, destino: Comuna): number {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = this.toRad(destino.latitud - origen.latitud);
    const dLon = this.toRad(destino.longitud - origen.longitud);
    const lat1 = this.toRad(origen.latitud);
    const lat2 = this.toRad(destino.latitud);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distancia = R * c;

    return Math.round(distancia);
  }

  private toRad(grados: number): number {
    return grados * Math.PI / 180;
  }

  calcularPrecios(distancia: number, tipo: 'puntoEcologistic' | 'domicilio'): Tarifa {
    const precioBase = tipo === 'puntoEcologistic' ? 3000 : 4500;
    const precioPorKm = tipo === 'puntoEcologistic' ? 100 : 150;

    const precioTotal = precioBase + (distancia * precioPorKm);

    return {
      xs: Math.round(precioTotal),
      s: Math.round(precioTotal * 1.5),
      m: Math.round(precioTotal * 2.5),
      l: Math.round(precioTotal * 4)
    };
  }

  getEjemplosTamanos() {
    return this.ejemplosTamanos;
  }
} 