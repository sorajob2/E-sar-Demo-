import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NavigationService } from '../../services/navigation.service';

import { CategoryService }
  from '../../services/category.service';

@Component({
  selector: 'app-category-browser',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './category-browser.component.html',
  styleUrl: './category-browser.component.scss'
})
export class CategoryBrowserComponent
  implements OnInit {

  categories: any[] = [];

  strategyId!: number;

  planId!: number;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private nav: NavigationService,
    private router: Router
  ) { }

  ngOnInit() {

    this.strategyId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    const planId = Number(
      this.route.snapshot.queryParamMap.get('planId')
    );

    this.planId = Number(
      this.route.snapshot.queryParamMap.get('planId')
    );

    this.nav.planId = planId;

    this.nav.strategyId = this.strategyId;

    this.categoryService
      .getByStrategy(this.strategyId)
      .subscribe(data => {

        this.categories = data;

      });

  }

  openKpi(categoryId: number) {

    this.nav.categoryId = categoryId;

    this.router.navigate(
      ['/kpi/category', categoryId],
      {
        queryParams: {
          strategyId: this.strategyId,
          planId: this.planId
        }
      }
    );

  }

  goBack() {

    this.router.navigate(
      ['/strategy-browser', this.planId],
      {
        queryParams: {
          planId: this.planId
        }
      }
    );

  }

}