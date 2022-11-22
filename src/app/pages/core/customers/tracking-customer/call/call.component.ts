import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProspectService } from 'src/app/services/prospect.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
})
export class CallComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef;
  public default_path = 'assets/images/resources/default.png';
  public id = this.activatedRoute.snapshot.parent?.params['id'];
  public load_data: boolean = true;
  public load_btn: boolean = false;
  public p: number = 1;

  public calls: Array<any> = [];
  public initForm: any = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private prospectService: ProspectService,
    private fb: FormBuilder
  ) {}

  myForm: FormGroup = this.fb.group({
    date: [, [Validators.required]],
    time: ['08:00', [Validators.required]],
    result: ['', [Validators.required]],
    note: [,],
  });

  ngOnInit(): void {
    this.init_data();
    this.initForm = this.myForm.value;
  }

  init_data() {
    this.prospectService.read_calls(this.id).subscribe({
      next: (res) => {
        this.calls = res.data;
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
    this.prospectService.create_call(this.myForm.value).subscribe({
      next: (res) => {
        if (res.data) {
          Swal.fire('Listo', 'Datos guardados', 'success');
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
