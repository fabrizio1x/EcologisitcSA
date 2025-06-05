import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable, of } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const allowedRoles = route.data['roles'] as string[];
    
    return this.authService.getCurrentUser().pipe(
      take(1),
      tap(user => console.log('AuthGuard - Usuario actual:', user)),
      map(user => {
        if (!user) {
          console.log('AuthGuard - No hay usuario autenticado, redirigiendo a login');
          this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: state.url }
          });
          return false;
        }

        if (!allowedRoles || allowedRoles.includes(user.role)) {
          console.log('AuthGuard - Acceso permitido');
          return true;
        }

        console.log('AuthGuard - Rol no autorizado');
        this.router.navigate(['/']);
          return false;
      })
    );
  }
} 