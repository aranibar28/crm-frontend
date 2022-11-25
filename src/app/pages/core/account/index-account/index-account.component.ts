import { Component, NgZone, OnInit } from '@angular/core';
import { KpisService } from 'src/app/services/kpis.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js/auto';
import * as moment from 'moment';

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
    this.ngZone.run(() => {
      this.init_graphics_1();
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
                backgroundColor: ['rgba(153, 102, 255, 0.2)'],
                borderColor: ['rgba(153, 102, 255, 1)'],
                borderWidth: 2,
              },
              {
                label: 'Clientes',
                data: arr_counts2,
                backgroundColor: ['rgba(75, 192, 192, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)'],
                borderWidth: 2,
              },
            ],
          },
          options: {
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
                backgroundColor: [
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 99, 132, 0.2)',
                ],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
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
                color: '#000',
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
                borderColor: this.border,
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
                borderColor: this.border,
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
                borderColor: this.border,
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
