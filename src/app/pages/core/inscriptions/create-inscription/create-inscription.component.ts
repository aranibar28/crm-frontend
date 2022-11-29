import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { CustomerService } from 'src/app/services/customer.service';
import { CycleService } from 'src/app/services/cycle.service';
import { InscriptionService } from 'src/app/services/inscription.service';
import { PublicService } from 'src/app/services/public.service';
import { months } from 'src/app/utils/months';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-create-inscription',
  templateUrl: './create-inscription.component.html',
})
export class CreateInscriptionComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef;
  public default_path = 'assets/images/resources/default.png';
  public load_btn = false;
  public load_customers = false;
  public load_cycles = false;
  public filter_cycle: string = '';
  public filter_customer: string = '';
  public months = months;

  public customers: Array<any> = [];
  public courses: Array<any> = [];
  public channels: Array<any> = [];
  public cycles: Array<any> = [];
  public cycles_arr: Array<any> = [];
  public rooms: Array<any> = [];

  public amount: number = 0;
  public discount: number = 0;
  public temp_subtotal = 0;
  public detail_subtotal = 0;
  public detail_discount = 0;
  public detail_total = 0;

  public details: Array<any> = [];
  public initFormDetail: any = {};

  constructor(
    private customerService: CustomerService,
    private courseService: CourseService,
    private cycleService: CycleService,
    private inscriptionService: InscriptionService,
    private publicService: PublicService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.init_courses();
    this.init_channels();
  }

  myForm: FormGroup = this.fb.group({
    customer: [, [Validators.required]],
    channel: ['', [Validators.required]],
    matricula: [0, [Validators.required]],
    origin: ['Interno', [Validators.required]],
    amount: [],
    discount: [],
  });

  myFormDetail: FormGroup = this.fb.group({
    course: ['', [Validators.required]],
    cycle_course: ['', [Validators.required]],
    cycle_room: [''],
    title_course: [],
    start_date: [],
    final_date: [],
    n_clases: [],
    title_room: [],
    price: [],
    discount_type: [''],
    discount_value: [0],
  });

  search_customers() {
    this.load_customers = true;
    this.customerService.read_customers(this.filter_customer).subscribe({
      next: (res) => {
        this.customers = res.data;
        this.load_customers = false;
      },
      error: (err) => {
        console.log(err);
        this.load_customers = false;
      },
    });
  }

  select_customer(item: any) {
    this.closeModal.nativeElement.click();
    this.myForm.patchValue({ customer: item._id });
    $('#input_customer').val(item.full_name);
  }

  init_channels() {
    this.publicService.get_company().subscribe({
      next: (res) => {
        this.channels = res.data?.channels;
      },
    });
  }

  init_courses() {
    this.courseService.list_courses().subscribe({
      next: (res) => {
        this.courses = res;
      },
    });
  }

  select_course(event: any) {
    this.rooms = [];
    this.detail_subtotal = 0;
    this.detail_discount = 0;
    this.detail_total = 0;
    this.myFormDetail.patchValue({
      course: event.target.value,
      title_course: event.target.selectedOptions[0].text,
      cycle_course: '',
    });
    this.load_cycles = true;
    this.cycleService.read_current_cycles(event.target.value).subscribe({
      next: (res) => {
        this.cycles = [];
        this.cycles_arr = [];      
        res.data.forEach((element: any) => {
          if (element.cycle.status) {
            this.cycles.push(element);
          }
        });
        this.cycles_arr = this.cycles;
        this.load_cycles = false;
      },
    });
  }

  search_cycle() {
    let term = new RegExp(this.filter_cycle, 'i');
    if (this.filter_cycle) {
      this.cycles = this.cycles.filter((item) => term.test(item.cycle._id));
    } else {
      this.cycles = this.cycles_arr;
    }
  }

  select_cycle(item: any) {
    this.rooms = item.rooms;
    this.temp_subtotal = item.cycle.price;
    this.detail_subtotal = item.cycle.price;
    this.detail_total = this.detail_subtotal;
    this.myFormDetail.patchValue({
      cycle_course: item.cycle._id,
      start_date: item.cycle.start_date,
      final_date: item.cycle.final_date,
    });
    $('#input_cycle').val(item.cycle.nivel);
    $('#modal_cycle').modal('hide');
  }

  select_room(item: any) {
    this.myFormDetail.patchValue({
      cycle_room: item._id,
      n_clases: item.frequency.length * 4,
      title_room: item.room,
    });
  }

  aply_discount() {
    let type: string = this.myFormDetail.controls['discount_type'].value;
    let value: number = this.myFormDetail.controls['discount_value'].value;

    if (type == 'Precio Fijo') {
      if (value < this.detail_subtotal) {
        this.detail_discount = value;
        this.detail_total = this.detail_subtotal - this.detail_discount;
      } else {
        this.detail_discount = 0;
        this.detail_total = this.temp_subtotal;
        Swal.fire('Info', 'El descuento debe ser menor al subtotal.', 'info');
      }
    } else if (type == 'Porcentaje') {
      if (value < 100) {
        var total = this.detail_subtotal * value;
        this.detail_discount = total / 100;
        this.detail_total = this.detail_subtotal - this.detail_discount;
      } else {
        this.detail_discount = 0;
        this.detail_total = this.temp_subtotal;
        Swal.fire('Info', 'El porcentaje debe ser menor del 100%.', 'info');
      }
    } else {
      this.detail_discount = 0;
      this.detail_total = this.temp_subtotal;
    }
  }

  add_detail() {
    if (this.myFormDetail.invalid) {
      this.myFormDetail.markAllAsTouched();
      return;
    }
    const cycle_room = this.myFormDetail.controls['cycle_room'].value;
    this.myFormDetail.patchValue({
      price: this.detail_total,
      discount_value: this.detail_discount,
    });
    if (!cycle_room) {
      Swal.fire('Info', 'Porfavor seleccione un salón.', 'info');
    } else if (this.detail_total == 0) {
      Swal.fire('Info', 'El precio del ciclo no puede ser 0.', 'info');
    } else {
      this.details.push(this.myFormDetail.value);
      this.calculate_total();
      this.reset_detail();
    }
  }

  del_detail(i: any) {
    this.details.splice(i, 1);
    this.calculate_total();
  }

  calculate_total() {
    this.amount = 0;
    this.discount = 0;
    for (let item of this.details) {
      this.amount += item.price;
      this.discount += item.discount_value;
    }
  }

  reset_detail() {
    this.myFormDetail.reset({
      course: '',
      discount_type: '',
      discount_value: 0,
    });
    this.rooms = [];
    this.cycles = [];
    this.temp_subtotal = 0;
    this.detail_subtotal = 0;
    this.detail_discount = 0;
    this.detail_total = 0;
  }

  register() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    if (this.details.length == 0) {
      Swal.fire('Info', 'Debe ingresar como mínimo un ciclo.', 'info');
      return;
    }

    this.myForm.patchValue({ amount: this.amount, discount: this.discount });
    this.myForm.addControl('details', this.fb.control(this.details));
    this.inscriptionService.create_inscription(this.myForm.value).subscribe({
      next: (res) => {
        if (res.data) {
          Swal.fire('Listo', 'Matrícula generada correctamente.', 'success');
          this.router.navigateByUrl('/inscriptions');
        } else {
          Swal.fire('Advertencia', res.msg, 'warning');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  validators(name: string) {
    const input = this.myForm.controls[name];
    return input.errors && input.touched;
  }

  validatorsDetails(name: string) {
    const input = this.myFormDetail.controls[name];
    return input.errors && input.touched;
  }
}
