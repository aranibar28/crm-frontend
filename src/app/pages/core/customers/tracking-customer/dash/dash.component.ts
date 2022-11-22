import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProspectService } from 'src/app/services/prospect.service';
import Chart from 'chart.js/auto';
import * as moment from 'moment';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
})
export class DashComponent implements OnInit {
  public year = moment().format('YYYY');
  public id = this.activatedRoute.snapshot.parent?.params['id'];
  public activities: Array<any> = [];
  public load_num: boolean = true;

  public background = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
  ];

  public border = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private prospectService: ProspectService
  ) {}

  ngOnInit(): void {
    this.init_data();
    this.init_graphics_1();
  }

  init_data() {
    this.load_num = true;
    this.prospectService.kpis_prospect(this.id).subscribe({
      next: (res) => {
        this.activities = res.data;
        this.load_num = false;
      },
    });
  }

  init_graphics_1() {
    this.prospectService.kpis_prospect(this.id).subscribe({
      next: ({ arr_months, arr_calls, arr_mails, arr_tasks }) => {
        const ctx = <HTMLCanvasElement>document.getElementById('myChart_1');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: arr_months,
            datasets: [
              {
                label: 'Llamadas',
                data: arr_calls,
                backgroundColor: this.background,
                borderColor: this.border,
                borderWidth: 2,
              },
              {
                label: 'Correos',
                data: arr_mails,
                backgroundColor: this.background,
                borderColor: this.border,
                borderWidth: 2,
              },
              {
                label: 'Tareas',
                data: arr_tasks,
                backgroundColor: this.background,
                borderColor: this.border,
                borderWidth: 2,
              },
            ],
          },
        });
      },
    });
  }
}
