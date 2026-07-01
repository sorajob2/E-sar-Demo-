import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TargetService {

  private apiUrl = `${environment.apiUrl}/targets`;

  constructor(
    private http: HttpClient
  ) {}

  getByIndicator(indicatorId: number) {

    return this.http.get<any[]>(
      `${this.apiUrl}/${indicatorId}`
    );

  }

  getById(id: number) {

    return this.http.get(
      `${this.apiUrl}/detail/${id}`
    );

  }

  create(data: any) {

    return this.http.post(
      this.apiUrl,
      data
    );

  }

  update(id: number, data: any) {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      data
    );

  }

  delete(id: number) {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }

}