import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { StrategyService }
  from '../../services/strategy.service';

import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-strategy-browser',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './strategy-browser.component.html',
  styleUrl: './strategy-browser.component.scss'
})
export class StrategyBrowserComponent
  implements OnInit {

  strategies: any[] = [];

  planId!: number;

  constructor(
    private route: ActivatedRoute,
    private strategyService: StrategyService,
    private nav: NavigationService,
    private router: Router
  ) { }

  ngOnInit() {

    this.planId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.nav.planId = this.planId;

    this.strategyService
      .getByPlan(this.planId)
      .subscribe(data => {

        this.strategies = data;

      });



  }

  openCategory(strategyId: number) {

    this.nav.planId = this.planId;
    this.nav.strategyId = strategyId;

    this.router.navigate(
      ['/category-browser', strategyId],
      {
        queryParams: {
          planId: this.planId
        }
      }
    );

  }

}