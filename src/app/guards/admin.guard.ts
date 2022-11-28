import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { EMPLEADOS } from '../utils/roles';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    if (!this.authService.isAuthenticated(EMPLEADOS)) {
      this.router.navigateByUrl('/auth');
      Swal.fire('Acceso denegado', 'No hay permisos necesarios', 'warning');
      return false;
    }
    return true;
  }
}
