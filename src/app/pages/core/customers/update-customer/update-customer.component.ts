import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { PublicService } from 'src/app/services/public.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
})
export class UpdateCustomerComponent implements OnInit {
  @ViewChild('input_password') input_password!: ElementRef;
  public imgSelected: any = 'assets/images/resources/default.png';
  public imgCurrent: any = 'assets/images/resources/default.png';

  public load_btn: boolean = false;
  public load_reniec: boolean = false;
  public file: File | undefined;
  public customer: any = {};
  public id: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService,
    private publicService: PublicService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => (this.id = id));
    this.init_data();
  }

  myForm: FormGroup = this.fb.group({
    email: [, [Validators.required, Validators.email]],
    password: [, [Validators.required, Validators.minLength(3)]],
    first_name: [, [Validators.required, Validators.minLength(3)]],
    last_name: [, [Validators.required, Validators.minLength(3)]],
    dni: [, [Validators.required, Validators.minLength(8)]],
    phone: ['', [Validators.minLength(9), Validators.pattern('^[0-9]*$')]],
    genre: [''],
    verify: ['', [Validators.required]],
    country: [''],
    city: [''],
    send_verify: [false],
  });

  init_data() {
    this.customerService.read_customer_by_id(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.customer = res.data;
          this.myForm.patchValue(this.customer);
          if (this.customer.image?.secure_url) {
            this.imgSelected = this.customer.image.secure_url;
            this.imgCurrent = this.customer.image.secure_url;
          }
        }
      },
      error: (err) => console.log(err),
    });
  }

  update() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    const password = this.input_password.nativeElement.value;
    if (password == '') {
      this.myForm.controls['password'].setValue(this.customer.password);
    } else {
      this.myForm.controls['password'].setValue(password);
    }

    if (this.file) {
      const img = this.fb.control(this.file);
      this.myForm.addControl('image', img);
    }

    this.load_btn = true;
    this.customerService.update_customer(this.id, this.myForm.value).subscribe({
      next: (res) => {
        this.load_btn = false;
        if (res.data) {
          this.router.navigateByUrl('/customers');
          Swal.fire('Listo', 'Datos actualizados correctamente.', 'success');
        } else {
          Swal.fire('Error', res.msg, 'error');
        }
      },
      error: (err) => {
        this.load_btn = false;
        console.log(err);
      },
    });
  }

  search_reniec() {
    this.load_reniec = true;
    const dni = this.myForm.controls['dni'];
    if (dni.invalid) {
      dni.markAsTouched();
      this.load_reniec = false;
      return;
    }
    this.publicService.get_user(dni.value).subscribe({
      next: (res) => {
        this.load_reniec = false;
        if (res.dni) {
          const first_name = res.nombres;
          const last_name = res.apellidoPaterno + ' ' + res.apellidoMaterno;
          this.myForm.controls['first_name'].setValue(first_name);
          this.myForm.controls['last_name'].setValue(last_name);
        } else {
          this.myForm.controls['first_name'].setValue('');
          this.myForm.controls['last_name'].setValue('');
          Swal.fire('Info', 'No se encontraron resultados.', 'info');
        }
      },
      error: (err) => {
        this.load_reniec = false;
        console.log(err);
      },
    });
  }

  validators(name: string) {
    const input = this.myForm.controls[name];
    return input.errors && input.touched;
  }

  message(name: string, title: string) {
    return this.publicService.validation(name, title, this.myForm);
  }

  onlyNumber(event: KeyboardEvent) {
    return event.charCode >= 48 && event.charCode < 58;
  }

  fileChanged(event: any) {
    const file: File = event.target.files[0];
    if (!file) {
      this.file = undefined;
      this.imgSelected = this.imgCurrent;
    } else {
      if (file.size <= 4000000) {
        const array = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
        if (array.includes(file.type)) {
          const reader = new FileReader();
          reader.onload = () => (this.imgSelected = reader.result);
          reader.readAsDataURL(file);
          this.file = file;
        } else {
          this.file = undefined;
          this.imgSelected = this.imgCurrent;
          Swal.fire('Error', 'El archivo debe ser una imagen', 'error');
        }
      } else {
        this.file = undefined;
        this.imgSelected = this.imgCurrent;
        Swal.fire('Error', 'La imagen no puede superar los 4MB', 'error');
      }
    }
  }
}
