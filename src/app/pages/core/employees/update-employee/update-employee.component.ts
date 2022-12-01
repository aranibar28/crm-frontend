import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { PublicService } from 'src/app/services/public.service';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { validation } from 'src/app/utils/validation';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
})
export class UpdateEmployeeComponent implements OnInit {
  @ViewChild('input_password') input_password!: ElementRef;
  public imgSelected: any = 'assets/images/resources/default.png';
  public imgCurrent: any = 'assets/images/resources/default.png';

  public id: string = '';
  public current_id: string = this.authService.id;

  public employee: any = {};
  public load_btn: boolean = false;
  public load_reniec: boolean = false;
  public file: File | undefined;
  public isAdmin = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private publicService: PublicService,
    private authService: AuthService,
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
    role: ['', Validators.required],
    genre: [''],
  });

  init_data() {
    this.employeeService.read_employee_by_id(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.employee = res.data;
          this.myForm.patchValue(this.employee);
          if (this.employee.image?.secure_url) {
            this.imgSelected = this.employee.image.secure_url;
            this.imgCurrent = this.employee.image.secure_url;
          }
          if (this.employee.email == environment.email) {
            this.myForm.controls['email'].disable();
            this.input_password.nativeElement.disabled = true;
            this.isAdmin = true;
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
      this.myForm.controls['password'].setValue(this.employee.password);
    } else {
      if (this.isAdmin) {
        this.myForm.controls['password'].setValue('123456');
      } else {
        this.myForm.controls['password'].setValue(password);
      }
    }

    if (this.file) {
      const img = this.fb.control(this.file);
      this.myForm.addControl('image', img);
    }

    this.load_btn = true;
    this.employeeService.update_employee(this.id, this.myForm.value).subscribe({
      next: (res) => {
        this.load_btn = false;
        if (res.data) {
          if (this.id == this.current_id) {
            localStorage.setItem('token', res.token);
            this.authService.emitter({
              value: res.data.full_name,
              image: res.data.image?.secure_url,
            });
          }
          this.router.navigateByUrl('/employees');
          Swal.fire('Listo', 'Datos actualizados correctamente.', 'success');
        } else {
          Swal.fire('Advertencia', res.msg, 'warning');
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
