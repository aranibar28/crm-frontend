import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from 'src/app/services/customer.service';
import { PublicService } from 'src/app/services/public.service';
import { Router } from '@angular/router';
import { validation } from 'src/app/utils/validation';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-customer',
  templateUrl: './create-customer.component.html',
})
export class CreateCustomerComponent implements OnInit {
  public imgSelected: any = 'assets/images/resources/default.png';
  public imgCurrent: any = 'assets/images/resources/default.png';

  public load_btn: boolean = false;
  public load_reniec: boolean = false;
  public file: File | undefined;

  constructor(
    private customerService: CustomerService,
    private publicService: PublicService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {}

  myForm: FormGroup = this.fb.group({
    email: [, [Validators.required, Validators.email]],
    password: [, [Validators.required, Validators.minLength(3)]],
    first_name: [, [Validators.required, Validators.minLength(3)]],
    last_name: [, [Validators.required, Validators.minLength(3)]],
    dni: [, [Validators.required, Validators.minLength(8)]],
    phone: ['', [Validators.minLength(9), Validators.pattern('^[0-9]*$')]],
    genre: [''],
    verify: [{ value: false, disabled: true }],
    country: [''],
    city: [''],
    send_verify: [false],
  });

  register() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    if (this.file) {
      const img = this.fb.control(this.file);
      this.myForm.addControl('image', img);
    }

    this.load_btn = true;
    this.customerService.create_customer(this.myForm.value).subscribe({
      next: (res) => {
        this.load_btn = false;
        if (res.data) {
          this.router.navigateByUrl('/customers');
          Swal.fire('Listo', 'Datos guardados correctamente.', 'success');
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
        Swal.fire('Error', 'Ocurrió un error con la búsqueda.', 'error');
      },
    });
  }

  validators(name: string) {
    const input = this.myForm.controls[name];
    return input.errors && input.touched;
  }

  message(name: string, title: string) {
    return validation(name, title, this.myForm);
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
