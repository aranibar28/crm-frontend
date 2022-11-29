import { Component, NgZone, OnInit } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicService } from 'src/app/services/public.service';
import { validation } from 'src/app/utils/validation';
import Swal from 'sweetalert2';
declare var $: any;
@Component({
  selector: 'app-index-management',
  templateUrl: './index-management.component.html',
})
export class IndexManagementComponent implements OnInit {
  @ViewChild('new_channel') new_channel!: ElementRef;
  @ViewChild('new_variety') new_variety!: ElementRef;
  public imgSelected: any = 'assets/images/resources/default.png';
  public imgCurrent: any = 'assets/images/resources/default.png';
  public company: any = {};

  public load_data: boolean = true;
  public load_btn: boolean = false;
  public file: File | undefined;
  public id: string = '';

  constructor(
    private publicService: PublicService,
    private ngZone: NgZone,
    private fb: FormBuilder
  ) {}

  myForm: FormGroup = this.fb.group({
    ruc: [, [Validators.required, Validators.minLength(3)]],
    company: [, Validators.required],
    address: [, Validators.required],
    phone: [, Validators.required],
    branding: [, Validators.required],
    slogan: [, Validators.required],
    earnings: [, Validators.required],
    channels: [''],
    varieties: [''],
  });

  ngOnInit(): void {
    this.init_company();
  }

  init_company() {
    this.publicService.get_company().subscribe({
      next: (res) => {
        if (res.data) {
          this.company = res.data;
          this.load_data = false;
        }
        this.myForm.patchValue(this.company);
        if (this.company.logo?.secure_url) {
          this.imgSelected = this.company.logo.secure_url;
          this.imgCurrent = this.company.logo.secure_url;
        }
        this.ngZone.run(() => {
          $('#color-picker').spectrum({ type: 'component' });
        });
      },
      error: (err) => {
        console.log(err);
        this.load_data = false;
      },
    });
  }

  add_channel() {
    let new_chanel = this.new_channel.nativeElement.value;
    if (new_chanel) {
      this.company.channels.push({ name: new_chanel });
      this.new_channel.nativeElement.value = '';
    } else {
      Swal.fire('Ups!', 'Debe ingresa el nombre de un canal.', 'error');
    }
  }

  del_channel(id: any) {
    this.company.channels.splice(id, 1);
  }

  add_variety() {
    let new_variety = this.new_variety.nativeElement.value;
    if (new_variety) {
      this.company.varieties.push({ name: new_variety });
      this.new_variety.nativeElement.value = '';
    } else {
      Swal.fire('Ups!', 'Debe ingresa el nombre de una variedad.', 'error');
    }
  }

  del_variety(id: any) {
    this.company.varieties.splice(id, 1);
  }

  update() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    if (this.file) {
      const img = this.fb.control(this.file);
      this.myForm.addControl('logo', img);
    }

    const color = $('#color-picker').spectrum('get').toHexString();
    this.myForm.controls['branding'].setValue(color);
    this.load_btn = true;
    this.publicService.update_company(this.myForm.value).subscribe({
      next: (res) => {
        this.load_btn = false;
        if (res.data) {
          Swal.fire('Listo', 'Se actualizó correctamente', 'success');
        } else {
          Swal.fire('', res.msg, 'error');
        }
      },
      error: (err) => {
        this.load_btn = false;
        console.log(err);
      },
    });
  }

  validators(field: string) {
    const input = this.myForm.controls[field];
    return input.errors && input.touched;
  }

  message(field: string, title: string) {
    return validation(field, title, this.myForm);
  }

  fileChanged(event: any) {
    this.publicService.uploadImage(event).subscribe((res) => {
      if (res) {
        this.imgSelected = res;
        this.file = event.target.files[0];
      } else {
        this.imgSelected = this.imgCurrent;
        this.file = undefined;
      }
    });
  }
}
