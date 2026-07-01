import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { StrategicPlanService }
  from '../../services/strategic-plan.service';

@Component({
  selector: 'app-strategic-plan',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './strategic-plan.component.html',
  styleUrl: './strategic-plan.component.scss'
})
export class StrategicPlanComponent
  implements OnInit {

  plans: any[] = [];

  constructor(
    private strategicPlanService:
      StrategicPlanService
  ) { }

  ngOnInit() {

    this.loadPlans();

  }

  loadPlans() {

    this.strategicPlanService
      .getAll()
      .subscribe(data => {

        console.log(data);

        this.plans = data;

      });

  }

  deletePlan(id: number) {

    if (!confirm('ต้องการลบหรือไม่?')) {
      return;
    }

    this.strategicPlanService
      .delete(id)
      .subscribe({

        next: () => {

          this.loadPlans();

        },

        error: (err) => {

          console.error(err);

        }

      });

  }

}