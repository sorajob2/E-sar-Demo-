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

import { CategoryService }
from '../../services/category.service';

import { StrategyService }
from '../../services/strategy.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent {

  form!: FormGroup;

  categoryId!: number;

  isEdit = false;

  strategies:any[] = [];

  constructor(
    private fb:FormBuilder,
    private route:ActivatedRoute,
    private router:Router,
    private categoryService:
      CategoryService,
    private strategyService:
      StrategyService
  ){

    this.form = this.fb.group({

      strategy_id:[''],
      category_name:[''],
      description:['']

    });

    this.strategyService
      .getAll()
      .subscribe(data=>{

        this.strategies = data;

      });

    this.categoryId =
      Number(
        this.route.snapshot.paramMap.get('id')
      );

    if(this.categoryId){

      this.isEdit = true;

      this.categoryService
        .getById(this.categoryId)
        .subscribe(data=>{

          this.form.patchValue(data);

        });

    }

  }

  save(){

    if(this.isEdit){

      this.categoryService
        .update(
          this.categoryId,
          this.form.value
        )
        .subscribe(()=>{

          alert('แก้ไขสำเร็จ');

          this.router.navigate([
            '/category'
          ]);

        });

    }else{

      this.categoryService
        .create(this.form.value)
        .subscribe(()=>{

          alert('บันทึกสำเร็จ');

          this.router.navigate([
            '/category'
          ]);

        });

    }

  }

}