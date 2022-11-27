import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { PublicService } from 'src/app/services/public.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
})
export class SurveyComponent implements OnInit {
  public payload: any = {};
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
      const helper = new JwtHelperService();
      this.payload = helper.decodeToken(token);
      let today = moment().unix();
      if (this.payload.exp <= today) {
        this.expired = true;
      }
    });
  }

  send_survey() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    const inscription = this.fb.control(this.payload.inscription);
    const customer = this.fb.control(this.payload.customer);
    this.myForm.addControl('inscription', inscription);
    this.myForm.addControl('customer', customer);

    this.publicService.send_survey(this.myForm.value).subscribe({
      next: (res) => {
        if (res.data) {
          this.send = true;
          Swal.fire('Bien!', 'Gracias por completar la encuesta.', 'success');
        } else {
          Swal.fire('Oh no!', res.msg, 'info');
        }
      },
    });
  }

  validators(name: string) {
    const input = this.myForm.controls[name];
    return input.errors && input.touched;
  }
}
