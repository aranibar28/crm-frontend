import { Component, NgZone, OnInit } from '@angular/core';
import { KpisService } from 'src/app/services/kpis.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-performance-account',
  templateUrl: './performance-account.component.html',
})
export class PerformanceAccountComponent implements OnInit {
  public year = moment().format('YYYY');
  public month = moment().format('MM');

  public background = ['#6993FF', '#1BC5BD', '#8950FC', '#FFA800', '#F64E60'];
  public border = ['#6993FF', '#1BC5BD', '#8950FC', '#FFA800', '#F64E60'];

  constructor(private kpisService: KpisService, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.ngZone.run(() => {
      this.init_data();
    });
  }

  init_data() {
    this.init_graphics_7();
    this.init_graphics_8();
    this.init_graphics_9();
    this.init_graphics_10();
  }

  refresh() {
    this.year = moment().format('YYYY');
    this.month = moment().format('MM');
  }

  init_graphics_7() {
    this.kpisService.kpi_month_type(this.year, this.month).subscribe({
      next: (res) => {
        $('#myChart_7').remove();
        $('#content_chart_7').html('<canvas id="myChart_7""></canvas>');
        const ctx = <HTMLCanvasElement>document.getElementById('myChart_7');
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Productos', 'Servicios'],
            datasets: [
              {
                label: 'Ingresos 2022',
                data: res.data,
                backgroundColor: this.background,
                borderColor: this.border,
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { stacked: true },
            },
            plugins: {
              tooltip: {
                enabled: false,
              },
              datalabels: {
                align: 'center',
                color: '#fff',
                formatter: (value, context) => {
                  const datapoints = context.chart.data.datasets[0].data;

                  function totalSum(total: any, datapoint: any) {
                    return total + datapoint;
                  }
                  const totalValue = datapoints.reduce(totalSum, 0);
                  const percentValue = ((value / totalValue) * 100).toFixed(1);
                  const display = ['Ingreso: S/.' + value, percentValue + '%'];
                  return display;
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });
      },
    });
  }

  init_graphics_8() {
    this.kpisService.kpi_month_method(this.year, this.month).subscribe({
      next: (res) => {
        $('#myChart_8').remove();
        $('#content_chart_8').html('<canvas id="myChart_8""></canvas>');
        const ctx = <HTMLCanvasElement>document.getElementById('myChart_8');
        new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Transferencia', 'Depósito', 'Paypal', 'Tarjeta Crédito'],
            datasets: [
              {
                label: 'Ingresos 2022',
                data: res.data,
                backgroundColor: this.background,
                borderColor: this.border,
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { stacked: true },
            },
            plugins: {
              datalabels: {
                align: 'center',
                color: '#fff',
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

  init_graphics_9() {
    this.kpisService.kpi_course_earnings(this.year, this.month).subscribe({
      next: (res) => {
        $('#myChart_9').remove();
        $('#content_chart_9').html(
          '<canvas id="myChart_9" height="300""></canvas>'
        );
        const ctx = <HTMLCanvasElement>document.getElementById('myChart_9');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: res.arr_courses,
            datasets: [
              {
                label: 'Ingresos 2022',
                data: res.arr_amounts,
                backgroundColor: this.background,
                borderColor: this.border,
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              datalabels: {
                align: 'center',
                color: '#000',
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

  init_graphics_10() {
    this.kpisService.kpi_product_earnings(this.year, this.month).subscribe({
      next: (res) => {
        $('#myChart_10').remove();
        $('#content_chart_10').html(
          '<canvas id="myChart_10" height="300""></canvas>'
        );
        const ctx = <HTMLCanvasElement>document.getElementById('myChart_10');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: res.arr_products,
            datasets: [
              {
                label: 'Ingresos 2022',
                data: res.arr_amounts,
                backgroundColor: this.background,
                borderColor: this.border,
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              datalabels: {
                align: 'center',
                color: '#000',
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
