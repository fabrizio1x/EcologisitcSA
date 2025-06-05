import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
import { Observable, throwError, from, of } from 'rxjs';
import { map, switchMap, take, tap, catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { firstValueFrom } from 'rxjs';
import firebase from 'firebase/compat/app';
import { Pedido, EstadoPedido } from '../interfaces/pedido.interface';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  private mapearPedido(id: string, data: DocumentData): Pedido {
    console.log('Mapeando pedido con datos:', JSON.stringify(data, null, 2));
    
    try {
      const fechaCreacion = this.convertirFecha(data['fechaCreacion']);
      const datosPersonales = data['datosPersonales'] || {};
      
      const pedido: Pedido = {
        id,
        numeroSeguimiento: data['numeroSeguimiento'] || '',
        clienteId: data['clienteId'] || data['userId'] || '',
        clienteEmail: datosPersonales.email || data['clienteEmail'] || '',
        clienteNombre: datosPersonales.nombre || data['clienteNombre'] || '',
        estado: (data['estado'] as EstadoPedido) || 'pendiente',
        fechaCreacion,
        origen: {
          direccion: data['direccionRetiro']?.direccion || '',
          comuna: data['direccionRetiro']?.comuna || '',
          region: data['direccionRetiro']?.region || '',
          referencias: data['direccionRetiro']?.referencias || ''
        },
        destino: {
          direccion: data['direccionEntrega']?.direccion || '',
          comuna: data['direccionEntrega']?.comuna || '',
          region: data['direccionEntrega']?.region || '',
          referencias: data['direccionEntrega']?.referencias || ''
        },
        datosPaquete: {
          tamano: data['datosPaquete']?.tamano || '',
          peso: Number(data['datosPaquete']?.peso) || 0,
          descripcion: data['datosPaquete']?.descripcion || '',
          fragil: Boolean(data['datosPaquete']?.fragil),
          requiereEmbalaje: Boolean(data['datosPaquete']?.requiereEmbalaje)
        },
        choferId: data['choferId'] || ''
      };

      console.log('Pedido mapeado final:', JSON.stringify(pedido, null, 2));
      return pedido;
    } catch (error) {
      console.error('Error al mapear pedido:', error);
      throw error;
    }
  }

  private convertirFecha(data: any): Date {
    console.log('Convirtiendo fecha:', data);
    
    if (!data) {
      console.log('No hay fecha, retornando fecha actual');
      return new Date();
    }
    
    try {
      // Si es un Timestamp de Firestore
      if (data && typeof data === 'object' && 'toDate' in data) {
        console.log('Convirtiendo Timestamp de Firestore');
        return data.toDate();
      }
      
      // Si es un objeto Date
      if (data instanceof Date) {
        console.log('Ya es un objeto Date');
        return data;
      }
      
      // Si es un timestamp en segundos
      if (typeof data === 'object' && 'seconds' in data) {
        console.log('Convirtiendo timestamp en segundos');
        return new Date(data.seconds * 1000);
      }
      
      // Si es un string o número
      console.log('Convirtiendo string o número');
      return new Date(data);
    } catch (error) {
      console.error('Error al convertir fecha:', error);
      return new Date();
    }
  }

  // Generar número de seguimiento único
  private generarNumeroSeguimiento(): string {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ECO-${año}${mes}-${random}`;
  }

  // Crear nuevo pedido
  async crearPedido(pedidoData: Omit<Pedido, 'id' | 'numeroSeguimiento' | 'clienteId' | 'fechaCreacion' | 'estado'>): Promise<string> {
    const user = await firstValueFrom(this.authService.currentUser$);
    if (!user) throw new Error('Usuario no autenticado');

    const pedido: Omit<Pedido, 'id'> = {
      ...pedidoData,
      numeroSeguimiento: this.generarNumeroSeguimiento(),
      clienteId: user.id,
      clienteEmail: user.email,
      clienteNombre: `${user.nombre} ${user.apellido || ''}`.trim(),
      fechaCreacion: new Date(),
      estado: 'pendiente'
    };

    try {
      await this.firestore.collection('pedidos').add({
        ...pedido,
        fechaCreacion: firebase.firestore.Timestamp.fromDate(pedido.fechaCreacion)
      });
      return pedido.numeroSeguimiento;
    } catch (error) {
      console.error('Error al crear pedido:', error);
      throw error;
    }
  }

  // Obtener pedidos activos del cliente actual
  getPedidosActivos(): Observable<Pedido[]> {
    console.log('Iniciando getPedidosActivos');
    
    return this.authService.getCurrentUser().pipe(
      take(1),
      tap(user => console.log('Estado del usuario en getPedidosActivos:', user)),
      switchMap(user => {
        if (!user) {
          console.log('No hay usuario autenticado');
          return throwError(() => new Error('Usuario no autenticado'));
        }
        
        console.log('Consultando pedidos para usuario:', user.id);
        return this.firestore.collection<DocumentData>('pedidos', ref => {
          const query = ref
            .where('clienteId', '==', user.id)
            .where('estado', 'in', ['pendiente', 'en_proceso', 'en_ruta']);
          
          console.log('Query configurada para clienteId:', user.id);
          return query;
        }).snapshotChanges().pipe(
          tap(actions => console.log('Número de documentos encontrados:', actions.length)),
          map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              console.log('Documento encontrado ->', 'ID:', id, 'Data:', JSON.stringify(data, null, 2));
              return this.mapearPedido(id, data);
            });
          })
        );
      })
    );
  }

  // Obtener historial de pedidos del cliente actual
  getHistorialPedidos(): Observable<Pedido[]> {
    console.log('Iniciando getHistorialPedidos');
    
    return this.authService.currentUser$.pipe(
      take(1),
      tap(user => console.log('Estado del usuario en getHistorialPedidos:', user)),
      switchMap(user => {
        if (!user) {
          console.log('No hay usuario autenticado');
          return throwError(() => new Error('Usuario no autenticado'));
        }
        
        console.log('Consultando historial para usuario:', user.id);
        return this.firestore.collection<DocumentData>('pedidos', ref => {
          const query = ref
            .where('clienteId', '==', user.id)
            .where('estado', 'in', ['entregado', 'cancelado'])
            .orderBy('fechaCreacion', 'desc');
          console.log('Query configurada:', { clienteId: user.id });
          return query;
        }).snapshotChanges().pipe(
          tap(actions => console.log('Documentos encontrados:', actions.length)),
          map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data();
              const id = a.payload.doc.id;
              console.log('Procesando documento:', { id, ...data });
              return this.mapearPedido(id, data);
            });
          }),
          tap(pedidos => console.log('Total de pedidos procesados:', pedidos.length))
        );
      })
    );
  }

  // Buscar pedido por número de seguimiento
  async getPedidoPorSeguimiento(numeroSeguimiento: string): Promise<Pedido | null> {
    try {
      console.log('Buscando pedido con número:', numeroSeguimiento);
      const querySnapshot = await firstValueFrom(
        this.firestore
          .collection<DocumentData>('pedidos', ref => 
            ref.where('numeroSeguimiento', '==', numeroSeguimiento)
          )
          .get()
      );

      if (querySnapshot.empty) {
        console.log('No se encontró el pedido');
        return null;
      }

      const doc = querySnapshot.docs[0];
      const data = doc.data();
      
      console.log('Datos crudos del pedido encontrado:', JSON.stringify(data, null, 2));

      if (!data) {
        console.error('No se encontraron datos del pedido');
        return null;
      }

      const pedidoMapeado = this.mapearPedido(doc.id, data);
      console.log('Pedido mapeado:', JSON.stringify(pedidoMapeado, null, 2));
      return pedidoMapeado;
    } catch (error) {
      console.error('Error al buscar pedido:', error);
      throw error;
    }
  }

  // Guardar pedido temporal en localStorage
  guardarPedidoTemporal(pedidoData: any): void {
    localStorage.setItem('pedidoTemporal', JSON.stringify(pedidoData));
  }

  // Obtener pedido temporal de localStorage
  obtenerPedidoTemporal(): any {
    const pedidoTemp = localStorage.getItem('pedidoTemporal');
    return pedidoTemp ? JSON.parse(pedidoTemp) : null;
  }

  // Limpiar pedido temporal de localStorage
  limpiarPedidoTemporal(): void {
    localStorage.removeItem('pedidoTemporal');
  }

  // Borrar historial de pedidos del cliente actual
  borrarHistorialPedidos(): Observable<void> {
    console.log('Iniciando borrado del historial de pedidos');
    return this.authService.currentUser$.pipe(
      take(1),
      tap(user => console.log('Usuario obtenido en borrarHistorialPedidos:', user)),
      switchMap(user => {
        if (!user) {
          console.error('No hay usuario autenticado');
          return throwError(() => new Error('Usuario no autenticado'));
        }

        console.log('Borrando historial de pedidos para usuario:', user.id);
        return this.firestore.collection<Pedido>('pedidos', ref => 
          ref.where('clienteId', '==', user.id)
        ).get().pipe(
          switchMap(snapshot => {
            const batch = this.firestore.firestore.batch();
            
            snapshot.docs.forEach(doc => {
              const pedido = doc.data() as Pedido;
              if (['entregado', 'cancelado'].includes(pedido.estado)) {
                batch.delete(doc.ref);
              }
            });

            return from(batch.commit());
          }),
          tap(() => console.log('Historial de pedidos borrado exitosamente')),
          map(() => void 0)
        );
      })
    );
  }

  buscarPedidoPorNumero(numeroSeguimiento: string): Observable<Pedido | null> {
    console.log('Buscando pedido por número:', numeroSeguimiento);
    return this.authService.getCurrentUser().pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          console.log('No hay usuario autenticado');
          return throwError(() => new Error('Usuario no autenticado'));
        }

        return this.firestore.collection<DocumentData>('pedidos', ref =>
          ref.where('numeroSeguimiento', '==', numeroSeguimiento)
             .where('clienteId', '==', user.id)
             .limit(1)
        ).snapshotChanges().pipe(
          tap(actions => console.log('Resultado de búsqueda:', actions.length, 'documentos encontrados')),
          map(actions => {
            if (actions.length === 0) {
              console.log('No se encontró el pedido');
              return null;
            }

            const doc = actions[0];
            const data = doc.payload.doc.data();
            const id = doc.payload.doc.id;
            console.log('Pedido encontrado:', JSON.stringify(data, null, 2));
            return this.mapearPedido(id, data);
          })
        );
      })
    );
  }

  getPedidos(): Observable<Pedido[]> {
    return this.firestore.collection<DocumentData>('pedidos', ref => 
      ref.orderBy('fechaCreacion', 'desc')
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => this.mapearPedido(a.payload.doc.id, a.payload.doc.data())))
    );
  }

  getPedidosPorEstado(estado: string): Observable<Pedido[]> {
    return this.firestore.collection<DocumentData>('pedidos', ref => 
      ref.where('estado', '==', estado)
      .orderBy('fechaCreacion', 'desc')
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => this.mapearPedido(a.payload.doc.id, a.payload.doc.data())))
    );
  }

  getPedidosPendientes(): Observable<Pedido[]> {
    return this.getPedidosPorEstado('pendiente');
  }

  getPedidosEnProceso(): Observable<Pedido[]> {
    return this.getPedidosPorEstado('en_proceso');
  }

  getPedidosPorChofer(choferId: string): Observable<Pedido[]> {
    console.log('[PedidoService] Buscando pedidos para choferId:', choferId);
    return this.firestore.collection<DocumentData>('pedidos', ref =>
      ref.where('choferId', '==', choferId)
      .orderBy('fechaCreacion', 'desc')
    ).snapshotChanges().pipe(
      tap(actions => console.log('[PedidoService] Documentos encontrados:', actions.length)),
      map(actions => {
        const pedidos = actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          console.log('[PedidoService] Pedido crudo:', { id, ...data });
          return this.mapearPedido(id, data);
        });
        console.log('[PedidoService] Pedidos mapeados:', pedidos);
        return pedidos;
      })
    );
  }

  async contarPedidos(): Promise<number> {
    const snapshot = await this.firestore.collection('pedidos').get().toPromise();
    return snapshot?.size || 0;
  }

  async contarPedidosPorFecha(fechaInicio: Date): Promise<number> {
    const snapshot = await this.firestore.collection('pedidos', ref => 
      ref.where('fechaCreacion', '>=', fechaInicio)
    ).get().toPromise();
    return snapshot?.size || 0;
  }

  async obtenerEstadisticasPorEstado() {
    const snapshot = await this.firestore.collection('pedidos').get().toPromise();
    const estadisticas = {
      completados: 0,
      enProceso: 0,
      pendientes: 0,
      cancelados: 0
    };

    snapshot?.forEach(doc => {
      const pedido = doc.data() as { estado: string };
      switch (pedido.estado) {
        case 'completado':
          estadisticas.completados++;
          break;
        case 'en_proceso':
          estadisticas.enProceso++;
          break;
        case 'pendiente':
          estadisticas.pendientes++;
          break;
        case 'cancelado':
          estadisticas.cancelados++;
          break;
      }
    });

    return estadisticas;
  }

  async obtenerEstadisticasPorRegion() {
    const snapshot = await this.firestore.collection('pedidos').get().toPromise();
    const estadisticas = {
      Santiago: 0,
      Valparaiso: 0,
      Temuco: 0
    };

    snapshot?.forEach(doc => {
      const pedido = doc.data() as { destino?: { region?: string } };
      const region = pedido.destino?.region;
      if (region && estadisticas.hasOwnProperty(region)) {
        estadisticas[region as keyof typeof estadisticas]++;
      }
    });

    return estadisticas;
  }

  async obtenerPedidosChofer(choferId: string): Promise<Pedido[]> {
    const snapshot = await this.firestore
      .collection<Pedido>('pedidos', ref => 
        ref.where('choferId', '==', choferId)
           .where('estado', 'in', ['pendiente', 'en_camino'])
      )
      .get()
      .toPromise();

    return snapshot?.docs.map(doc => this.mapDocumentToPedido(doc)) || [];
  }

  async actualizarEstadoPedido(pedidoId: string, estado: EstadoPedido): Promise<void> {
    await this.firestore.collection('pedidos').doc(pedidoId).update({ estado });
  }

  private mapDocumentToPedido(doc: any): Pedido {
    const data = doc.data();
    const { id, ...rest } = data;
    return {
      ...rest,
      id: doc.id,
      fechaCreacion: data.fechaCreacion?.toDate(),
      fechaActualizacion: data.fechaActualizacion?.toDate()
    };
  }
} 