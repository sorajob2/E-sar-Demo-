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

import { FiscalYearService }
  from '../../services/fiscal-year.service';

import { ResultService } from '../../services/result.service';
import { EvidenceService } from '../../services/evidence.service';
import { TargetService } from '../../services/target.service';

import { AuthService }
  from '../../services/auth.service';


@Component({
  selector: 'app-result-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './result-form.component.html',
  styleUrl: './result-form.component.scss'
})
export class ResultFormComponent {

  form!: FormGroup;

  indicatorId!: number;

  resultId!: number;

  isEdit = false;

  years: any[] = [];

  targets: any[] = [];

  selectedTarget: any = null;

  evidences: any[] = [];

  categoryId!: number;
  strategyId!: number;
  planId!: number;

  quarters = [
    { id: 1, name: 'Q1 (ต.ค.-ธ.ค.)' },
    { id: 2, name: 'Q2 (ม.ค.-มี.ค.)' },
    { id: 3, name: 'Q3 (เม.ย.-มิ.ย.)' },
    { id: 4, name: 'Q4 (ก.ค.-ก.ย.)' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private fiscalYearService: FiscalYearService,
    private resultService: ResultService,
    private evidenceService: EvidenceService,
    private targetService: TargetService,
    private auth: AuthService
  ) {

    this.categoryId = Number(
      this.route.snapshot.queryParamMap.get('categoryId')
    );

    this.strategyId = Number(
      this.route.snapshot.queryParamMap.get('strategyId')
    );

    this.planId = Number(
      this.route.snapshot.queryParamMap.get('planId')
    );

    this.indicatorId = Number(
      this.route.snapshot.paramMap.get(
        'indicatorId'
      )
    );

    this.form = this.fb.group({
      year_id: [''],
      quarter_id: [''],
      actual_value: [''],
      remark: ['']
    });

    this.resultId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (this.resultId) {

      this.isEdit = true;

      this.resultService
        .getById(this.resultId)
        .subscribe(data => {

          this.form.patchValue({

            year_id: data.year_id,
            quarter_id: data.quarter_id,
            actual_value: data.actual_value,
            remark: data.remark

          });

          this.loadEvidence();

          this.indicatorId =
            data.indicator_id;

          this.targetService
            .getByIndicator(this.indicatorId)
            .subscribe((res: any) => {

              this.targets = res;

              this.loadTarget();

            });

        });

    }

    this.fiscalYearService
      .getAll()
      .subscribe(data => {

        this.years = data;

      });

    this.targetService
      .getByIndicator(this.indicatorId)
      .subscribe((res: any) => {

        this.targets = res;

        console.log('TARGETS = ', res);

        this.loadTarget();

      });

  }

  selectedFile: File | null = null;

  onFileSelected(event: Event) {

    const input =
      event.target as HTMLInputElement;

    if (input.files?.length) {

      this.selectedFile =
        input.files[0];

    }

  }

  save() {

    const data = {

      indicator_id: this.indicatorId,

      year_id:
        this.form.value.year_id,

      quarter_id:
        this.form.value.quarter_id,

      actual_value:
        this.form.value.actual_value,

      remark:
        this.form.value.remark

    };

    if (this.isEdit) {

      this.resultService
        .update(
          this.resultId,
          data
        )
        .subscribe({

          next: () => {

            if (this.selectedFile) {

              const formData = new FormData();

              formData.append(
                'result_id',
                this.resultId.toString()
              );

              formData.append(
                'file',
                this.selectedFile
              );

              this.evidenceService
                .upload(formData)
                .subscribe({
                  next: () => {

                    alert('แก้ไขและอัปโหลดสำเร็จ');

                    this.navigateAfterSave();

                  }
                });

            } else {

              alert('แก้ไขสำเร็จ');

              this.navigateAfterSave();

            }

          },

          error: err => {

            console.error(err);

          }

        });

    } else {

      this.resultService
        .create(data)
        .subscribe({

          next: (res: any) => {

            if (this.selectedFile) {

              const formData =
                new FormData();

              formData.append(
                'result_id',
                res.result_id.toString()
              );

              formData.append(
                'file',
                this.selectedFile
              );

              this.evidenceService
                .upload(formData)
                .subscribe(() => {

                  this.loadEvidence();

                  this.selectedFile = null;

                  alert("อัปโหลดสำเร็จ");

                });

            } else {

              alert(
                'บันทึกสำเร็จ'
              );

              this.navigateAfterSave();

            }

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

  navigateAfterSave() {

    const user = this.auth.getUser();

    if (user.role === 'STAFF') {

      this.router.navigate([
        '/my-kpi-detail',
        this.indicatorId
      ]);

    } else {

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

  loadTarget() {

    const yearId =
      this.form.value.year_id;

    console.log('YEAR = ', yearId);

    console.log('TARGETS = ', this.targets);

    this.selectedTarget =
      this.targets.find(
        (t: any) =>
          Number(t.year_id) ===
          Number(yearId)
      );

    console.log(
      'FOUND TARGET = ',
      this.selectedTarget
    );

  }

  goBack() {

    const user = this.auth.getUser();

    if (user.role === 'STAFF') {

      this.router.navigate([
        '/my-kpi-detail',
        this.indicatorId
      ]);

    } else {

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

  loadEvidence() {

    if (!this.resultId) return;

    this.evidenceService
      .getByResult(this.resultId)
      .subscribe({

        next: data => {

          this.evidences = data;

        },

        error: err => {

          console.error(err);

        }

      });

  }

  deleteEvidence(id: number) {

    if (!confirm("ลบไฟล์นี้ใช่หรือไม่?"))
      return;

    this.evidenceService
      .delete(id)
      .subscribe({

        next: () => {

          this.loadEvidence();

        }

      });

  }

  openFile(url: string) {

    window.open(url, "_blank");

  }

}