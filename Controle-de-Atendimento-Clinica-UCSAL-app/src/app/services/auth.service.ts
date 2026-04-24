import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  getToken(): string | null  {
    return localStorage.getItem('authToken');
  }

  getRoles(): string {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : '';
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  setSession(token: string, roles: string) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('roles');
  }
}
