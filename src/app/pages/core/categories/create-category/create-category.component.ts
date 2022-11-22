import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicService } from 'src/app/services/public.service';
import { CategoryService } from 'src/app/services/category.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
})
export class CreateCategoryComponent implements OnInit {
  public imgSelected: any = 'assets/images/resources/product.png';
  public imgCurrent: any = 'assets/images/resources/product.png';
  public load_btn: boolean = false;
  public file: File | undefined;

  constructor(
    private categoryService: CategoryService,
    private publicService: PublicService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {}

  myForm: FormGroup = this.fb.group({
    title: [, [Validators.required, Validators.minLength(3)]],
    description: [, Validators.required],
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
    this.categoryService.create_category(this.myForm.value).subscribe({
      next: (res) => {
        this.load_btn = false;
        if (res.data) {
          this.router.navigateByUrl('/categories');
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

  validators(item: string) {
    const input = this.myForm.controls[item];
    return input.errors && input.touched;
  }

  message(item: string, title: string) {
    return this.publicService.validation(item, title, this.myForm);
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
