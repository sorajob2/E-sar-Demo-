import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { KpiService }
  from '../../services/kpi.service';

import { TargetService } from '../../services/target.service';
import { ResultService } from '../../services/result.service';

import { NavigationService } from '../../services/navigation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kpi-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './kpi-detail.component.html',
  styleUrl: './kpi-detail.component.scss'
})
export class KpiDetailComponent
  implements OnInit {

  kpi: any = null;
  targets: any[] = [];
  results: any[] = [];
  timeline: any[] = [];

  categoryId!: number;

  strategyId!: number;

  planId!: number;


  constructor(
    private route: ActivatedRoute,
    private kpiService: KpiService,
    private targetService: TargetService,
    private resultService: ResultService,
    private router: Router,
    private nav: NavigationService
  ) { }

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.categoryId = Number(
      this.route.snapshot.queryParamMap.get('categoryId')
    );

    this.strategyId = Number(
      this.route.snapshot.queryParamMap.get('strategyId')
    );

    this.planId = Number(
      this.route.snapshot.queryParamMap.get('planId')
    );

    this.targetService
      .getByIndicator(id)
      .subscribe((res: any) => {

        this.targets = res;

      });

    this.resultService
      .getByIndicator(id)
      .subscribe((res: any) => {

        this.results = res;

      });

    this.kpiService
      .getDetail(id)
      .subscribe((res: any) => {

        this.kpi = res;

      });

    this.kpiService
      .getTimeline(id)
      .subscribe((res: any) => {

        this.timeline = res;

      });

  }


  getStatus(item: any) {

    if (!item.result_id) {

      return 'NO_RESULT';

    }

    if (
      item.result_id &&
      item.evidence_count == 0
    ) {

      return 'NO_EVIDENCE';

    }

    return 'COMPLETE';

  }

  getQuarterName(q: string): string {

    switch (q) {

      case 'Q1':
        return 'ไตรมาส 1';

      case 'Q2':
        return 'ไตรมาส 2';

      case 'Q3':
        return 'ไตรมาส 3';

      case 'Q4':
        return 'ไตรมาส 4';

      default:
        return q;

    }

  }

  goBack() {

    this.router.navigate(
      ['/kpi/category', this.categoryId],
      {
        queryParams: {
          strategyId: this.strategyId,
          planId: this.planId
        }
      }
    );

  }

}

