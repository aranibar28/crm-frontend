import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { PublicService } from 'src/app/services/public.service';
import { InscriptionService } from 'src/app/services/inscription.service';
import Swal from 'sweetalert2';

import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as moment from 'moment';

@Component({
  selector: 'app-index-inscription',
  templateUrl: './index-inscription.component.html',
})
export class IndexInscriptionComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef;
  public default_path = 'assets/images/resources/default.png';
  public inscriptions: Array<any> = [];
  public inscriptions_arr: Array<any> = [];
  public employees: Array<any> = [];
  public comments: Array<any> = [];
  public arr_json: Array<any> = [];

  public employee: string = '';
  public from: string = '';
  public to: string = '';

  public load_data: boolean = false;
  public load_comments: boolean = false;
  public sort: boolean = false;
  public p: number = 1;

  constructor(
    private inscriptionService: InscriptionService,
    private employeeService: EmployeeService,
    private publicService: PublicService, // Encuestas para el cliente
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
        this.init_iscriptions_dates();
      } else {
        this.employee = 'all';
        this.init_iscriptions_today();
      }
    });
  }

  init_iscriptions_today() {
    this.load_data = true;
    this.inscriptionService.read_inscriptions_today().subscribe({
      next: (res) => {
        for (let item of res.data) {
          item.subtotal = item.matricula + item.amount;
        }
        this.inscriptions = res.data;
        this.inscriptions_arr = res.data;
        this.load_data = false;
      },
    });
  }

  init_iscriptions_dates() {
    this.load_data = true;
    this.inscriptionService
      .read_inscriptions_dates(this.employee, this.from, this.to)
      .subscribe({
        next: (res) => {
          for (let item of res.data) {
            item.subtotal = item.matricula + item.amount;
          }
          this.load_data = false;
          this.inscriptions = res.data;
          this.inscriptions_arr = res.data;
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

  init_comments(id: any) {
    this.load_comments = true;
    this.inscriptionService.list_comments(id).subscribe({
      next: (res) => {
        this.comments = res.data;
        this.load_comments = false;
      },
    });
  }

  filter() {
    if (!this.from || !this.to) {
      return;
    } else {
      this.router.navigate(['/inscriptions'], {
        queryParams: { employee: this.employee, from: this.from, to: this.to },
      });
    }
  }

  accept_inscription(id: any) {
    Swal.fire({
      title: 'Aprobar Venta',
      text: `¿Desea aprobar la venta ${id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#39afd1',
      cancelButtonColor: '#fa5c7c',
      confirmButtonText: 'Sí, aprobar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.inscriptionService.accept_inscription(id).subscribe((res) => {
          if (res.data) {
            Swal.fire('Listo', 'Matricula procesada', 'success');
            if (this.employee && this.from && this.to) {
              this.init_iscriptions_dates();
            } else {
              this.employee = 'all';
              this.init_iscriptions_today();
            }
          } else {
            Swal.fire('Error', res.msg, 'error');
          }
        });
      }
    });
  }

  cancel_inscription(id: any) {
    Swal.fire({
      title: 'CANCELAR MATRÍCULA',
      text: 'Se cancelará la siguiente matrícula.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.inscriptionService.cancel_inscription(id).subscribe({
          next: (res) => {
            if (res.data) {
              Swal.fire('Listo', 'Matricula cancelada', 'success');
              if (this.employee && this.from && this.to) {
                this.init_iscriptions_dates();
              } else {
                this.employee = 'all';
                this.init_iscriptions_today();
              }
            } else {
              Swal.fire('Error', res.msg, 'error');
            }
          },
        });
      }
    });
  }

  send_email(id: any) {
    Swal.fire({
      title: 'REENVIAR ORDEN DE COMPRA',
      text: 'Se reenviará una orden de compra por correo.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Sí reenviar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.inscriptionService.send_invoice(id).subscribe({
          next: (res) => {
            if (res.data) {
              Swal.fire('Listo!', 'Mensaje enviado.', 'success');
            } else {
              Swal.fire('Error', res.msg, 'error');
            }
          },
        });
      }
    });
  }

  generate_token(item: any) {
    this.publicService.generate_token(item._id, item.customer._id).subscribe({
      next: (res) => {
        window.open('../auth/survey/' + res.token);
      },
    });
  }

  sortby = (key: string) => {
    this.sort = !this.sort;
    let direction = this.sort ? 1 : -1;
    this.inscriptions.sort((a: any, b: any) => {
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
    for (var item of this.inscriptions) {
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
        customer: item.customer.full_name,
        email: item.customer.email,
        channel: item.channel,
        employee: item.employee.full_name,
        matricula: item.matricula,
        amount: item.amount,
        subtotal: item.subtotal,
        date: fecha,
        color: color,
      });
    }
  }

  export_excel() {
    if (this.inscriptions.length == 0) {
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

    let fname = 'Reporte de Matriculas RM' + Date.now();

    worksheet.columns = [
      { header: 'Cliente', key: 'col1', width: 30 },
      { header: 'Correo', key: 'col2', width: 25 },
      { header: 'Canal', key: 'col3', width: 20 },
      { header: 'Asesor', key: 'col4', width: 30 },
      { header: 'Matricula', key: 'col5', width: 15 },
      { header: 'Monto', key: 'col6', width: 15 },
      { header: 'Subtotal', key: 'col7', width: 15 },
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
