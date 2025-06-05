import { Component, OnInit, OnDestroy } from '@angular/core';
import { PedidoService } from '../services/pedido.service';
import { ChoferService } from '../services/chofer.service';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { User } from '../auth/auth.service';
import { Pedido } from '../interfaces/pedido.interface';
import { AlertController, LoadingController } from '@ionic/angular';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-secretaria',
  templateUrl: './secretaria.component.html',
  styleUrls: ['./secretaria.component.scss']
})
export class SecretariaComponent implements OnInit, OnDestroy {
  pedidos: Pedido[] = [];
  choferes: User[] = [];
  private destroy$ = new Subject<void>();
  currentYear = new Date().getFullYear();
  loading = true;
  error: string | null = null;

  constructor(
    private pedidoService: PedidoService,
    private choferService: ChoferService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    console.log('SecretariaComponent: Constructor iniciado');
  }

  ngOnInit() {
    console.log('SecretariaComponent: ngOnInit iniciado');
    this.cargarDatos();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private convertirFecha(timestamp: any): Date {
    if (!timestamp) return new Date();
    
    try {
      // Si es un Timestamp de Firestore
      if (timestamp instanceof firebase.firestore.Timestamp) {
        return timestamp.toDate();
      }
      // Si es un objeto Date
      if (timestamp instanceof Date) {
        return timestamp;
      }
      // Si es un timestamp en segundos
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000);
      }
      // Si es un string o número
      return new Date(timestamp);
    } catch (error) {
      console.error('Error al convertir fecha:', error);
      return new Date();
    }
  }

  async cargarDatos() {
    try {
      this.loading = true;
      this.error = null;
      console.log('SecretariaComponent: Iniciando carga de datos');

      // Cargar pedidos
      this.pedidoService.getPedidos()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (pedidos) => {
            console.log('SecretariaComponent: Pedidos cargados:', pedidos);
            this.pedidos = pedidos.map(pedido => {
              // Convertir datos de Firebase a la estructura esperada
              const datosPersonales = (pedido as any).datosPersonales || {};
              
              const datosPaquete = {
                tamano: pedido.tamanoPaquete || pedido.datosPaquete?.tamano || '',
                peso: pedido.peso || pedido.datosPaquete?.peso || 0,
                descripcion: pedido.descripcion || pedido.datosPaquete?.descripcion || '',
                fragil: pedido.fragil || pedido.datosPaquete?.fragil || false,
                requiereEmbalaje: pedido.requiereEmbalaje || pedido.datosPaquete?.requiereEmbalaje || false
              };

              const origen = {
                direccion: pedido.direccionRetiro?.direccion || pedido.origen?.direccion || '',
                comuna: pedido.direccionRetiro?.comuna || pedido.origen?.comuna || '',
                region: pedido.direccionRetiro?.region || pedido.origen?.region || '',
                referencias: pedido.direccionRetiro?.referencias || pedido.origen?.referencias || ''
              };

              const destino = {
                direccion: pedido.direccionEntrega?.direccion || pedido.destino?.direccion || '',
                comuna: pedido.direccionEntrega?.comuna || pedido.destino?.comuna || '',
                region: pedido.direccionEntrega?.region || pedido.destino?.region || '',
                referencias: pedido.direccionEntrega?.referencias || pedido.destino?.referencias || ''
              };

              return {
                ...pedido,
                fechaCreacion: this.convertirFecha(pedido.fechaCreacion),
                clienteNombre: datosPersonales.nombre || pedido.clienteNombre || '',
                clienteEmail: datosPersonales.email || pedido.clienteEmail || '',
                datosPaquete,
                origen,
                destino
              };
            });
            console.log('SecretariaComponent: Pedidos procesados:', this.pedidos);
            this.loading = false;
          },
          error: (error) => {
            console.error('SecretariaComponent: Error al cargar pedidos:', error);
            this.error = 'Error al cargar los pedidos';
            this.loading = false;
          }
        });

      // Cargar choferes
      this.choferService.getChoferes()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (choferes) => {
            console.log('SecretariaComponent: Choferes cargados:', choferes);
            this.choferes = choferes;
          },
          error: (error) => {
            console.error('SecretariaComponent: Error al cargar choferes:', error);
          }
        });
    } catch (error) {
      console.error('SecretariaComponent: Error general:', error);
      this.error = 'Error al cargar los datos';
      this.loading = false;
    }
  }

  async asignarChofer(pedido: Pedido) {
    console.log('SecretariaComponent: Iniciando asignación de chofer para pedido:', pedido);
    
    if (!pedido.id) {
      console.error('El pedido no tiene ID');
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'No se puede asignar el chofer porque el pedido no tiene ID.',
        buttons: ['OK']
      });
      await errorAlert.present();
      return;
    }

    const pedidoId = pedido.id;

    const alert = await this.alertController.create({
      header: 'Asignar Chofer',
      inputs: this.choferes.map(chofer => ({
        name: 'chofer',
        type: 'radio',
        label: `${chofer.nombre} ${chofer.apellido}`,
        value: chofer.id
      })),
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Asignar',
          handler: async (choferId) => {
            if (!choferId) return;
            
            const loading = await this.loadingController.create({
              message: 'Asignando chofer...'
            });
            await loading.present();

            try {
              await this.choferService.asignarPedidoAChofer(pedidoId, choferId);
              console.log('SecretariaComponent: Chofer asignado correctamente');
            } catch (error) {
              console.error('SecretariaComponent: Error al asignar chofer:', error);
              const errorAlert = await this.alertController.create({
                header: 'Error',
                message: 'No se pudo asignar el chofer. Por favor, intente nuevamente.',
                buttons: ['OK']
              });
              await errorAlert.present();
            } finally {
              await loading.dismiss();
            }
          }
        }
      ]
    });

    await alert.present();
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

  getEstadoColor(estado: string): string {
    const colores: { [key: string]: string } = {
      'pendiente': 'warning',
      'en_proceso': 'primary',
      'en_ruta': 'tertiary',
      'entregado': 'success',
      'cancelado': 'danger'
    };
    return colores[estado] || 'medium';
  }
} 