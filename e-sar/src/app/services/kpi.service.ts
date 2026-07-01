import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KpiService {

  private apiUrl = `${environment.apiUrl}/indicators`;

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: number) {
    return this.http.get<any>(
      `${this.apiUrl}/${id}`
    );
  }

  create(data: any) {

    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(
      this.apiUrl,
      data,
      { headers }
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

  getMyKpi(userId: number) {

    return this.http.get<any[]>(
      `${this.apiUrl}/my-kpi/${userId}`
    );

  }

  getDetail(id: number) {

    return this.http.get(
      `${this.apiUrl}/detail/${id}`
    );

  }

  getByCategory(id: number) {

    return this.http.get<any[]>(
      `${this.apiUrl}/category/${id}`
    );

  }

  getStatus(id:number){

    return this.http.get(
      `${this.apiUrl}/status/${id}`
    );

  }

  getTimeline(id:number){

    return this.http.get<any[]>(
      `${this.apiUrl}/timeline/${id}`
    );

  }

}