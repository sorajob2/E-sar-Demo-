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

import { StrategicPlanService }
from '../../services/strategic-plan.service';

@Component({
  selector: 'app-strategic-plan-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl:
    './strategic-plan-form.component.html',
  styleUrl:
    './strategic-plan-form.component.scss'
})
export class StrategicPlanFormComponent {

  form!: FormGroup;

  isEdit = false;

  planId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private strategicPlanService:
      StrategicPlanService
  ) {

    this.form = this.fb.group({

      plan_code:[''],
      plan_name:[''],
      start_year:[''],
      end_year:[''],
      description:['']

    });

    this.planId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if(this.planId){

      this.isEdit = true;

      this.strategicPlanService
        .getById(this.planId)
        .subscribe(data=>{

          this.form.patchValue(data);

        });

    }

  }

  save(){

    if(this.isEdit){

      this.strategicPlanService
        .update(
          this.planId,
          this.form.value
        )
        .subscribe({

          next:()=>{

            alert('แก้ไขสำเร็จ');

            this.router.navigate([
              '/strategic-plan'
            ]);

          }

        });

    }else{

      this.strategicPlanService
        .create(this.form.value)
        .subscribe({

          next:()=>{

            alert('บันทึกสำเร็จ');

            this.router.navigate([
              '/strategic-plan'
            ]);

          }

        });

    }

  }

}