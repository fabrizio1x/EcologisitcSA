import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../auth/auth.service';

interface Chofer {
  id: string;
  nombre: string;
  entregasCompletadas: number;
  entregasTotales: number;
  calificacionPromedio: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChoferService {
  constructor(private firestore: AngularFirestore) {}

  getChoferes(): Observable<User[]> {
    return this.firestore.collection<User>('users', ref => 
      ref.where('role', '==', 'chofer')
    ).valueChanges({ idField: 'id' });
  }

  getChoferesDisponibles(): Observable<User[]> {
    return this.firestore.collection<User>('users', ref => 
      ref.where('role', '==', 'chofer')
      .where('disponible', '==', true)
    ).valueChanges({ idField: 'id' });
  }

  asignarPedidoAChofer(pedidoId: string, choferId: string) {
    return this.firestore.collection('pedidos').doc(pedidoId).update({
      choferId: choferId,
      estado: 'en_proceso',
      fechaAsignacion: new Date()
    });
  }

  async obtenerRankingChoferes() {
    const snapshot = await this.firestore.collection('choferes').get().toPromise();
    const choferes: Chofer[] = [];

    snapshot?.forEach(doc => {
      const data = doc.data() as Omit<Chofer, 'id'>;
      choferes.push({
        id: doc.id,
        ...data
      });
    });

    // Ordenar por entregas completadas
    return choferes
      .sort((a, b) => b.entregasCompletadas - a.entregasCompletadas)
      .map(chofer => ({
        nombre: chofer.nombre,
        entregasCompletadas: chofer.entregasCompletadas,
        tasaExito: Math.round((chofer.entregasCompletadas / chofer.entregasTotales) * 100) || 0,
        calificacion: Math.round(chofer.calificacionPromedio)
      }));
  }
} 