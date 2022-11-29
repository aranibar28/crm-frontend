import { Component, NgZone, OnInit } from '@angular/core';
import { KpisService } from 'src/app/services/kpis.service';
import * as moment from 'moment';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-index-account',
  templateUrl: './index-account.component.html',
})
export class IndexAccountComponent implements OnInit {
  public year = moment().format('YYYY');
  public widgets = [];
  public load_num = true;

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

  constructor(private kpisService: KpisService, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.init_data();
    this.init_graphics_1();
  }

  init_data() {
    this.kpisService.kpi_month_payments().subscribe({
      next: ({ widgets }) => {
        this.widgets = widgets;
        this.load_num = false;
      },
    });
  }

  init_graphics_1() {
    this.kpisService.kpi_month_payments().subscribe({
      next: ({ arr_months, arr_amounts }) => {
        const ctx = <HTMLCanvasElement>document.getElementById('myChart_1');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: arr_months,
            datasets: [
              {
                label: 'Ingresos ' + this.year,
                data: arr_amounts,
                backgroundColor: this.background,
                borderColor: this.border,
                borderWidth: 2,
              },
            ],
          },
          options: {
            plugins: {
              datalabels: {
                align: 'top',
                formatter: (value, context) => {
                  return 'S/.' + value;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });
      },
    });
  }
}
