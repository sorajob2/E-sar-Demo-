import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { CommonModule } from '@angular/common';

import { BaseChartDirective } from 'ng2-charts';

import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-report-chart',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective
  ],
  templateUrl: './report-chart.component.html',
  styleUrls: ['./report-chart.component.scss']
})
export class ReportChartComponent
  implements OnChanges {

  @Input() displayMode = 'quarter';

  @Input() rows: any[] = [];

  @Input() reportType = 'kpi';

  @Input() indicatorName = '';



  chartType: 'bar' = 'bar';

  chartData: ChartData<'bar'> = {

    labels: [],

    datasets: []

  };

  chartOptions: ChartConfiguration<'bar'>['options'] = {

    responsive: true,

    plugins: {

      legend: {
        labels: {
          font: {
            size: 20,
            weight: 'bold'
          }
        }
      },

      datalabels: {

        color: '#000',

        anchor: 'center',

        align: 'center',

        font: {
          size: 14.5,          // ← ปรับเป็น 22 หรือ 24
          weight: 'bold'
        }

      }

    }

  };

  ngOnChanges(changes: SimpleChanges) {

    this.loadChart();

  }

  loadChart() {

    if (!this.rows.length) {

      this.chartData = {

        labels: [],

        datasets: []

      };

      return;

    }

    switch (this.reportType) {

      case 'plan':

        this.chartData = {

          labels: this.rows.map(x => x.plan_name),

          datasets: [

            {

              label: 'KPI บรรลุ',

              data: this.rows.map(x => x.success)

            }

          ]

        };

        break;

      case 'strategy':

        this.chartData = {

          labels: this.rows.map(x => x.strategy_name),

          datasets: [

            {

              label: 'KPI บรรลุ',

              data: this.rows.map(x => x.success)

            }

          ]

        };

        break;

      case 'category':

        this.chartData = {

          labels: this.rows.map(x => x.category_name),

          datasets: [

            {

              label: 'KPI บรรลุ',

              data: this.rows.map(x => x.success)

            }

          ]

        };

        break;

      case 'quarter':

        this.chartData = {

          labels: this.rows.map(x => x.indicator_code),

          datasets: [

            {

              label: 'ผลลัพธ์',

              data: this.rows.map(x => x.result_value)

            }

          ]

        };

        break;

      case 'indicator':

        if (this.displayMode === 'quarter') {

           const yearName = this.rows[0]?.year_name ?? '';

          let cumulative = 0;

          const cumulativeResult = this.rows.map(x => {

            cumulative += Number(x.result_value);

            return cumulative;

          });

          this.chartData = {

            labels: this.rows.map(x => {

              switch (x.quarter_name) {

                case 'Q1':
                  return 'ไตรมาส 1';

                case 'Q2':
                  return 'ไตรมาส 2';

                case 'Q3':
                  return 'ไตรมาส 3';

                case 'Q4':
                  return 'ไตรมาส 4';

                default:
                  return x.quarter_name;

              }

            }),

            datasets: [

              {

                label: `เป้าหมายรายปี (${yearName})`,

                data: this.rows.map(x => +x.target_value),

                backgroundColor: '#4dabf7'

              },

              {

                label: 'ผลลัพธ์สะสม',

                data: cumulativeResult,

                backgroundColor: '#ff6384'

              }

            ]

          };

        }

        else {

          this.chartData = {

            labels: this.rows.map(x => 'ปี ' + x.year_name),

            datasets: [

              {

                label: 'เป้าหมาย',

                data: this.rows.map(x => +x.target_value),

                backgroundColor: '#4dabf7'

              },

              {

                label: 'ผลลัพธ์',

                data: this.rows.map(x => +x.result_value),

                backgroundColor: '#ff6384'

              }

            ]

          };

        }

        break;

      default:

        this.chartData = {

          labels: this.rows.map(x => x.indicator_code),

          datasets: [

            {

              label: 'เป้าหมาย',

              data: this.rows.map(x => x.target_value)

            },

            {

              label: 'ผลลัพธ์',

              data: this.rows.map(x => x.result_value)

            }

          ]

        };

    }

  }

}