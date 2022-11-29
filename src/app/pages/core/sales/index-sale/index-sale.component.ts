import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SaleService } from 'src/app/services/sale.service';
import { EmployeeService } from 'src/app/services/employee.service';
import Swal from 'sweetalert2';

import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-update-sale',
  templateUrl: './index-sale.component.html',
})
export class IndexSaleComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef;
  public employee = '';
  public from = '';
  public to = '';

  public employees: Array<any> = [];
  public comments: Array<any> = [];
  public sales: Array<any> = [];
  public sales_arr: Array<any> = [];
  public arr_json: Array<any> = [];

  public load_data = false;
  public sort = false;
  public p = 1;

  constructor(
    private employeeService: EmployeeService,
    private saleService: SaleService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.init_employees();
    this.init_data();
  }

  init_data() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.employee = params['employee'];
      this.from = params['from'];
      this.to = params['to'];
      if (this.employee && this.from && this.to) {
        this.init_sales_dates();
      } else {
        this.employee = 'all';
        this.init_sales_today();
      }
    });
  }

  init_sales_today() {
    this.load_data = true;
    this.saleService.read_sales_today().subscribe({
      next: (res) => {
        this.load_data = false;
        this.sales = res.data;
        this.sales_arr = res.data;
      },
    });
  }

  init_sales_dates() {
    this.load_data = true;
    this.saleService
      .read_sales_dates(this.employee, this.from, this.to)
      .subscribe({
        next: (res) => {
          this.load_data = false;
          this.sales = res.data;
          this.sales_arr = res.data;
        },
      });
  }

  init_employees() {
    this.employeeService.list_advisors().subscribe({
      next: (res) => {
        this.employees = res;
      },
    });
  }

  filter() {
    if (!this.from || !this.to) {
      return;
    } else {
      this.router.navigate(['/sales'], {
        queryParams: { employee: this.employee, from: this.from, to: this.to },
      });
    }
  }

  send_email(id: any) {
    Swal.fire({
      title: 'REENVIAR ORDEN DE COMPRA',
      text: 'Se reenviará una orden de compra por correo.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#39afd1',
      cancelButtonColor: '#fa5c7c',
      confirmButtonText: 'Sí, reenviar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Listo', 'Mensaje enviado.', 'success');
      }
    });
  }

  accept_sale(item: any) {
    Swal.fire({
      title: 'Aprobar Venta',
      text: `¿Desea aprobar la venta ${item._id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#39afd1',
      cancelButtonColor: '#fa5c7c',
      confirmButtonText: 'Sí, aprobar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.saleService.accept_sale(item._id).subscribe((res) => {
          if (res.data) {
            this.p = 1;
            this.init_data();
            Swal.fire('Listo!', `Venta ${item._id} aprobada.`, 'success');
          } else {
            Swal.fire('Error!', res.msg, 'error');
          }
        });
      }
    });
  }

  cancel_sale(item: any) {
    Swal.fire({
      title: 'Anular Venta',
      text: `¿Desea anular la venta ${item._id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#39afd1',
      cancelButtonColor: '#fa5c7c',
      confirmButtonText: 'Sí, anular!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.saleService.cancel_sale(item._id).subscribe((res) => {
          if (res.data) {
            this.p = 1;
            this.init_data();
            Swal.fire('Listo!', `Venta ${item._id} anulada.`, 'success');
          } else {
            Swal.fire('Error!', res.msg, 'error');
          }
        });
      }
    });
  }

  sortby = (key: string) => {
    this.sort = !this.sort;
    let direction = this.sort ? 1 : -1;
    this.sales.sort((a: any, b: any) => {
      if (a[key] < b[key]) {
        return 1 * direction;
      }
      if (a[key] > b[key]) {
        return -1 * direction;
      }
      return 0;
    });
  };

  prepared_data() {
    this.arr_json = [];
    for (var item of this.sales) {
      let fecha = moment(item.created_at).format('YYYY-MM-DD');
      let color = '';

      if (item.status == 'Cancelado') {
        color = 'FA5C7C';
      } else if (item.status == 'Procesando') {
        color = 'FFBC00';
      } else if (item.status == 'Aprobado') {
        color = '0ACF97';
      }

      this.arr_json.push({
        customer: item.customer?.full_name,
        email: item.customer?.email,
        method: item.method,
        employee: item.employee?.full_name,
        amount: item.amount,
        date: fecha,
        color: color,
      });
    }
  }

  export_excel() {
    if (this.sales.length == 0) {
      Swal.fire('', 'No hay matrículas para exportar.', 'warning');
      return;
    }

    this.prepared_data();
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Matriculas');

    worksheet.addRow(undefined);
    for (let item of this.arr_json) {
      let keys = Object.keys(item);

      let temp = [];
      for (let i of keys) {
        temp.push(item[i]);
      }

      let row = worksheet.addRow(temp);
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: item.color,
        },
      };
    }

    let fname = 'Reporte de Ventas RV' + Date.now();

    worksheet.columns = [
      { header: 'Cliente', key: 'col1', width: 30 },
      { header: 'Correo', key: 'col2', width: 25 },
      { header: 'Método', key: 'col3', width: 20 },
      { header: 'Empleado', key: 'col4', width: 30 },
      { header: 'Monto', key: 'col6', width: 15 },
      { header: 'Fecha', key: 'col8', width: 20 },
    ] as any;

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, fname + '.xlsx');
    });
  }
}
