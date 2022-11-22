import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  public load_btn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {}

  myForm: FormGroup = this.fb.group({
    email: ['admin@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required, Validators.minLength(3)]],
  });

  login() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    this.load_btn = true;
    this.authService.login(this.myForm.value).subscribe({
      next: (res) => {
        this.load_btn = false;
        if (res.data) {
          let { data, token } = res;
          this.router.navigateByUrl('/');
          localStorage.setItem('id', data._id);
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(data));
          Swal.fire('Bienvenido', 'Hola ' + data.full_name, 'success');
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

  validators(name: string) {
    const input = this.myForm.controls[name];
    return input.errors && input.touched;
  }
}
