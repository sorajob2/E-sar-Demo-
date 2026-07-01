import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  RouterLink,Router
} from '@angular/router';

import { EvidenceService }
  from '../../services/evidence.service';

import { ResultService }
  from '../../services/result.service';

import { KpiService }
  from '../../services/kpi.service';

@Component({
  selector: 'app-evidence',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './evidence.component.html',
  styleUrl: './evidence.component.scss'
})
export class EvidenceComponent
  implements OnInit {

  resultId!: number;

  evidences: any[] = [];

  kpi: any;

  indicatorId!: number;
  categoryId!: number;
  strategyId!: number;
  planId!: number;

  constructor(
    private route: ActivatedRoute,
    private evidenceService: EvidenceService,
    private resultService: ResultService,
    private kpiService: KpiService,
    private router: Router
  ) { }

  ngOnInit() {

    this.categoryId = Number(
      this.route.snapshot.queryParamMap.get('categoryId')
    );

    this.strategyId = Number(
      this.route.snapshot.queryParamMap.get('strategyId')
    );

    this.planId = Number(
      this.route.snapshot.queryParamMap.get('planId')
    );

    this.resultId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadEvidences();

    this.loadKpi();

  }

  loadEvidences() {

    this.evidenceService
      .getByResult(this.resultId)
      .subscribe(data => {

        this.evidences = data;

      });

  }

  deleteEvidence(id: number) {

    if (!confirm('ต้องการลบหรือไม่?')) {
      return;
    }

    this.evidenceService
      .delete(id)
      .subscribe({

        next: () => {

          this.loadEvidences();

        },

        error: err => {

          console.error(err);

        }

      });

  }

  formatFileSize(size: number): string {

    if (!size) {
      return '-';
    }

    if (size >= 1024 * 1024) {

      return (
        size /
        (1024 * 1024)
      ).toFixed(2) + ' MB';

    }

    return (
      size / 1024
    ).toFixed(2) + ' KB';

  }

  loadKpi() {

    this.resultService
      .getById(this.resultId)
      .subscribe({

        next: (result: any) => {

          this.indicatorId =
            result.indicator_id;

          this.kpiService
            .getById(
              result.indicator_id
            )
            .subscribe({

              next: (kpi: any) => {

                this.kpi = kpi;

              },

              error: (err) => {

                console.error(err);

              }

            });

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

  goBack() {

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