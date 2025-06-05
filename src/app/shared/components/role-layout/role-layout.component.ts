import { Component } from '@angular/core';

@Component({
  selector: 'app-role-layout',
  template: `
    <div class="role-layout">
      <header class="role-header">
        <div class="logo-section">
          <img src="assets/images/leaf-logo.png" alt="Ecologistic Logo" class="logo">
          <div class="brand-text">
            <h1>Ecologistic S.A.</h1>
            <p>Transporte ecológico con tecnología avanzada</p>
          </div>
        </div>
        <div class="nav-section">
          <a routerLink="/" class="nav-link">
            <ion-icon name="home-outline"></ion-icon>
            Inicio
          </a>
          <button class="logout-button" (click)="logout()">
            <ion-icon name="log-out-outline"></ion-icon>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main class="role-content">
        <div class="content-container">
          <ng-content></ng-content>
        </div>
      </main>

      <app-footer></app-footer>
    </div>
  `,
  styleUrls: ['./role-layout.component.scss']
})
export class RoleLayoutComponent {
  logout() {
    // Implementar lógica de cierre de sesión
    console.log('Cerrando sesión...');
  }
} 