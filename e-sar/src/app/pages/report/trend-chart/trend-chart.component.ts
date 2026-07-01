import {
  Component,
  ViewChild,
  ElementRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Chart,
  registerables
} from 'chart.js';

import ChartDataLabels from 'chartjs-plugin-datalabels';

import { ReportService } from '../../../services/report.service';

import html2canvas from 'html2canvas';

// Register Chart.js
Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-trend-chart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './trend-chart.component.html',
  styleUrl: './trend-chart.component.scss'
})
export class TrendChartComponent {

  constructor(
    private reportService: ReportService
  ) { }

  // Canvas
  @ViewChild('trendCanvas')
  canvas!: ElementRef<HTMLCanvasElement>;

  // Chart Instance
  chart!: Chart;

  // Dropdown KPI
  indicators: any[] = [];

  selectedIndicator!: number;

  searchIndicator = '';

  // จำนวนปี
  selectedYears = 3;

  trendDirection = 'up';

  trendColor = '#16a34a';

  ngOnInit() {

    this.reportService
      .getIndicators()
      .subscribe((res: any[]) => {

        this.indicators = res;

        if (res.length > 0) {

          this.selectedIndicator = res[0].indicator_id;

          this.loadChart();

        }

      });

  }

  search() {

    this.loadChart();

  }

  // ===== จะสร้างจริงใน Part 2 =====
  loadChart() {

    this.reportService
      .getTrend(
        this.selectedIndicator,
        this.selectedYears
      )
      .subscribe((rows: any[]) => {

        // เรียงปี
        rows.sort(
          (a, b) =>
            Number(a.year_name) -
            Number(b.year_name)
        );

        const labels =
          rows.map(x => x.year_name);

        const values =
          rows.map(x => Number(x.result_value));

        const last = rows[rows.length - 1];
        const previous = rows[rows.length - 2];

        // รีเซ็ตก่อน
        this.trendDirection = '';
        this.trendColor = '#16a34a';

        if (previous) {

          const current = Number(last.result_value);
          const old = Number(previous.result_value);
          const target = Number(last.target_value);

          const direction = String(last.target_direction)
            .trim()
            .toUpperCase();

          // ค่าเท่าเดิม
          if (current === old) {

            this.trendDirection = '';

          }

          // HIGHER_BETTER
          else if (
            direction === 'HIGHER_BETTER' &&
            current > old &&
            current >= target
          ) {

            this.trendDirection = 'up';
            this.trendColor = '#16a34a';

          }

          // LOWER_BETTER
          else if (
            direction === 'LOWER_BETTER' &&
            current < old &&
            current <= target
          ) {

            this.trendDirection = 'down';
            this.trendColor = '#16a34a';

          }

        }

        // ถ้ามีกราฟเดิมให้ลบทิ้ง
        if (this.chart) {
          this.chart.destroy();
        }

        // สร้างกราฟใหม่
        this.chart = new Chart(
          this.canvas.nativeElement,
          {
            type: 'bar',

            data: {

              labels: labels,

              datasets: [

                // ======================
                // Bar
                // ======================

                {

                  type: 'bar',

                  label: 'ผลลัพธ์',

                  data: values,

                  backgroundColor: '#63b3ff',

                  borderRadius: 10,

                  borderSkipped: false,

                  barThickness: 60

                },

                // ======================
                // Trend Line
                // ======================

                {

                  type: 'line',

                  label: 'แนวโน้ม',

                  data: values,

                  borderColor: '#ff5722',

                  backgroundColor: '#ff5722',

                  borderWidth: 3,

                  tension: 0.3,

                  fill: false,

                  pointRadius: 5,

                  datalabels: {
                    display: false
                  }
                }

              ]

            },

            options: {

              responsive: true,

              maintainAspectRatio: false,

              plugins: {

                legend: {

                  display: true

                },

                datalabels: {

                  anchor: 'end',

                  align: 'top',

                  color: '#000',

                  font: {

                    size: 13,

                    weight: 'bold'

                  },

                  formatter(value) {

                    return Number(value).toFixed(2);

                  }

                }

              },

              scales: {

                y: {

                  beginAtZero: false,

                  grace: '10%'

                }

              }

            }

          }

        );

      });

  }

  get filteredIndicators() {

    if (!this.searchIndicator) {

      return this.indicators;

    }

    const keyword = this.searchIndicator.toLowerCase();

    return this.indicators.filter(x =>

      x.indicator_code.toLowerCase().includes(keyword)

      ||

      x.indicator_name.toLowerCase().includes(keyword)

    );

  }

  exportChart() {

    const chart =
      document.getElementById('trendChart');

    if (!chart) {

      return;

    }

    html2canvas(chart, {

      scale: 3

    }).then(canvas => {

      const link =
        document.createElement('a');

      link.download =
        'TrendChart.png';

      link.href =
        canvas.toDataURL('image/png');

      link.click();

    });

  }

}