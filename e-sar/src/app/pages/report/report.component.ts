import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../services/report.service';

import { FiscalYearService } from '../../services/fiscal-year.service';

import { StrategicPlanService } from '../../services/strategic-plan.service';

import { StrategyService } from '../../services/strategy.service';

import { CategoryService } from '../../services/category.service';

import { ReportChartComponent }
  from '../../shared/components/report-chart/report-chart.component';

import { TrendChartComponent }
  from './trend-chart/trend-chart.component';

import * as XLSX from 'xlsx';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReportChartComponent,
    TrendChartComponent
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})



export class ReportComponent {

  constructor(

    private reportService: ReportService,

    private fiscalYearService: FiscalYearService,

    private planService: StrategicPlanService,

    private strategyService: StrategyService,

    private categoryService: CategoryService

  ) { }

  ngOnInit() {

    this.loadMaster();

  }

  reportType = 'kpi';

  yearId = '';

  planId = '';

  strategyId = '';

  categoryId = '';

  quarterId = '';

  viewMode = 'quarter';

  tableRows: any[] = [];

  years: any[] = [];

  plans: any[] = [];

  strategies: any[] = [];

  categories: any[] = [];

  rows: any[] = [];

  indicators: any[] = [];

  indicatorId = '';

  searchIndicator = '';

  selectedIndicatorName = '';


  search() {

    const item = this.indicators.find(
      x => x.indicator_id == this.indicatorId
    );

    this.selectedIndicatorName =
      item
        ? item.indicator_code + ' - ' + item.indicator_name
        : '';


    console.log({

      type: this.reportType,

      year: this.yearId,

      plan: this.planId,

      strategy: this.strategyId,

      category: this.categoryId,

      quarter: this.quarterId

    });

    this.loadReport();

  }

  buildExportData() {

    switch (this.reportType) {

      case 'plan':

        return this.tableRows.map((r: any) => ({

          'แผนกลยุทธ์': r.plan_name,
          'จำนวน KPI': r.total_kpi,
          'บรรลุ': r.success,
          'ไม่บรรลุ': r.failed

        }));


      case 'strategy':

        return this.tableRows.map((r: any) => ({

          'ยุทธศาสตร์': r.strategy_name,
          'จำนวน KPI': r.total_kpi,
          'บรรลุ': r.success,
          'ไม่บรรลุ': r.failed

        }));


      case 'category':

        return this.tableRows.map((r: any) => ({

          'หมวดหมู่': r.category_name,
          'จำนวน KPI': r.total_kpi,
          'บรรลุ': r.success,
          'ไม่บรรลุ': r.failed

        }));


      case 'kpi':

        return this.tableRows.map((r: any) => ({

          'แผนกลยุทธ์': r.plan_name,
          'ยุทธศาสตร์': r.strategy_name,
          'หมวดหมู่': r.category_name,
          'รหัส KPI': r.indicator_code,
          'ชื่อ KPI': r.indicator_name,
          'เป้าหมาย': r.target_value,
          'ผลลัพธ์': r.result_value,
          'สถานะ': this.isSuccess(r)
            ? '✔ บรรลุ'
            : '✘ ไม่บรรลุ'

        }));


      case 'quarter':

        return this.tableRows.map((r: any) => ({

          'ไตรมาส': r.quarter_name,
          'รหัส KPI': r.indicator_code,
          'ชื่อ KPI': r.indicator_name,
          'เป้าหมาย': r.target_value,
          'ผลลัพธ์': r.result_value,
          'สถานะ': this.isSuccess(r)
            ? '✔ บรรลุ'
            : '✘ ไม่บรรลุ'

        }));


      case 'indicator':

        return this.tableRows.map((r: any) => ({

          'ปีการศึกษา': r.year_name,
          'ไตรมาส': r.quarter_name,
          'เป้าหมาย': r.target_value,
          'ผลลัพธ์': this.viewMode === 'quarter'
            ? r.cumulative_result
            : r.result_value,
          'สถานะ': this.isSuccess(r)
            ? '✔ บรรลุ'
            : '✘ ไม่บรรลุ'

        }));


      default:

        return [];

    }

  }

