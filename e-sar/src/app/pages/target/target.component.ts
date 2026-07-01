import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TargetService }
  from '../../services/target.service';

import { KpiService }
  from '../../services/kpi.service';

import { Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-target',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './target.component.html',
  styleUrl: './target.component.scss'
})
export class TargetComponent
  implements OnInit {

  targets: any[] = [];

  indicatorId!: number;

  kpi: any = null;

  categoryId!: number;
  strategyId!: number;
  planId!: number;

  constructor(
    private route: ActivatedRoute,
    private targetService: TargetService,
    private kpiService: KpiService,
    private router: Router,
    private nav: NavigationService
  ) { }

  ngOnInit(): void {

    this.indicatorId = Number(
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

    this.loadKpi();

    this.loadTargets();

  }

  loadTargets(): void {

    this.targetService
      .getByIndicator(this.indicatorId)
      .subscribe({

        next: (data: any[]) => {

          console.log(data);

          this.targets = data;

        },

        error: (err) => {

          console.error(err);

          alert('ไม่สามารถโหลดข้อมูล Target ได้');

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

  deleteTarget(id: number): void {

    if (!confirm('ต้องการลบ Target นี้หรือไม่?')) {
      return;
    }

    this.targetService
      .delete(id)
      .subscribe({

        next: () => {

          this.targets =
            this.targets.filter(
              t => t.target_id !== id
            );

          alert('ลบสำเร็จ');

        },

        error: (err) => {

          console.error(err);

          alert('ลบไม่สำเร็จ');

        }

      });

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