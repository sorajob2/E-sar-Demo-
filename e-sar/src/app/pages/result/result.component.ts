import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { ResultService }
  from '../../services/result.service';

import { Router } from '@angular/router';

import { KpiService }
  from '../../services/kpi.service';

import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss'
})
export class ResultComponent implements OnInit {

  indicatorId!: number;

  results: any[] = [];

  kpi: any = null;

  categoryId!: number;
  strategyId!: number;
  planId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private resultService: ResultService,
    private kpiService: KpiService,
    private nav: NavigationService
  ) { }

  ngOnInit() {

    this.indicatorId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.strategyId = Number(
      this.route.snapshot.queryParamMap.get('strategyId')
    );

    this.planId = Number(
      this.route.snapshot.queryParamMap.get('planId')
    );

    this.categoryId = Number(
      this.route.snapshot.queryParamMap.get('categoryId')
    );

    this.nav.categoryId = this.categoryId;

    this.nav.indicatorId = this.indicatorId;

    this.loadKpi();

    this.loadResults();

  }

  loadResults() {

    this.resultService
      .getByIndicator(this.indicatorId)
      .subscribe(data => {

        this.results = data;

      });

  }

  deleteResult(id: number) {

    if (!confirm('ต้องการลบหรือไม่?')) {
      return;
    }

    this.resultService
      .delete(id)
      .subscribe({

        next: () => {

          this.loadResults();

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  loadKpi(): void {

    this.kpiService
      .getById(this.indicatorId)
      .subscribe({

        next: (data: any) => {

          this.kpi = data;

        },

        error: (err: any) => {

          console.error(err);

        }

      });

  }

  goBack() {

    if (this.authService.isStaff()) {

      this.router.navigate([
        '/my-kpi-detail',
        this.indicatorId
      ]);

    } else {

      this.router.navigate(
        ['/result', this.indicatorId],
        {
          queryParams: {
            categoryId: this.categoryId,
            strategyId: this.strategyId,
            planId: this.planId
          }
        }
      );

    }

  }

}