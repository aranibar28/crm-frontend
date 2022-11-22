import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated(['Administrador'])) {
      this.authService.clean_localStorage();
      this.router.navigateByUrl('/auth');
      Swal.fire(
        'Acceso denegado',
        'No hay permisos necesarios o el token ha fallado.',
        'warning'
      );
      return false;
    }
    return true;
  }
}
