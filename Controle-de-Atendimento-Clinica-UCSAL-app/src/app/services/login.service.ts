import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable } from 'rxjs';
import { throwError, of } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(private http: HttpClient, private userService: UserService) {}

  login(email: string, password: string): Observable<{ token: string; roles: string[] }> {
    // return this.http.post<{ token: string, roles: string[] }>('/api/login', { email, password });

  // caso queira simular o login sem backend, descomente o código abaixo e comente a linha do http.post acima
  
  //   if (email === 'teste@email.com' && password === '123456') {
  //   return of({ token: 'fake-jwt-token', roles: ['user', 'admin'] }).pipe(delay(1000)); // Simula um atraso de 1 segundo
  // } else {
  //   return throwError(() => new Error('Credenciais inválidas'));
  // }

  if(this.userService.isMock) {
    const user = this.userService.findByCredentials(email, password);
    if (!user) {
      return throwError(() => new Error('Credenciais inválidas'));
    }

    return of ({
      token: 'fake-jwt-token',
      roles: [user.role]
    }).pipe(delay(1000));
  }

   return this.http.post<{ token: string, roles: string[] }>('/api/login', { email, password });

  }  
}

