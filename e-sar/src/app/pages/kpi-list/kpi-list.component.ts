import { Component, OnInit } from '@angular/core';
import { KpiService } from '../../services/kpi.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-kpi-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './kpi-list.component.html',
  styleUrl: './kpi-list.component.scss'
})
export class KpiListComponent implements OnInit {

  kpis: any[] = [];

  categoryId!: number;

  searchText = '';

  allKpis: any[] = [];

  strategyId!: number;

  planId!: number;

  constructor(
    private kpiService: KpiService,
    public auth: AuthService,
    private route: ActivatedRoute,
    public nav: NavigationService,
    private router: Router
  ) { }

  ngOnInit() {

    this.categoryId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    const strategyId = Number(
      this.route.snapshot.queryParamMap.get('strategyId')
    );

    this.planId = Number(
      this.route.snapshot.queryParamMap.get('planId')
    );

    this.nav.planId = this.planId;

    this.nav.categoryId = this.categoryId;
    this.nav.strategyId = strategyId;

    this.strategyId = Number(
      this.route.snapshot.queryParamMap.get('strategyId')
    );



    if (this.categoryId) {

      this.kpiService
        .getByCategory(this.categoryId)
        .subscribe((res: any) => {

          this.kpis = res;
          this.allKpis = res;

        });

      return;

    }

    const user = this.auth.getUser();

    if (user.role === 'STAFF') {

      this.kpiService
        .getMyKpi(user.user_id)
        .subscribe((res: any) => {

          this.kpis = res;

          this.allKpis = res;

        });

    } else {

      this.kpiService
        .getAll()
        .subscribe((res: any) => {

          this.kpis = res;

          this.allKpis = res;

        });

    }

  }



  deleteKpi(id: number) {

    if (!confirm('ต้องการลบ KPI นี้หรือไม่?')) {
      return;
    }

    this.kpiService.delete(id)
      .subscribe(() => {

        this.kpis = this.kpis.filter(
          kpi => kpi.indicator_id !== id
        );

      });

  }


  isAchieved(kpi: any): boolean {

    if (
      kpi.target_value == null ||
      kpi.result_value == null
    ) {
      return false;
    }

    const target =
      Number(kpi.target_value);

    const result =
      Number(kpi.result_value);

    if (
      kpi.target_direction ===
      'LOWER_BETTER'
    ) {

      return result <= target;

    }

    return result >= target;

  }

  filterKpi() {

    const keyword =
      this.searchText
        .toLowerCase()
        .trim();

    this.kpis =
      this.allKpis.filter(kpi =>

        kpi.indicator_code
          ?.toLowerCase()
          .includes(keyword)

        ||

        kpi.indicator_name
          ?.toLowerCase()
          .includes(keyword)

      );

  }

  goBack() {

    this.router.navigate(
      ['/category-browser', this.nav.strategyId],
      {
        queryParams: {
          planId: this.nav.planId
        }
      }
    );

  }

}