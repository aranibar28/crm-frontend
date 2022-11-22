import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index-employee',
  templateUrl: './index-employee.component.html',
})
export class IndexEmployeeComponent implements OnInit {
  public default_path = 'assets/images/resources/default.png';
  public employees: Array<any> = [];
  public employees_arr: Array<any> = [];

  public load_data: boolean = true;
  public toggle: boolean = false;
  public keyword: string = '';
  public p: number = 1;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this.load_data = true;
    this.employeeService.read_employees().subscribe({
      next: (res) => {
        this.load_data = false;
        this.employees = res.data;
        this.employees_arr = res.data;
      },
      error: (err) => {
        this.load_data = false;
        console.log(err);
      },
    });
  }

  delete_item(item: any) {
    Swal.fire({
      title: 'Eliminar Usuario',
      text: `¿Desea eliminar el usuario ${item.full_name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#39afd1',
      cancelButtonColor: '#fa5c7c',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeeService.delete_employee(item._id).subscribe((res) => {
          if (res.data) {
            this.p = 1;
            this.init_data();
            Swal.fire('Listo', `${item.full_name} eliminado.`, 'success');
          } else {
            Swal.fire('Advertencia', res.msg, 'warning');
          }
        });
      }
    });
  }

  change_status(event: Event, id: string) {
    let element = event.target as HTMLInputElement;
    let status = element.checked;
    let result = status ? 'activado' : 'desactivado';
    this.employeeService.change_status(id, { status }).subscribe({
      next: (res) => {
        if (res.data) {
          Swal.fire('Listo', `Estado ${result}.`, 'success');
        } else {
          element.checked = !element.checked;
          Swal.fire('Advertencia', res.msg, 'warning');
        }
      },
    });
  }

  search() {
    if (this.keyword) {
      var term = new RegExp(this.keyword, 'i');
      this.employees = this.employees_arr.filter(
        (item) =>
          term.test(item.full_name) ||
          term.test(item.email) ||
          term.test(item.dni)
      );
    } else {
      this.employees = this.employees_arr;
    }
  }

  sortby = (key: string) => {
    this.toggle = !this.toggle;
    let direction = this.toggle ? 1 : -1;
    this.employees.sort((a: any, b: any) => {
      if (a[key] < b[key]) {
        return 1 * direction;
      }
      if (a[key] > b[key]) {
        return -1 * direction;
      }
      return 0;
    });
  };
}
