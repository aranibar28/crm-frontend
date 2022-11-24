import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { JwtHelperService } from '@auth0/angular-jwt';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  @Input() token: string = this.authService.token;
  public default_path = 'assets/images/resources/default.png';
  public user: any = {};

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.is_logged();
  }

  is_logged() {
    if (this.authService.token) {
      const helper = new JwtHelperService();
      let decodedToken = helper.decodeToken(this.token);
      this.user = decodedToken;
      let name1 = this.user.first_name?.split(' ')[0];
      let name2 = this.user.last_name?.split(' ')[0];
      this.user.full_name = name1 + ' ' + name2;
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
