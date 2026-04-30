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

  getProfissionalId(): number | null {
    const profissionalId = localStorage.getItem('profissionalId');
    return profissionalId ? parseInt(profissionalId) : null;
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId) : null;
  }
  
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  setUserId(userId: number) {
    localStorage.setItem('userId', userId.toString());
  }

  setProfissionalId(userId: number | null) {
    if (userId === null) {
      localStorage.removeItem('profissionalId'); // limpa se for admin
      return;
    }
    
    localStorage.setItem('profissionalId', userId.toString());
  }

  setSession(token: string, roles: string) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('roles', JSON.stringify(roles));

    const payload = JSON.parse(atob(token.split('.')[1]));

    if (payload.usuarioId) {
      localStorage.setItem('userId', payload.usuarioId.toString());
    }

    if (payload.profissionalId) {
      localStorage.setItem('profissionalId', payload.profissionalId.toString());
    } else {
      localStorage.removeItem('profissionalId');
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('roles');
    localStorage.removeItem('profissionalId');
    localStorage.removeItem('userId');
  }
}
