import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  template: `
    <ion-header>
      <ion-toolbar color="danger">
        <ion-title>Acceso No Autorizado</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="ion-text-center">
        <ion-icon name="warning" color="danger" style="font-size: 64px;"></ion-icon>
        <h2>Acceso Denegado</h2>
        <p>No tienes permisos para acceder a esta sección.</p>
        <ion-button (click)="volver()">Volver al Inicio</ion-button>
      </div>
    </ion-content>
  `
})
export class UnauthorizedComponent {
  constructor(private router: Router) {}

  volver() {
    this.router.navigate(['/']);
  }
} 