import { Component, NgZone, OnInit } from '@angular/core';
import { KpisService } from 'src/app/services/kpis.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { cards } from 'src/app/utils/widgets';
import Chart from 'chart.js/auto';
import * as moment from 'moment';

@Component({
  selector: 'app-index-account',
  templateUrl: './index-account.component.html',
})
export class IndexAccountComponent implements OnInit {
  public year = moment().format('YYYY');
  public cards: any[] = cards;
  public widgets: any[] = [];
  public load_data = true;
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
    this.init_cards();
    this.init_widgets();
    this.init_graphics_1();
  }

  init_cards() {
    this.load_data = true;
    this.kpisService.kpi_widgets().subscribe({
      next: (res) => {
        for (let [index, item] of this.cards.entries()) {
          item.data = res.widgets[index] || 0;
          index++;
        }
        this.load_data = false;
      },
    });
  }

  init_widgets() {
    this.kpisService.kpi_month_payments().subscribe({
      next: (res) => {
        this.widgets = res.widgets;
        this.load_num = false;
      },
    });
  }

  init_graphics_1() {
    this.kpisService.kpi_month_payments().subscribe({
      next: ({ arr_months, sales_amounts, inscriptions_amounts }) => {
        const ctx = <HTMLCanvasElement>document.getElementById('myChart_1');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: arr_months,
            datasets: [
              {
                label: 'Ventas',
                data: sales_amounts,
                backgroundColor: this.background,
                borderColor: this.border,
                borderWidth: 2,
              },
              {
                label: 'Matriculas',
                data: inscriptions_amounts,
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
