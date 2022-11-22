import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index-customer',
  templateUrl: './index-customer.component.html',
})
export class IndexCustomerComponent implements OnInit {
  public default_path = 'assets/images/resources/default.png';
  public customers: Array<any> = [];

  public load_data: boolean = true;
  public toggle: boolean = false;
  public keyword: string = '';
  public p: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.keyword = params['filter'];
      this.init_data();
    });
  }

  init_data() {
    this.load_data = true;
    this.customerService.read_customers(this.keyword).subscribe({
      next: (res) => {
        this.load_data = false;
        this.customers = res.data;
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
        this.customerService.delete_customer(item._id).subscribe((res) => {
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
    this.customerService.change_status(id, { status }).subscribe({
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
      this.router.navigate(['/customers'], {
        queryParams: { filter: this.keyword },
      });
    } else {
      this.router.navigate(['/customers']);
    }
  }

  sortby = (key: string) => {
    this.toggle = !this.toggle;
    let direction = this.toggle ? 1 : -1;
    this.customers.sort((a: any, b: any) => {
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
