import { Component, OnInit } from '@angular/core';
import { SaleService } from 'src/app/services/sale.service';
import { ActivatedRoute } from '@angular/router';
import { PublicService } from 'src/app/services/public.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details-sale',
  templateUrl: './details-sale.component.html',
})
export class DetailsSaleComponent implements OnInit {
  public default_path = 'assets/images/resources/default.png';
  public company: any = {};
  public sale: any = {};
  public details: Array<any> = [];

  public load_data = true;
  public id: any;

  constructor(
    private publicService: PublicService,
    private saleService: SaleService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => (this.id = id));
    this.init_data();
    this.init_company();
  }

  init_data() {
    this.saleService.read_sales_by_id(this.id).subscribe({
      next: (res) => {
        if (res.sale) {
          this.sale = res.sale;
          this.details = res.details;
        }
        this.load_data = false;
      },
    });
  }

  init_company() {
    this.publicService.get_company().subscribe({
      next: (res) => {
        this.company = res.data;
      },
    });
  }

  pass_sale() {
    Swal.fire({
      title: 'Marcar como Entregado',
      text: `¿Desea confirmar la entrega?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#39afd1',
      cancelButtonColor: '#fa5c7c',
      confirmButtonText: 'Sí, aprobar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.saleService.pass_sale(this.id).subscribe({
          next: (res) => {
            if (res.data) {
              this.init_data();
              Swal.fire('Listo!', 'Entrega confirmada', 'success');
            } else {
              Swal.fire('Error!', res.msg, 'error');
            }
          },
        });
      }
    });
  }
}
