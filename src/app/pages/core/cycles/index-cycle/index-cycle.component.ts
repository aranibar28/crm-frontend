import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from 'src/app/services/course.service';
import { CycleService } from 'src/app/services/cycle.service';
import { AuthService } from 'src/app/services/auth.service';
import { months } from 'src/app/utils/months';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index-cycle',
  templateUrl: './index-cycle.component.html',
})
export class IndexCycleComponent implements OnInit {
  public default_path = 'assets/images/resources/default.png';
  public allow: boolean = this.authService.isAdmin;

  public load_data: boolean = true;
  public load_btn: boolean = false;
  public id: any;
  public course: any = {};
  public cycles: Array<any> = [];
  public all_cycles: Array<any> = [];
  public p: number = 1;

  public filter = 'Todos';
  public months = months;

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private cycleService: CycleService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => (this.id = id));
    this.init_course();
    this.init_cycles();
  }

  init_course() {
    this.courseService.read_course_by_id(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.course = res.data;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  init_cycles() {
    this.cycleService.read_current_cycles(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.cycles = res.data;
          this.all_cycles = res.data;
        }
        this.load_data = false;
      },
      error: (err) => {
        console.log(err);
        this.load_data = false;
      },
    });
  }

  search() {
    if (this.filter === 'Todos') {
      this.cycles = this.all_cycles;
    } else {
      this.cycles = this.all_cycles.filter(
        (item) => item.cycle.nivel == this.filter
      );
    }
  }

  change_status(event: any, id: any) {
    let status = event.target.checked;
    this.cycleService.change_status_cycle(id, { status }).subscribe();
  }

  delete_item(item: any) {
    Swal.fire({
      title: 'Eliminar Ciclo',
      text: `¿Desea eliminar el Ciclo ${item.cycle.nivel}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#39afd1',
      cancelButtonColor: '#fa5c7c',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cycleService.delete_cycle(item.cycle._id).subscribe((res) => {
          if (res.data) {
            this.init_cycles();
            Swal.fire(
              'Listo',
              `Ciclo ${item.cycle.nivel} eliminado.`,
              'success'
            );
          } else {
            Swal.fire('Error', res.msg, 'error');
          }
        });
      }
    });
  }
}
