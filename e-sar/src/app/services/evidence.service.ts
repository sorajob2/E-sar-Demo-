import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EvidenceService {

  private apiUrl = `${environment.apiUrl}/evidence`;

  constructor(
    private http: HttpClient
  ) {}

  getByResult(resultId: number) {

    return this.http.get<any[]>(
      `${this.apiUrl}/result/${resultId}`
    );

  }

  upload(data: FormData) {

    return this.http.post(
      this.apiUrl,
      data
    );

  }

  delete(id: number) {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }

}