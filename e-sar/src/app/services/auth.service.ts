import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  login(data: any) {
    return this.http.post(
      `${this.apiUrl}/login`,
      data
    );
  }

  getUser() {
    return JSON.parse(
      localStorage.getItem('user') || '{}'
    );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRole() {
    return this.getUser().role;
  }

  isSuperAdmin() {
    return this.getRole() === 'SUPER_ADMIN';
  }

  isAdmin() {
    return this.getRole() === 'ADMIN';
  }

  isStaff() {
    return this.getRole() === 'STAFF';
  }

  logout() {

  localStorage.removeItem('token');
  localStorage.removeItem('user');

  this.router.navigate([
    '/login'
  ]);

}


}