import { Component } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  FormGroup
} from '@angular/forms';

import {
  Router,
  ActivatedRoute
} from '@angular/router';

import { KpiService } from '../../services/kpi.service';
import { UsersService } from '../../services/users.service';

import { CategoryService } from '../../services/category.service';

import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-kpi-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './kpi-form.component.html',
  styleUrl: './kpi-form.component.scss'
})
export class KpiFormComponent {

  form!: FormGroup;

  indicatorId: number | null = null;

  staffs: any[] = [];
  categories: any[] = [];

  categoryId!: number;
  strategyId!: number;
  planId!: number;

  constructor(
    private fb: FormBuilder,
    private kpiService: KpiService,
    private userService: UsersService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private nav: NavigationService
  ) {

    this.form = this.fb.group({
      code: [''],
      name: [''],
      category_id: [1],
      owner_user_id: [null],
      target_direction: ['HIGHER_BETTER']
    });

    this.categoryId = Number(
      this.route.snapshot.paramMap.get('categoryId')
    );

    this.strategyId = Number(
      this.route.snapshot.queryParamMap.get('strategyId')
    );

    this.planId = Number(
      this.route.snapshot.queryParamMap.get('planId')
    );

    const categoryId =
      this.route.snapshot.paramMap.get(
        'categoryId'
      );

    if (categoryId) {

      this.form.patchValue({
        category_id: Number(categoryId)
      });

    }

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      this.indicatorId = Number(id);

      this.kpiService
        .getById(this.indicatorId)
        .subscribe((kpi: any) => {

          this.categoryId = kpi.category_id;

          this.form.patchValue({
            code: kpi.indicator_code,
            name: kpi.indicator_name,
            category_id: kpi.category_id,
            owner_user_id: kpi.owner_user_id,

            target_direction:
              kpi.target_direction
          });

        });

    }

    this.userService
      .getStaffs()
      .subscribe((res: any) => {

        this.staffs = res;

      });

    this.categoryService
      .getAll()
      .subscribe((res: any) => {

        this.categories = res;

      });

  }

  save() {

    if (this.indicatorId) {

      this.kpiService
        .update(this.indicatorId, this.form.value)
        .subscribe({
          next: () => {

            alert('แก้ไขสำเร็จ');

            this.router.navigate(
              ['/kpi/category', this.categoryId],
              {
                queryParams: {
                  strategyId: this.strategyId,
                  planId: this.planId
                }
              }
            );

          },
          error: (err) => {

            console.error(err);

          }
        });

    } else {

      this.kpiService
        .create(this.form.value)
        .subscribe({
          next: () => {

            alert('บันทึกสำเร็จ');

            this.router.navigate(
              ['/kpi/category', this.categoryId],
              {
                queryParams: {
                  strategyId: this.strategyId,
                  planId: this.planId
                }
              }
            );

          },
          error: err => {

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