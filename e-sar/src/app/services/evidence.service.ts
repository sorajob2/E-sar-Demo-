import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EvidenceService {

  private getHeaders() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  private apiUrl = `${environment.apiUrl}/evidence`;

  constructor(
    private http: HttpClient
  ) { }

  getByResult(resultId: number) {
    return this.http.get<any[]>(
      `${this.apiUrl}/result/${resultId}`,
      this.getHeaders()
    );
  }

  upload(data: FormData) {
    return this.http.post(
      this.apiUrl,
      data,
      this.getHeaders()
    );
  }

  delete(id: number) {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      this.getHeaders()
    );
  }

}