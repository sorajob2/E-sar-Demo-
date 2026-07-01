import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private api = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient
  ) {}

  getAll() {

    return this.http.get<any[]>(
      this.api
    );

  }

  getStaffs() {

    return this.http.get<any[]>(
      `${this.api}/staff`
    );

  }

  create(data: any) {

    return this.http.post(
      this.api,
      data
    );

  }

  getById(id: number) {

    return this.http.get(
      `${this.api}/${id}`
    );

  }

  update(
    id: number,
    data: any
  ) {

    return this.http.put(
      `${this.api}/${id}`,
      data
    );

  }

  delete(id: number) {

    return this.http.delete(
      `${this.api}/${id}`
    );

  }

}