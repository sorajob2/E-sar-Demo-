import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { StrategyService } from '../../services/strategy.service';
import { StrategicPlanService } from '../../services/strategic-plan.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-strategy',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule
  ],
  templateUrl: './strategy.component.html',
  styleUrl: './strategy.component.scss'
})
export class StrategyComponent
  implements OnInit {

  strategies: any[] = [];

  plans: any[] = [];

  selectedPlanId: any = '';

  constructor(
    private strategyService: StrategyService,
    private strategicPlanService: StrategicPlanService
  ) { }

  ngOnInit() {

    this.loadPlans();

    this.loadStrategies();

  }

  loadStrategies() {

    if (this.selectedPlanId) {

      this.strategyService
        .getByPlan(this.selectedPlanId)
        .subscribe(data => {

          this.strategies = data;

        });

    } else {

      this.strategyService
        .getAll()
        .subscribe(data => {

          this.strategies = data;

        });

    }

  }

  deleteStrategy(id: number) {

    if (!confirm('ต้องการลบหรือไม่?')) {
      return;
    }

    this.strategyService
      .delete(id)
      .subscribe({

        next: () => {

          this.loadStrategies();

        },

        error: (err) => {

          console.error(err);

          alert(
            err.error?.message ||
            'ไม่สามารถลบได้'
          );

        }

      });

  }

  loadPlans() {

    this.strategicPlanService
      .getAll()
      .subscribe(data => {

        this.plans = data;

      });

  }

}