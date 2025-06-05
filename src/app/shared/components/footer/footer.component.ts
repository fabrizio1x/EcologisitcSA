import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      © 2025 Ecologistic S.A. Todos los derechos reservados.
    </footer>
  `,
  styles: [`
    .footer {
      text-align: center;
      color: #94A3B8;
      padding: 1.5rem;
      background-color: rgba(0, 0, 0, 0.2);
      width: 100%;
      font-size: 0.875rem;
      margin-top: auto;
    }
  `]
})
export class FooterComponent {} 