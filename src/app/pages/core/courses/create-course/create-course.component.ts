import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PublicService } from 'src/app/services/public.service';
import { CourseService } from 'src/app/services/course.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
})
export class CreateCourseComponent implements OnInit {
  public imgSelected: any = 'assets/images/resources/default.png';
  public imgCurrent: any = 'assets/images/resources/default.png';
  public load_btn: boolean = false;
  public file: File | undefined;

  constructor(
    private courseService: CourseService,
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
    this.courseService.create_course(this.myForm.value).subscribe({
      next: (res) => {
        this.load_btn = false;
        if (res.data) {
          this.router.navigateByUrl('/courses');
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
    const file = event.target.files[0];
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
          Swal.fire('', 'El archivo debe ser una imagen', 'error');
        }
      } else {
        this.file = undefined;
        this.imgSelected = this.imgCurrent;
        Swal.fire('', 'La imagen no puede superar los 4MB', 'error');
      }
    }
  }
}
