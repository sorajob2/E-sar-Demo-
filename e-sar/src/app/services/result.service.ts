import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  private apiUrl = `${environment.apiUrl}/results`;

  constructor(
    private http: HttpClient
  ) {}

  getByIndicator(id: number) {

    return this.http.get<any[]>(
      `${this.apiUrl}/${id}`
    );

  }

  create(data: any) {

    return this.http.post(
      this.apiUrl,
      data
    );

  }

  getById(id: number) {

    return this.http.get<any>(
      `${environment.apiUrl}/result/${id}`
    );

  }

  update(id: number, data: any) {

    return this.http.put(
      `${environment.apiUrl}/result/${id}`,
      data
    );

  }

  delete(id: number) {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }

}