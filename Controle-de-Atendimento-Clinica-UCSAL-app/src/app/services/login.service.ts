import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable } from 'rxjs';
import { throwError, of } from 'rxjs';
import { UserService } from './user.service';
import { Login } from '../layout/login/login';
import { LoginResponse } from '../models/login/login-interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(private http: HttpClient, private userService: UserService) {}

  login(email: string, senha: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>("http://localhost:8080/auth/login", { email,  senha });

  }  
}

