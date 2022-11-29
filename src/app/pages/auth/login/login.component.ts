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
  public email = localStorage.getItem('email' || '');
  public load_btn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.email) {
      this.myForm.patchValue({ email: this.email, remember: true });
    }
  }

  myForm: FormGroup = this.fb.group({
    email: [, [Validators.required, Validators.email]],
    password: [, [Validators.required, Validators.minLength(3)]],
    remember: [false],
  });

  login() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    this.load_btn = true;
    this.authService.login(this.myForm.value).subscribe({
      next: (res) => {
        if (res.data) {
          if (this.myForm.controls['remember'].value) {
            localStorage.setItem('email', res.data.email);
          } else {
            localStorage.removeItem('email');
          }
          let { data, token } = res;
          this.router.navigateByUrl('/');
          localStorage.setItem('token', token);
          this.authService.emitter({
            value: res.data.full_name,
            image: res.data.image?.secure_url,
          });
          Swal.fire('Bien enido', 'Hola ' + data.full_name, 'success');
        } else {
          Swal.fire('Error', res.msg, 'error');
        }
        this.load_btn = false;
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
