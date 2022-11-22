import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from 'src/app/services/employee.service';
import { ProspectService } from 'src/app/services/prospect.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
})
export class TaskComponent implements OnInit {
  @ViewChild('closeModal') closeModal!: ElementRef;
  public id = this.activatedRoute.snapshot.parent?.params['id'];
  public employees: Array<any> = [];
  public tasks: Array<any> = [];
  public initForm: any = {};
  public date = new Date();
  public load_data = true;
  public load_btn = false;
  public p: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private employeeService: EmployeeService,
    private prospectService: ProspectService,
    private fb: FormBuilder
  ) {}

  myForm: FormGroup = this.fb.group({
    title: [, [Validators.required]],
    date: [, [Validators.required]],
    time: ['12:00', [Validators.required]],
    type: ['', [Validators.required]],
    priority: ['', [Validators.required]],
    note: [, [Validators.required]],
    employee: ['', [Validators.required]],
    customer: [this.id, [Validators.required]],
  });

  ngOnInit(): void {
    this.init_advisors();
    this.init_data();
    this.initForm = this.myForm.value;
  }

  init_advisors() {
    this.employeeService.list_advisors().subscribe({
      next: (res) => {
        this.employees = res;
      },
    });
  }

  init_data() {
    this.prospectService.read_tasks(this.id).subscribe({
      next: (res) => {
        this.tasks = res.data;
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
    this.prospectService.create_task(this.myForm.value).subscribe({
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

  make_task(id: any) {
    Swal.fire({
      title: 'Marcar esta tarea?',
      text: 'Desea marcar esta tarea como hecho',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#8950FC',
      cancelButtonColor: '#f1416c',
      confirmButtonText: 'Confirmar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.prospectService.make_task(id).subscribe({
          next: (res) => {
            if (res.data) {
              Swal.fire('Listo', 'Tarea realizada.', 'success');
              this.init_data();
            } else {
              Swal.fire('Error', res.msg, 'error');
            }
          },
          error: (err) => {
            Swal.fire('Error', err.msg, 'error');
          },
        });
      }
    });
  }

  show_task(item: any) {
    Swal.fire({
      icon: 'info',
      title: 'Tarea marcado por:',
      text: `${item.employee_make?.full_name || 'Sin Marcar'}`,
    });
  }

  validators(name: string) {
    const input = this.myForm.controls[name];
    return input.errors && input.touched;
  }
}
