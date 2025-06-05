import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, catchError, of } from 'rxjs';
import { takeUntil, filter, tap, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { PedidoService } from '../services/pedido.service';
import { Pedido } from '../interfaces/pedido.interface';
import { Location } from '@angular/common';
import { TrackingService } from '../services/tracking.service';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit, OnDestroy {
  pedidosActivos$: Observable<Pedido[]> = of([]);
  historialPedidos$: Observable<Pedido[]> = of([]);
  numeroSeguimiento = '';
  pedidoBuscado: Pedido | null = null;
  private destroy$ = new Subject<void>();
  private isInitialCheck = true;

  // Propiedades del tooltip
  tooltipVisible = false;
  tooltipX = 0;
  tooltipY = 0;
  tooltipText = '';

  constructor(
    private authService: AuthService,
    private pedidoService: PedidoService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private trackingService: TrackingService,
    private clipboard: Clipboard
  ) {
    console.log('ClienteComponent constructor');
  }

  ngOnInit() {
    this.cargarPedidos();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private cargarPedidos() {
    this.pedidosActivos$ = this.pedidoService.getPedidosActivos().pipe(
      catchError(error => {
        console.error('Error al cargar pedidos activos:', error);
        return of([]);
      })
    );

    this.historialPedidos$ = this.pedidoService.getHistorialPedidos().pipe(
      catchError(error => {
        console.error('Error al cargar historial de pedidos:', error);
        return of([]);
      })
    );
  }

  async buscarPedido() {
    const result = await this.trackingService.buscarPedido(this.numeroSeguimiento);
    if (!result.success) {
      this.mostrarTooltip(result.message);
    }
  }

  verDetallePedido(pedido: Pedido) {
    console.log('Ver detalle del pedido:', pedido);
    this.router.navigate(['/tracking', pedido.numeroSeguimiento]);
  }

  irAlInicio() {
    this.router.navigate(['/']);
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/']);
    });
  }

  getEstadoTexto(estado: string): string {
    const estados: { [key: string]: string } = {
      'pendiente': 'Pendiente',
      'en_proceso': 'En Proceso',
      'en_ruta': 'En Ruta',
      'entregado': 'Entregado',
      'cancelado': 'Cancelado'
    };
    return estados[estado] || estado;
  }

  mostrarTooltip(mensaje: string) {
    this.tooltipText = mensaje;
    this.tooltipVisible = true;
    setTimeout(() => {
      this.tooltipVisible = false;
    }, 3000);
  }

  copiarYVerDetalle(pedido: Pedido) {
    // Copiar al portapapeles
    this.clipboard.copy(pedido.numeroSeguimiento);
    this.mostrarTooltip('Número de seguimiento copiado al portapapeles');
    
    // Navegar al detalle
    this.verDetallePedido(pedido);
  }
} 