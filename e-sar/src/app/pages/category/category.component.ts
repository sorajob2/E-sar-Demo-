import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CategoryService }
from '../../services/category.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent
implements OnInit {

  categories:any[] = [];

  constructor(
    private categoryService:
    CategoryService
  ) {}

  ngOnInit() {

    this.loadCategories();

  }

  loadCategories() {

    this.categoryService
      .getAll()
      .subscribe(data => {

        console.log(data);

        this.categories = data;

      });

  }

  deleteCategory(id:number) {

    if(!confirm('ต้องการลบหรือไม่?')) {
      return;
    }

    this.categoryService
  .delete(id)
  .subscribe({
    next: () => {

      this.categories =
        this.categories.filter(
          c => c.category_id !== id
        );

    },

    error: (err) => {

      alert(
        err.error?.message ||
        'ไม่สามารถลบข้อมูลได้'
      );

    }
  });

  }

}