import { Component } from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { EvidenceService }
  from '../../services/evidence.service';

@Component({
  selector: 'app-evidence-form',
  standalone: true,
  imports: [],
  templateUrl: './evidence-form.component.html',
  styleUrl: './evidence-form.component.scss'
})
export class EvidenceFormComponent {

  selectedFile: File | null = null;

  resultId!: number;
  categoryId!: number;
  strategyId!: number;
  planId!: number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private evidenceService: EvidenceService
  ) {

    this.resultId = Number(
      this.route.snapshot.paramMap.get(
        'resultId'
      )
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

  }

  onFileSelected(event: Event) {

    const input =
      event.target as HTMLInputElement;

    if (input.files?.length) {

      this.selectedFile =
        input.files[0];

    }

  }

  upload() {

    if (!this.selectedFile) {

      alert('กรุณาเลือกไฟล์');

      return;

    }

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

          alert('อัปโหลดสำเร็จ');

          this.router.navigate(
            ['/evidence', this.resultId],
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

          console.error(err);

          alert('อัปโหลดไม่สำเร็จ');

        }

      });

  }

  goBack() {

    this.router.navigate(
      ['/evidence', this.resultId],
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