import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import Swal from 'sweetalert2';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  public default_path = 'assets/images/resources/default.png';
  public user: any = {};
  public valueEmitted = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.is_logged();
    this.authService.courier.subscribe((item) => {
      this.valueEmitted = item;
    });
  }

  is_logged() {
    if (this.authService.token) {
      const helper = new JwtHelperService();
      let decodedToken = helper.decodeToken(this.authService.token);
      this.user = decodedToken;
      this.user.full_name = this.user.first_name + ' ' + this.user.last_name;
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
