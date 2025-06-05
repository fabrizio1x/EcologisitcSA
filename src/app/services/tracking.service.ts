import { Injectable } from '@angular/core';
import { PedidoService } from './pedido.service';
import { Pedido } from '../interfaces/pedido.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TrackingService {
  constructor(
    private pedidoService: PedidoService,
    private router: Router
  ) {}

  async buscarPedido(numeroSeguimiento: string): Promise<{ success: boolean; message: string }> {
    if (!numeroSeguimiento || numeroSeguimiento.trim() === '') {
      return {
        success: false,
        message: 'Por favor ingresa un número de seguimiento'
      };
    }

    try {
      const pedido = await this.pedidoService.getPedidoPorSeguimiento(numeroSeguimiento);
      
      if (!pedido) {
        return {
          success: false,
          message: 'No encontramos envíos con esa Orden de Servicio o Número de pedido en nuestros sistemas'
        };
      }

      // Si se encuentra el pedido, navegar a la página de tracking
      this.router.navigate(['/tracking', numeroSeguimiento]);
      return {
        success: true,
        message: 'Pedido encontrado'
      };
    } catch (error) {
      console.error('Error al buscar pedido:', error);
      return {
        success: false,
        message: 'Ocurrió un error al buscar el pedido. Por favor intenta nuevamente.'
      };
    }
  }
} 