import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) { }

  getAll() {

    return this.http.get<any[]>(
      `${this.apiUrl}/categories`
    );

  }

  getById(id: number) {

    return this.http.get<any>(
      `${this.apiUrl}/category/${id}`
    );

  }

  create(data: any) {

    return this.http.post(
      `${this.apiUrl}/category`,
      data
    );

  }

  update(id: number, data: any) {

    return this.http.put(
      `${this.apiUrl}/category/${id}`,
      data
    );

  }

  delete(id: number) {

    return this.http.delete(
      `${this.apiUrl}/category/${id}`
    );

  }

  getByStrategy(id: number) {

    return this.http.get<any[]>(
      `${this.apiUrl}/categories/strategy/${id}`
    );

  }

}