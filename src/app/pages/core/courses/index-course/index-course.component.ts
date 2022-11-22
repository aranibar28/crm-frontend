import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/services/course.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index-course',
  templateUrl: './index-course.component.html',
})
export class IndexCourseComponent implements OnInit {
  public default_path = 'assets/images/resources/default.png';
  public courses: Array<any> = [];
  public courses_arr: Array<any> = [];

  public load_data: boolean = true;
  public keyword: string = '';
  public sort = false;
  public p: number = 1;

  constructor(public courseService: CourseService) {}

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this.courseService.read_courses().subscribe({
      next: (res) => {
        this.load_data = false;
        this.courses = res.data;
        this.courses_arr = res.data;
      },
      error: (err) => {
        this.load_data = false;
        console.log(err);
      },
    });
  }

  change_status(event: any, id: any) {
    let status = event.target.checked;
    let word = status ? 'activado' : 'desactivado';
    this.courseService.change_status(id, { status }).subscribe({
      next: (res) => {
        if (res.data) {
          Swal.fire('Listo', `Estado ${word}.`, 'success');
        } else {
          this.init_data();
          Swal.fire('Error', res.msg, 'error');
        }
      },
    });
  }

  delete_item(item: any) {
    Swal.fire({
      title: 'Eliminar Curso',
      text: `¿Desea eliminar el Curso ${item.title}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#39afd1',
      cancelButtonColor: '#fa5c7c',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.delete_course(item._id).subscribe((res) => {
          if (res.data) {
            this.p = 1;
            this.init_data();
            Swal.fire('Listo!', `Curso ${item.title} eliminado.`, 'success');
          } else {
            Swal.fire('Error!', res.msg, 'error');
          }
        });
      }
    });
  }

  search() {
    if (this.keyword) {
      var term = new RegExp(this.keyword, 'i');
      this.courses = this.courses_arr.filter((item) => term.test(item.title));
    } else {
      this.courses = this.courses_arr;
    }
  }

  sortby = (key: string) => {
    this.sort = !this.sort;
    let direction = this.sort ? 1 : -1;
    this.courses.sort((a: any, b: any) => {
      if (a[key] < b[key]) {
        return 1 * direction;
      }
      if (a[key] > b[key]) {
        return -1 * direction;
      }
      return 0;
    });
  };
}
