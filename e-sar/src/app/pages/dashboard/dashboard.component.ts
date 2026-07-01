import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardService }
  from '../../services/dashboard.service';
import { FormsModule } from '@angular/forms';

import { SettingService }
  from '../../services/setting.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  summary: any = {};

  strategies: any[] = [];

  categories: any[] = [];

  kpis: any[] = [];

  plans: any[] = [];

  searchStrategy = '';
  searchCategory = '';
  searchKpi = '';

  pendingKpis: any[] = [];

  currentYearId!: number;

  

  constructor(
    private dashboardService: DashboardService,
    private settingService: SettingService
  ) { }

  ngOnInit() {

    this.loadData();

    this.settingService
      .getCurrentYear()
      .subscribe((res: any) => {

        this.currentYearId = res.current_year_id;

        this.dashboardService
          .getPendingKpi(this.currentYearId)
          .subscribe(data => {

            this.pendingKpis = data;

          });

      });

  }

  loadData() {

    this.dashboardService
      .getSummary()
      .subscribe(res => {
        this.summary = res;
      });

    this.dashboardService
      .getStrategy()
      .subscribe(res => {
        this.strategies = res;
      });

    this.dashboardService
      .getCategory()
      .subscribe(res => {
        this.categories = res;
      });

    this.dashboardService
      .getKpi()
      .subscribe(res => {
        this.kpis = res;
      });

    this.dashboardService
      .getPlan()
      .subscribe(res => {

        this.plans = res;

      });

  }

  get filteredStrategies() {
    return this.strategies.filter((s: any) =>
      s.strategy_name
        .toLowerCase()
        .includes(this.searchStrategy.toLowerCase())
    );
  }

  get filteredCategories() {
    return this.categories.filter((c: any) =>
      c.category_name
        .toLowerCase()
        .includes(this.searchCategory.toLowerCase())
    );
  }

  get filteredKpis() {
    return this.kpis.filter((k: any) =>
      (
        k.indicator_code +
        ' ' +
        k.indicator_name
      )
        .toLowerCase()
        .includes(this.searchKpi.toLowerCase())
    );
  }

  loadPendingKpi() {

    this.dashboardService
      .getPendingKpi(this.currentYearId)
      .subscribe(data => {

        this.pendingKpis = data;

      });

  }

}