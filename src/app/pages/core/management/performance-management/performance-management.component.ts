import { Component, NgZone, OnInit } from '@angular/core';
import { KpisService } from 'src/app/services/kpis.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';
import * as moment from 'moment';

@Component({
  selector: 'app-performance-management',
  templateUrl: './performance-management.component.html',
})
export class PerformanceManagementComponent implements OnInit {
  public background = ['#6993FF', '#1BC5BD', '#8950FC', '#FFA800', '#F64E60'];
  public year = moment().format('YYYY');
  public load_num = true;
  public widgets = [];

  constructor(private kpisService: KpisService, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.init_data();
    this.ngZone.run(() => {
      this.init_graphics_2();
      this.init_graphics_3();
      this.init_graphics_4();
      this.init_graphics_5();
      this.init_graphics_6();
    });
  }

  init_data() {
    this.kpisService.kpi_month_payments().subscribe({
      next: ({ widgets }) => {
        this.widgets = widgets;
        this.load_num = false;
      },
    });
  }

  init_graphics_2() {
    this.kpisService.kpi_month_prospects().subscribe({
      next: ({ arr_months, arr_counts1, arr_counts2 }) => {
        const ctx = <HTMLCanvasElement>document.getElementById('myChart_2');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: arr_months,
            datasets: [
              {
                label: 'Prospectos',
                data: arr_counts1,
                backgroundColor: ['#1BC5BD'],
                borderColor: ['#1BC5BD'],
                borderWidth: 2,
              },
              {
                label: 'Clientes',
                data: arr_counts2,
                backgroundColor: ['#8950FC'],
                borderColor: ['#8950FC'],
                borderWidth: 2,
              },
            ],
          },
          options: {
            plugins: {
              datalabels: {
                color: '#fff',
              },
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: { stacked: true },
              y: { stacked: true },
            },
          },
          plugins: [ChartDataLabels],
        });
      },
    });
  }

  init_graphics_3() {
    this.kpisService.kpi_genre_prospects().subscribe({
      next: ({ genre }) => {
        const ctx = <HTMLCanvasElement>document.getElementById('myChart_3');
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Masculino', 'Femenino'],
            datasets: [
              {
                label: 'Géneros',
                data: genre,
                backgroundColor: ['#6993FF', '#8950FC'],
                borderColor: ['#6993FF', '#8950FC'],
                borderWidth: 2,
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
                  const datapoints = context.chart.data.datasets[0].data;
                  function totalSum(total: number, datapoint: any) {
                    return total + datapoint;
                  }
                  const totalValue = datapoints.reduce(totalSum, 0);
                  const percentValue = ((value / totalValue) * 100).toFixed(1);
                  return percentValue + '%';
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });
      },
    });
  }

  init_graphics_4() {
    this.kpisService.kpi_top_products().subscribe({
      next: ({ arr_products, arr_counts }) => {
        const ctx = <HTMLCanvasElement>document.getElementById('myChart_4');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: arr_products,
            datasets: [
              {
                label: 'Productos',
                data: arr_counts,
                backgroundColor: this.background,
                borderColor: ['#CCC'],
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              datalabels: {
                color: '#fff',
              },
              tooltip: {
                callbacks: {
                  title: (context): any => {
                    return context[0].label.split(',').join(' ');
                  },
                },
              },
            },
          },
          plugins: [ChartDataLabels],
        });
      },
    });
  }

  init_graphics_5() {
    this.kpisService.kpi_top_courses().subscribe({
      next: ({ arr_courses, arr_counts }) => {
        const ctx = <HTMLCanvasElement>document.getElementById('myChart_5');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: arr_courses,
            datasets: [
              {
                label: 'Cursos',
                data: arr_counts,
                backgroundColor: this.background,
                borderColor: ['#CCC'],
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              datalabels: {
                color: '#fff',
              },
              tooltip: {
                callbacks: {
                  title: (context): any => {
                    return context[0].label.split(',').join(' ');
                  },
                },
              },
            },
          },

          plugins: [ChartDataLabels],
        });
      },
    });
  }

  init_graphics_6() {
    this.kpisService.kpi_top_customers().subscribe({
      next: ({ arr_customer, arr_amounts }) => {
        const ctx = <HTMLCanvasElement>document.getElementById('myChart_6');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: arr_customer,
            datasets: [
              {
                label: 'Clientes',
                data: arr_amounts,
                backgroundColor: this.background,
                borderColor: ['#CCC'],
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  title: (context): any => {
                    return context[0].label.split(',').join(' ');
                  },
                },
              },
              datalabels: {
                align: 'center',
                color: '#fff',
                formatter: (value) => {
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
