import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService, User } from '../auth/auth.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil, map, take } from 'rxjs/operators';
import { Location } from '@angular/common';
import { PedidoService } from '../services/pedido.service';
import { TrackingService } from '../services/tracking.service';
import { Pedido } from '../interfaces/pedido.interface';
import { EstadoPedido } from '../interfaces/pedido.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  currentUser$: Observable<User | null>;
  buttonText$: Observable<string>;
  private destroy$ = new Subject<void>();
  numeroSeguimiento: string = '';
  pedidoBuscado: Pedido | null = null;
  tooltipVisible = false;
  tooltipText = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private location: Location,
    private pedidoService: PedidoService,
    private trackingService: TrackingService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.buttonText$ = this.currentUser$.pipe(
      map(user => {
        if (!user) return '';
        switch (user.role) {
          case 'cliente': return 'Mis Pedidos';
          case 'secretaria':
          case 'gerencia': return 'Gestión';
          case 'chofer': return 'Panel';
          default: return '';
        }
      })
    );
  }

  ngOnInit() {
    console.log('HomeComponent inicializado');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToUserPanel() {
    this.currentUser$.pipe(
      take(1)
    ).subscribe((user: User | null) => {
      if (!user) return;
      
      switch (user.role) {
        case 'cliente':
          this.router.navigate(['/cliente']);
          break;
        case 'secretaria':
          this.router.navigate(['/secretaria']);
          break;
        case 'gerencia':
          this.router.navigate(['/gerencia']);
          break;
        case 'chofer':
          this.router.navigate(['/chofer']);
          break;
        default:
          console.error('Rol no válido:', user.role);
          break;
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/auth/login']);
  }

  async login() {
    this.router.navigate(['/auth/login']);
  }

  async register() {
    this.router.navigate(['/auth/register']);
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/']);
    });
  }

  async buscarPedido() {
    const result = await this.trackingService.buscarPedido(this.numeroSeguimiento);
    if (!result.success) {
      this.mostrarTooltip(result.message);
    }
  }

  getEstadoTexto(estado: EstadoPedido): string {
    switch (estado) {
      case 'pendiente': return 'Pendiente';
      case 'en_proceso': return 'En proceso';
      case 'en_ruta': return 'En ruta';
      case 'entregado': return 'Entregado';
      case 'cancelado': return 'Cancelado';
      default: return estado;
    }
  }

  mostrarTooltip(mensaje: string) {
    this.tooltipText = mensaje;
    this.tooltipVisible = true;
    setTimeout(() => {
      this.tooltipVisible = false;
    }, 3000);
  }
} 