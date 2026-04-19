import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { User } from '../models/user/user-interface';
import { UpdateUserDTO } from '../models/user/update-user.dto';
import { HttpClient } from '@angular/common/http';
import { UpdatePasswordDTO } from '../models/user/update-password.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  userMock: User = {
    name: 'Matheus',
    email: 'matheus@gmail.com',
    role: 'ADMIN'
  }

  isMock = true;

  constructor(private http: HttpClient) {}


  getUser(): Observable<User> {
    if(this.isMock) {
      return of(this.userMock).pipe(delay(500));
    }
    return this.http.get<User>('/api/me');
  }

  updateUser(data: UpdateUserDTO): Observable<User> {
    if(this.isMock) {
      console.log('Dados para atualização do perfil:', data);
      this.userMock = {
        ...data,
        role: 'ADMIN'
      };
      
      return of (this.userMock).pipe(delay(1000));
    }

    return this.http.put<User>('/api/me', data);
  }

  updatePassword(data: UpdatePasswordDTO): Observable<void> {
    if (this.isMock) {
      console.log('Dados para atualização da senha:', data);
      return of(void 0).pipe(delay(1000));
    }
    return this.http.post<void>('/api/me/update-password', data);
  }
}
