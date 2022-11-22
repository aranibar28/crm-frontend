import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  public default_path = 'assets/images/resources/default.png';
  public user: any = undefined;
  public profile_name: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.is_logged();
  }

  is_logged() {
    if (this.authService.user) {
      this.user = JSON.parse(localStorage.getItem('user')!);
      let name1 = this.user.first_name?.split(' ')[0];
      let name2 = this.user.last_name?.split(' ')[0];
      this.profile_name = name1 + ' ' + name2;
    } else {
      this.user = undefined;
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
        this.authService.logout();
      }
    });
  }
}
