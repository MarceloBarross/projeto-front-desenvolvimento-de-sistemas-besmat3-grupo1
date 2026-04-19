import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { Profissionals } from '../models/profissionals/profissionals-interface';
import { ProfissionalsDTO } from '../models/profissionals/profissionals-dto';

@Injectable({
  providedIn: 'root'
})
export class ProfissionalsService {
  profissionalsMock: Profissionals[] = [
    {
      id: 1,
      name: 'Ana Lima',
      specialty: 'Cardiologia',
      council: 'CRM-BA 12345',
      phone: '(71) 99999-0001',
      email: 'ana.lima@clinica.com'
    },
    {
      id: 2,
      name: 'Carlos Santos',
      specialty: 'Pediatria',
      council: 'CRM-BA 67890',
      phone: '(71) 99999-0002',
      email: 'carlos.santos@clinica.com'
    }
  ];

  isMock: boolean = true;

  constructor(private http: HttpClient) {}

  listarProfissionals(): Observable<Profissionals[]> {
    if (this.isMock) {
      return of(this.profissionalsMock).pipe(delay(500));
    }

    return this.http.get<Profissionals[]>('/api/profissionals');
  }

  findById(id: number): Observable<Profissionals | undefined> {
    if (this.isMock) {
      return of(this.profissionalsMock.find((p) => p.id === id)).pipe(delay(500));
    }

    return this.http.get<Profissionals>(`/api/profissionals/${id}`);
  }

  cadastrarProfissionals(data: ProfissionalsDTO): Observable<Profissionals> {
    if (this.isMock) {
      const newProfissional: Profissionals = {
        id: this.profissionalsMock.length + 1,
        ...data
      };

      this.profissionalsMock.push(newProfissional);
      return of(newProfissional).pipe(delay(500));
    }

    return this.http.post<Profissionals>('/api/profissionals', data);
  }

  editarProfissionals(id: number, data: ProfissionalsDTO): Observable<boolean | object> {
    if (this.isMock) {
      this.profissionalsMock = this.profissionalsMock.map((p) =>
        p.id === id ? { ...p, ...data } : p
      );

      return of(true).pipe(delay(500));
    }

    return this.http.put(`/api/profissionals/${id}`, data);
  }

  deletarProfissionals(id: number): Observable<void> {
    if (this.isMock) {
      this.profissionalsMock = this.profissionalsMock.filter((p) => p.id !== id);
      return of(void 0).pipe(delay(500));
    }

    return this.http.delete<void>(`/api/profissionals/${id}`);
  }
}
