import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { KpiService }
from '../../services/kpi.service';

@Component({
  selector: 'app-my-kpi-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl:
    './my-kpi-detail.component.html',
  styleUrls:
    ['./my-kpi-detail.component.scss']
})
export class MyKpiDetailComponent
implements OnInit {


  indicatorId!:number;

  groupedYears: any[] = [];

  constructor(
    private route:ActivatedRoute,
    private kpiService:KpiService
  ){}

  ngOnInit(){

    this.indicatorId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.kpiService
  .getTimeline(this.indicatorId)
  .subscribe((rows:any)=>{

    const years:any = {};

    rows.forEach((row:any)=>{

      if(!years[row.year_name]){

        years[row.year_name] = {

          year_id: row.year_id,

          year_name: row.year_name,

          target_value: row.target_value,

          quarters: []

        };

      }

      years[row.year_name]
        .quarters
        .push(row);

    });

    this.groupedYears =
      Object.values(years);

    console.log(
      this.groupedYears
    );

  });

  }

}