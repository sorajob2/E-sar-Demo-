import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private apiUrl = `${environment.apiUrl}/settings`;

  constructor(
    private http: HttpClient
  ) { }

  getCurrentYear() {

    return this.http.get(
      `${this.apiUrl}/current-year`
    );

  }

  updateCurrentYear(
    current_year_id: number
  ) {

    return this.http.put(
      `${this.apiUrl}/current-year`,
      {
        current_year_id
      }
    );

  }

}