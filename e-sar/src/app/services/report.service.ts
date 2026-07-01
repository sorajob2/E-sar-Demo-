import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private apiUrl = `${environment.apiUrl}/report`;

  constructor(private http: HttpClient) { }

  getReport(type: string, filter: any) {

    return this.http.get<any[]>(
      `${this.apiUrl}/${type}`,
      {
        params: filter
      }
    );

  }

  getTrend(indicatorId: number, years: number = 3) {

    return this.http.get<any[]>(
      `${this.apiUrl}/trend?indicator_id=${indicatorId}&years=${years}`
    );

  }

  getIndicators() {

    return this.http.get<any[]>(
      `${environment.apiUrl}/indicators`
    );

  }

  getIndicatorQuarter(indicatorId: number, yearId: number) {

    return this.http.get<any[]>(
      `${this.apiUrl}/indicator`,
      {
        params: {
          indicator_id: indicatorId,
          year_id: yearId
        }
      }
    );

  }

  getIndicatorYear(indicatorId: number, yearId: number) {

    return this.http.get<any[]>(
      `${this.apiUrl}/indicator-year`,
      {
        params: {
          indicator_id: indicatorId,
          year_id: yearId
        }
      }
    );

  }

}