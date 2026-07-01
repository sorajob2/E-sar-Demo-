import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(
    private http: HttpClient
  ) { }

  getSummary() {
    return this.http.get<any>(
      `${this.apiUrl}/summary`
    );
  }

  getStrategy() {
    return this.http.get<any[]>(
      `${this.apiUrl}/strategy`
    );
  }

  getCategory() {
    return this.http.get<any[]>(
      `${this.apiUrl}/category`
    );
  }

  getKpi() {
    return this.http.get<any[]>(
      `${this.apiUrl}/kpi`
    );
  }

  getPlan() {

    return this.http.get<any[]>(
      `${this.apiUrl}/plan`
    );

  }

  getPendingKpi(yearId: number) {

    return this.http.get<any[]>(
      `${this.apiUrl}/pending-kpi?yearId=${yearId}`
    );

  }

}