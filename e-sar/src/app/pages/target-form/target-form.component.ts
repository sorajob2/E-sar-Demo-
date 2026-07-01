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

import { TargetService }
  from '../../services/target.service';

import { CommonModule } from '@angular/common';
import { FiscalYearService } from '../../services/fiscal-year.service';

@Component({
  selector: 'app-target-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './target-form.component.html',
  styleUrl: './target-form.component.scss'
})
export class TargetFormComponent {

  form!: FormGroup;

  indicatorId!: number;

  targetId!: number;
  isEdit = false;

  years: any[] = [];

  categoryId!: number;
  strategyId!: number;
  planId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private targetService: TargetService,
    private fiscalYearService: FiscalYearService
  ) {

    this.indicatorId = Number(
      this.route.snapshot.paramMap.get('indicatorId')
    );

    this.targetId = Number(
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

    this.form = this.fb.group({
      year_id: [''],
      target_value: ['']
    });

    this.fiscalYearService
      .getAll()
      .subscribe(data => {

        this.years = data;

      });

    if (this.targetId) {

      this.isEdit = true;

      this.targetService
        .getById(this.targetId)
        .subscribe((target: any) => {

          this.indicatorId =
            target.indicator_id;

          this.form.patchValue({
            year_id: target.year_id,
            target_value: target.target_value
          });

        });

    }
  }

  save() {

    const data = {
      indicator_id: this.indicatorId,
      year_id: this.form.value.year_id,
      target_value: this.form.value.target_value
    };

    if (this.isEdit) {

      this.targetService
        .update(this.targetId, data)
        .subscribe(() => {

          alert('แก้ไขสำเร็จ');

          this.router.navigate(
            ['/target', this.indicatorId],
            {
              queryParams: {
                categoryId: this.categoryId,
                strategyId: this.strategyId,
                planId: this.planId
              }
            }
          );

        });

    } else {

      this.targetService
        .create(data)
        .subscribe({
          next: () => {

            alert('บันทึกสำเร็จ');

            this.router.navigate(
              ['/target', this.indicatorId],
              {
                queryParams: {
                  categoryId: this.categoryId,
                  strategyId: this.strategyId,
                  planId: this.planId
                }
              }
            );

          },
          error: (err) => {

            alert(
              err.error?.message ||
              'เกิดข้อผิดพลาด'
            );

          }
        });

    }

  }


  goBack() {

    this.router.navigate(
      ['/target', this.indicatorId],
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