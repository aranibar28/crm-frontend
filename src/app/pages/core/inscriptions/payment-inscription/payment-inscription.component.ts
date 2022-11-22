import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { InscriptionService } from 'src/app/services/inscription.service';
import { SaleService } from 'src/app/services/sale.service';
import * as printJS from 'print-js';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { PublicService } from 'src/app/services/public.service';
declare var $: any;

@Component({
  selector: 'app-payment-inscription',
  templateUrl: './payment-inscription.component.html',
})
export class PaymentInscriptionComponent implements OnInit {
  public load_data = true;
  public load_payments = true;
  public load_btn = false;

  public id: any;
  public company: any = {};
  public inscription: any = {};
  public details: Array<any> = [];
  public payments: Array<any> = [];

  public total_amount = 0;
  public total_payment = 0;
  public total_deuda = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private publicService: PublicService,
    private inscriptionService: InscriptionService,
    private saleService: SaleService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => (this.id = id));
    this.init_data();
    this.init_company();
  }

  myForm: FormGroup = this.fb.group({
    destination: ['', [Validators.required]],
    method: ['', [Validators.required]],
    bank: ['', [Validators.required]],
    date: [moment().format('YYYY-MM-DD'), [Validators.required]],
    transaction: ['', [Validators.required]],
    amount: [, [Validators.required]],
  });

  init_data() {
    this.load_data = true;
    this.inscriptionService.read_inscription_by_id(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.inscription = res.data;
          this.details = res.details;
          this.total_amount = res.data.amount + res.data.matricula;
          this.load_data = false;
          this.init_payment();
        }
      },
      error: (err) => {
        this.load_data = false;
        console.log(err);
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

  init_payment() {
    this.load_payments = true;
    this.saleService.read_inscription_payments(this.id).subscribe({
      next: (res) => {
        this.total_payment = 0;
        this.payments = res.data;
        for (let item of this.payments) {
          this.total_payment += item.amount;
        }
        this.total_deuda = this.total_amount - this.total_payment;
        this.load_payments = false;
      },
    });
  }

  select_method(item: any) {
    this.myForm.controls['method'].setValue(item);
    $('#dropdownMethod').text(item);
  }

  select_bank(item: any) {
    this.myForm.controls['bank'].setValue(item);
    $('#dropdownBank').text(item);
  }

  register() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    const customer = this.fb.control(this.inscription.customer?._id);
    this.myForm.addControl('customer', customer);
    this.myForm.addControl('inscription', this.fb.control(this.id));
    this.myForm.addControl('origin', this.fb.control('Interno'));
    this.myForm.addControl('type', this.fb.control('Matricula'));
    this.load_btn = true;

    this.saleService.create_inscription_payment(this.myForm.value).subscribe({
      next: (res) => {
        if (res.data) {
          this.init_data();
          this.load_btn = false;
          Swal.fire('Listo', 'Pago realizado.', 'success');
        } else {
          this.load_btn = false;
          Swal.fire('Advertencia', res.msg, 'warning');
        }
      },
    });
  }

  pass_inscription() {
    this.inscriptionService.pass_inscription(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.init_data();
        }
      },
    });
  }

  print_ticket(i: any) {
    printJS({
      printable: ['printdiv-' + i],
      type: 'html',
    });
  }

  validators(name: string) {
    const input = this.myForm.controls[name];
    return input.errors && input.touched;
  }
}
