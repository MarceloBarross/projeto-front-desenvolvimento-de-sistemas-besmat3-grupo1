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
  
  private usersMock: (User & { password: string })[] = [
    {
      name: 'Matheus Admin',
      email: 'matheus@gmail.com',
      password: '123456',
      role: 'ADMIN',
    },
    {
      name: 'breno medico',
      email: 'breno@gmail.com',
      password: '123456',
      role: 'PROFISSIONAL',
      especialidade: 'Cardiologia',
      conselhoRegional: 'CRM-BA 12345',
      formacao: 'Medicina - UFBA',
      diasAtendimento: 'Segunda, Quarta e Sexta',
      horariosAtendimento: '08:00 às 12:00',
    },
  ];

  private currentUser: User | null = null;

  isMock = true;

  constructor(private http: HttpClient) {}

  findByCredentials(email: string, password: string): User | null {
    const found = this.usersMock.find(
      u => u.email === email && u.password === password
    );
    if (!found) return null;

    const { password: _, ...user } = found; // remove a senha antes de retornar
    this.currentUser = user;
    return user;
  }


  getUser(): Observable<User> {
    if (this.isMock) {
      const user = this.currentUser ?? this.usersMock[0];
      return of(user).pipe(delay(500));
    }
    return this.http.get<User>('/api/me');
  }

  updateUser(data: UpdateUserDTO): Observable<User> {
    if (this.isMock) {
      this.currentUser = { ...this.currentUser!, ...data };
      return of(this.currentUser).pipe(delay(1000));
    }
    return this.http.put<User>('/api/me', data);
  }

  updatePassword(data: UpdatePasswordDTO): Observable<void> {
    if (this.isMock) {
      console.log('Senha atualizada:', data);
      return of(void 0).pipe(delay(1000));
    }
    return this.http.post<void>('/api/me/update-password', data);
  }
}
