import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CycleService } from 'src/app/services/cycle.service';
import { EmployeeService } from 'src/app/services/employee.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-update-cycle',
  templateUrl: './update-cycle.component.html',
})
export class UpdateCycleComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef;
  public default_path = 'assets/images/resources/default.png';
  public date = new Date();
  public load_data: boolean = true;
  public load_btn: boolean = false;
  public load_btn_instructor: boolean = true;
  public data: boolean = false;

  public id_course: string = '';
  public id_cycle: string = '';
  public course: any = {};
  public cycle: any = {};
  public room: any = { room: '', start_time: '08:00', final_time: '09:45' };

  public days: Array<any> = [];
  public frequency: Array<any> = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private cycleService: CycleService,
    private employeeService: EmployeeService,
    private location: Location,
    private router: Router,
    private fb: FormBuilder
  ) {}

  myForm: FormGroup = this.fb.group({
    nivel: ['', [Validators.required]],
    sede: ['', [Validators.required]],
    price: [, [Validators.required]],
    start_date: [, [Validators.required]],
    final_date: [, [Validators.required]],
  });

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: ({ id, cycle }) => {
        this.id_course = id;
        this.id_cycle = cycle;
      },
    });
    this.init_data();
  }

  back(): void {
    this.location.back();
  }

  init_data() {
    this.cycleService
      .read_cycle_by_id(this.id_course, this.id_cycle)
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.course = res.data;
            this.cycle = res.cycle;
            this.frequency = res.rooms;
            this.data = true;
            this.myForm.patchValue(this.cycle);
            this.init_instructors();
            this.init_instructors_room();
          } else {
            this.data = false;
          }
          this.load_data = false;
        },
        error: (err) => {
          console.log(err);
          this.load_data = false;
        },
      });
  }

  update() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    this.load_btn = true;
    this.myForm.addControl('course', this.fb.control(this.id_course));
    this.cycleService.update_cycle(this.id_cycle, this.myForm.value).subscribe({
      next: (res) => {
        if (res.data) {
          this.router.navigate(['/courses/cycles/' + this.id_course]);
          Swal.fire('Listo', 'Datos Guardados', 'success');
        } else {
          Swal.fire('Error', res.msg, 'error');
        }
        this.load_btn = false;
      },
    });
  }

  select_day($event: any) {
    let status = $event.currentTarget.checked;
    let value = $event.target.value;
    if (status) {
      this.days.push(value);
    } else {
      this.days.forEach((element, index) => {
        if (element == value) {
          this.days.splice(index, 1);
        }
      });
    }
  }

  add_item() {
    if (!this.room.room) {
      Swal.fire('Error', 'Debe seleccionar un salón.', 'error');
    } else if (!this.room.aforo || this.room.aforo <= 0) {
      Swal.fire('Error', 'Debe ingresar un aforo válido.', 'error');
    } else if (!this.room.start_time || !this.room.final_time) {
      Swal.fire('Error', 'Debe ingresar un fecha.', 'error');
    } else if (this.days?.length <= 0) {
      Swal.fire('Error', 'Debe seleccionar por lo menos un día.', 'error');
    } else {
      this.room.course = this.id_course;
      this.room.cycle_course = this.id_cycle;
      this.room.frequency = this.days;
      this.cycleService.add_rooms_cycle(this.room).subscribe({
        next: (res) => {
          if (res.data) {
            this.init_data();
            this.days = [];
            this.room = { room: '', start_time: '08:00', final_time: '09:45' };
            $('.form-check-input').prop('checked', false);
            this.closeModal.nativeElement.click();
            Swal.fire('Listo', 'Salón agregado correctamente.', 'success');
          } else {
            Swal.fire('Error', res.msg, 'error');
          }
        },
      });
    }
  }

  delete_room(id: any, name: any) {
    Swal.fire({
      icon: 'question',
      title: 'Eliminar Salón',
      text: `¿Desea eliminar el ${name}?`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cycleService.del_rooms_cycle(id).subscribe((res) => {
          if (res.data) {
            Swal.fire('Listo', name + ' eliminado.', 'success');
            this.init_data();
          } else {
            Swal.fire('Advertencia', res.msg, 'warning');
          }
        });
      }
    });
  }

  validators(name: string) {
    const input = this.myForm?.controls[name];
    return input?.errors && input?.touched;
  }

  // GET INSTRUCTORS
  public instructors: Array<any> = [];
  public instructors_arr: Array<any> = [];
  public instructors_rooms: Array<any> = [];
  public instructor_room: any = { cycle_room: '' };
  public filter: string = '';

  init_instructors() {
    this.employeeService.list_instructors().subscribe({
      next: (res) => {
        this.instructors = res;
        this.instructors_arr = res;
      },
    });
  }

  init_instructors_room() {
    this.cycleService.list_instructors_room(this.id_cycle).subscribe({
      next: (res) => {
        this.instructors_rooms = res.data;
      },
    });
  }

  search_instructors() {
    if (this.filter) {
      var term = new RegExp(this.filter, 'i');
      this.instructors = this.instructors_arr.filter(
        (item) => term.test(item.full_name) || term.test(item.email)
      );
    } else {
      this.instructors = this.instructors_arr;
    }
  }

  select_instructor(item: any) {
    this.instructor_room.employee = item._id;
    $('#input_instructor').val(item.full_name);
    $('#modal_instructor').modal('hide');
    this.load_btn_instructor = false;
  }

  add_instructor() {
    this.instructor_room.cycle_course = this.id_cycle;
    const room = this.instructor_room.cycle_room;
    const employee = this.instructor_room.employee;
    if (!room || !employee) {
      Swal.fire('Ups!', 'Debe seleccionar un salón e instructor.', 'info');
    } else {
      this.cycleService.add_instructor_room(this.instructor_room).subscribe({
        next: (res) => {
          if (res.data) {
            this.instructor_room.employee = '';
            this.instructor_room.cycle_room = '';
            this.load_btn_instructor = true;
            $('#input_instructor').val('');
            this.init_data();
            Swal.fire('Listo', 'Se agregó correctamente los datos', 'success');
          } else {
            Swal.fire('Advertencia', res.msg, 'warning');
          }
        },
      });
    }
  }

  del_instructor(item: any) {
    const name = item.employee.full_name;
    Swal.fire({
      icon: 'question',
      title: 'Retirar Instructor',
      text: `¿Desea retirar el instructor ${name}?`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cycleService.del_instructor_room(item._id).subscribe((res) => {
          this.init_data();
          Swal.fire('Listo', name + ' retirado.', 'success');
        });
      }
    });
  }
}
