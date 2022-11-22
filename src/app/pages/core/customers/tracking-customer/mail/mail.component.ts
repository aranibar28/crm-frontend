import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProspectService } from 'src/app/services/prospect.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
})
export class MailComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef;
  public default_path = 'assets/images/resources/default.png';
  public id = this.activatedRoute.snapshot.parent?.params['id'];
  public load_data: boolean = true;
  public load_btn: boolean = false;
  public p: number = 1;

  public mails: Array<any> = [];
  public initForm: any = {};
  public config: any = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private prospectService: ProspectService,
    private fb: FormBuilder
  ) {}

  myForm: FormGroup = this.fb.group({
    subject: [, [Validators.required]],
    message: [, [Validators.required]],
  });

  ngOnInit(): void {
    this.config = { height: 350 };
    this.init_data();
    this.initForm = this.myForm.value;
  }

  init_data() {
    this.prospectService.read_mails(this.id).subscribe({
      next: (res) => {
        this.mails = res.data;
        this.load_data = false;
      },
    });
  }

  register() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }
    this.load_btn = true;
    this.myForm.addControl('customer', this.fb.control(this.id));
    this.prospectService.create_mail(this.myForm.value).subscribe({
      next: (res) => {
        if (res.data) {
          Swal.fire('Listo', 'Mensaje enviado', 'success');
          this.closeModal.nativeElement.click();
          this.myForm.reset(this.initForm);
          this.init_data();
        } else {
          Swal.fire('Error', res.msg, 'error');
        }
        this.load_btn = false;
      },
      error: (err) => {
        Swal.fire('Error', err.msg, 'error');
        this.load_btn = false;
      },
    });
  }

  validators(name: string) {
    const input = this.myForm.controls[name];
    return input.errors && input.touched;
  }
}
