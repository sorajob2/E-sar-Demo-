import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KpiService } from '../../services/kpi.service';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-kpi',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-kpi.component.html',
  styleUrls: ['./my-kpi.component.scss']
})
export class MyKpiComponent implements OnInit {

  kpis: any[] = [];

  constructor(
    private kpiService: KpiService,
    private auth: AuthService
  ) { }

  ngOnInit() {

    const user =
      this.auth.getUser();

    this.kpiService
      .getMyKpi(user.user_id)
      .subscribe((res: any) => {

        console.log('MY KPI = ', res);

        this.kpis = res;

      });

  }

  getStatus(kpi: any): string {

    // ยังไม่มี Target
    if (kpi.target_count == 0) {

      return 'NEED_TARGET';

    }

    // กรอก Result ยังไม่ครบทุกไตรมาส
    if (kpi.completed_quarters < kpi.total_quarters) {

      return 'IN_PROGRESS';

    }

    // กรอก Result ครบแล้ว ถือว่าเสร็จสมบูรณ์
    return 'COMPLETED';

  }


}