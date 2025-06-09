import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  email: string = '';
  password: string = '';
  error: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async login() {
    if (!this.email || !this.password) {
      this.error = 'Por favor ingresa email y contraseña';
      return;
    }

    try {
      this.loading = true;
      this.error = '';
      await this.authService.login(this.email, this.password).toPromise();
      this.router.navigate(['/inicio']);
    } catch (error: any) {
      this.error = error.message || 'Error al iniciar sesión';
    } finally {
      this.loading = false;
    }
  }
}
