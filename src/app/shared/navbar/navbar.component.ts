import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  public default_path = 'assets/images/resources/default.png';
  public allow: boolean = this.authService.isAdmin;
  public valueEmitted = '';
  public imageEmitted = '';
  public user: any = {};

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.is_logged();
    this.authService.courier.subscribe((res) => {
      this.valueEmitted = res.value;
      this.imageEmitted = res.image;
    });
  }

  is_logged() {
    if (this.authService.token) {
      this.user = this.authService.payload;
    }
  }

  logout() {
    Swal.fire({
      title: 'Salir',
      text: '¿Usted quiere salir de la aplicación?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#39afd1',
      cancelButtonColor: '#fa5c7c',
      confirmButtonText: 'Sí, salir!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        this.router.navigateByUrl('/auth');
      }
    });
  }
}