  exportExcel() {

    const rows = this.buildExportData();

    const worksheet = XLSX.utils.json_to_sheet(rows);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      'Report'

    );

    const excelBuffer = XLSX.write(

      workbook,

      {

        bookType: 'xlsx',

        type: 'array'

      }

    );

    const blob = new Blob(

      [excelBuffer],

      {

        type:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

      }

    );

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;

    link.download =

      `Report_${this.reportType}.xlsx`;

    link.click();

    window.URL.revokeObjectURL(url);

    if (rows.length === 0) {

      alert('ไม่มีข้อมูล');

      return;

    }

  }

 exportPdf() {

  const data = document.getElementById('report-content');

  if (!data) {

    return;

  }

  html2canvas(data, {

    scale: 2

  }).then(canvas => {

    const imgWidth = 297;

    const pageHeight = 210;

    const imgHeight =
      canvas.height * imgWidth / canvas.width;

    let heightLeft = imgHeight;

    const pdf = new jsPDF(

      'l',

      'mm',

      'a4'

    );

    const imgData =
      canvas.toDataURL('image/png');

    let position = 0;

    pdf.addImage(

      imgData,

      'PNG',

      0,

      position,

      imgWidth,

      imgHeight

    );

    heightLeft -= pageHeight;

    while (heightLeft > 0) {

      position =

        heightLeft - imgHeight;

      pdf.addPage();

      pdf.addImage(

        imgData,

        'PNG',

        0,

        position,

        imgWidth,

        imgHeight

      );

      heightLeft -= pageHeight;

    }

    pdf.save(

      `Report_${this.reportType}.pdf`

    );

  });

}

  loadMaster() {

    this.fiscalYearService
      .getAll()
      .subscribe(res => {

        this.years = res;

      });

    this.planService
      .getAll()
      .subscribe(res => {

        this.plans = res;

      });

    this.strategyService
      .getAll()
      .subscribe(res => {

        this.strategies = res;

      });

    this.categoryService
      .getAll()
      .subscribe(res => {

        this.categories = res;

      });

    this.reportService
      .getIndicators()
      .subscribe(res => {

        this.indicators = res;

      });

  }

  loadReport() {

    // ==========================
    // รายงานรายตัวชี้วัด
    // ==========================

    if (this.reportType === 'indicator') {

      if (this.viewMode === 'quarter') {

        this.reportService

          .getIndicatorQuarter(

            Number(this.indicatorId),

            Number(this.yearId)

          )

          .subscribe(res => {

            this.rows = res;

            if (this.reportType === 'indicator' &&
              this.viewMode === 'quarter') {

              let cumulative = 0;

              this.tableRows = res.map((x: any) => {

                cumulative += Number(x.result_value);

                return {

                  ...x,

                  cumulative_result: cumulative

                };

              });

            }
            else {

              this.tableRows = res;

            }

          });

      }

      else {

        this.reportService.getIndicatorYear(
          Number(this.indicatorId),
          Number(this.yearId)
        )

          .subscribe(res => {

            this.rows = res;

            if (this.reportType === 'indicator' &&
              this.viewMode === 'quarter') {

              let cumulative = 0;

              this.tableRows = res.map((x: any) => {

                cumulative += Number(x.result_value);

                return {

                  ...x,

                  cumulative_result: cumulative

                };

              });

            }
            else {

              this.tableRows = res;

            }

          });

      }

      return;

    }

    // ==========================
    // รายงานปกติ
    // ==========================

    this.reportService.getReport(

      this.reportType,

      {

        year_id: this.yearId,

        plan_id: this.planId,

        strategy_id: this.strategyId,

        category_id: this.categoryId,

        quarter_id: this.quarterId

      }

    )

      .subscribe(res => {

        this.rows = res;
        this.tableRows = res;

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

  isSuccess(row: any): boolean {

    const value = this.viewMode === 'quarter'
      ? Number(row.cumulative_result ?? row.result_value)
      : Number(row.result_value);

    const target = Number(row.target_value);

    if (row.target_direction === 'HIGHER_BETTER') {
      return value >= target;
    }

    return value <= target;

  }
}