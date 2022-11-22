import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PublicService } from 'src/app/services/public.service';
import jwt_decode from 'jwt-decode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
})
export class SurveyComponent implements OnInit {
  public token = '';
  public data: any = {};
  public expired = false;
  public send = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private publicService: PublicService,
    private fb: FormBuilder
  ) {}

  myForm: FormGroup = this.fb.group({
    answ_one: ['', [Validators.required]],
    answ_two: ['', [Validators.required]],
    answ_three: ['', [Validators.required]],
    answ_four: [, [Validators.required]],
    answ_five: ['', [Validators.required]],
    answ_six: [, [Validators.required]],
  });

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ token }) => {
      this.token = token;
      this.data = jwt_decode(this.token);
      let today = Date.parse(new Date().toString()) / 1000;
      if (today >= this.data.exp) {
        this.expired = true;
      } else {
        this.expired = false;
      }
    });
  }

  send_survey() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    const inscription = this.fb.control(this.data.inscription);
    const customer = this.fb.control(this.data.customer);
    this.myForm.addControl('inscription', inscription);
    this.myForm.addControl('customer', customer);

    this.publicService.send_survey(this.myForm.value).subscribe({
      next: (res) => {
        if (res.data) {
          this.send = true;
          Swal.fire('Bien!', 'Gracias por completar la encuesta.', 'success');
        } else {
          Swal.fire('Oh no!', res.msg, 'error');
        }
      },
    });
  }

  validators(name: string) {
    const input = this.myForm.controls[name];
    return input.errors && input.touched;
  }
}
