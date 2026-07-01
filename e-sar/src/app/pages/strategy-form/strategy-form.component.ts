import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { CommonModule } from '@angular/common';

import { StrategyService }
  from '../../services/strategy.service';

import { StrategicPlanService }
  from '../../services/strategic-plan.service';


@Component({
  selector: 'app-strategy-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './strategy-form.component.html',
  styleUrl: './strategy-form.component.scss'
})
export class StrategyFormComponent {

  form!: FormGroup;

  plans: any[] = [];

  isEdit = false;

  strategyId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private strategyService: StrategyService,
    private strategicPlanService:
      StrategicPlanService
  ) {

    this.form = this.fb.group({

      plan_id: [''],
      strategy_code: [''],
      strategy_name: [''],
      description: ['']

    });

    this.loadPlans();

    const id =
      this.route.snapshot.paramMap.get('id');

    this.strategyId =
      id ? Number(id) : 0;

    if (this.strategyId) {

      this.isEdit = true;

      this.strategyService
        .getById(this.strategyId)
        .subscribe(data => {

          this.form.patchValue(data);

        });

    }
  }

  loadPlans() {

    this.strategicPlanService
      .getAll()
      .subscribe(data => {

        this.plans = data;

      });

  }
  save() {

    if (this.isEdit) {

      this.strategyService
        .update(
          this.strategyId,
          this.form.value
        )
        .subscribe({

          next: () => {

            alert('แก้ไขสำเร็จ');

            this.router.navigate([
              '/strategy'
            ]);

          },

          error: (err) => {

            console.error(err);

            alert('เกิดข้อผิดพลาด');

          }

        });

    } else {

      this.strategyService
        .create(
          this.form.value
        )
        .subscribe({

          next: () => {

            alert('บันทึกสำเร็จ');

            this.router.navigate([
              '/strategy'
            ]);

          },

          error: (err) => {

            console.error(err);

            alert('เกิดข้อผิดพลาด');

          }

        });

    }

  }
}