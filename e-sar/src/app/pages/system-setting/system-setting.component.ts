import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { FiscalYearService }
from '../../services/fiscal-year.service';

import { SettingService }
from '../../services/setting.service';

@Component({
  selector: 'app-system-setting',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl:
    './system-setting.component.html',
  styleUrl:
    './system-setting.component.scss'
})
export class SystemSettingComponent {

  years:any[] = [];

  currentYearId:any;

  constructor(
    private fiscalYearService:
    FiscalYearService,

    private settingService:
    SettingService
  ){

    this.loadYears();
    this.loadCurrentYear();

  }

  loadYears(){

    this.fiscalYearService
      .getAll()
      .subscribe((res:any)=>{

        this.years = res;

      });

  }

  loadCurrentYear(){

    this.settingService
      .getCurrentYear()
      .subscribe((res:any)=>{

        this.currentYearId =
          res.current_year_id;

      });

  }

  save(){

    this.settingService
      .updateCurrentYear(
        this.currentYearId
      )
      .subscribe(()=>{

        alert(
          'บันทึกสำเร็จ'
        );

      });

  }

}