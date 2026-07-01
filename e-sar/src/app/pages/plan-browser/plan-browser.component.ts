import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { StrategicPlanService }
from '../../services/strategic-plan.service';

@Component({
  selector: 'app-plan-browser',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './plan-browser.component.html',
  styleUrl: './plan-browser.component.scss'
})
export class PlanBrowserComponent
implements OnInit {

  plans:any[] = [];

  constructor(
    private strategicPlanService:
    StrategicPlanService
  ){}

  ngOnInit(){

    this.strategicPlanService
      .getAll()
      .subscribe(data=>{

        this.plans = data;

      });

  }

}