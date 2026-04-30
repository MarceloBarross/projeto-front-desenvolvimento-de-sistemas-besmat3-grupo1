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
      identificacaoProfissional: 'PROF-001',
      nome: 'Ana Lima',
      formacao: 'Medicina',
      especialidade: 'Cardiologia',
      diasHorariosAtendimento: 'Segunda, Quarta e Sexta - Matutino',
      conselhoRegional: 'CRM-BA',
      numeroRegistroConselho: '12345',
      dataCadastramento: new Date('2026-04-10'),
      status: 'ATIVO'
    },
    {
      id: 2,
      identificacaoProfissional: 'PROF-002',
      nome: 'Carlos Santos',
      formacao: 'Medicina',
      especialidade: 'Pediatria',
      diasHorariosAtendimento: 'Terça e Quinta - Vespertino',
      conselhoRegional: 'CRM-BA',
      numeroRegistroConselho: '67890',
      dataCadastramento: new Date('2026-04-11'),
      status: 'INATIVO'
    }
  ];

  isMock: boolean = false;

  constructor(private http: HttpClient) {}

  listarProfissionals(): Observable<Profissionals[]> {
    if (this.isMock) {
      return of(this.profissionalsMock).pipe(delay(500));
    }

    return this.http.get<Profissionals[]>("http://localhost:8080/profissionais-saude");
  }

  findById(id: number): Observable<Profissionals | undefined> {
    if (this.isMock) {
      return of(this.profissionalsMock.find((p) => p.id === id)).pipe(delay(500));
    }

    return this.http.get<Profissionals>(`http://localhost:8080/profissionais-saude/${id}`);
  }

  cadastrarProfissionals(data: ProfissionalsDTO): Observable<Profissionals> {
    if (this.isMock) {
      const newProfissional: Profissionals = {
        id: this.profissionalsMock.length + 1,
        ...data,
        dataCadastramento: new Date(),
        status: 'ATIVO'
      };

      this.profissionalsMock.push(newProfissional);
      return of(newProfissional).pipe(delay(500));
    }

    return this.http.post<Profissionals>("http://localhost:8080/profissionais-saude", data);
  }

  editarProfissionals(id: number, data: ProfissionalsDTO): Observable<boolean | object> {
    return this.http.patch(`http://localhost:8080/profissionais-saude/${id}/complementar-cadastro`, data);
  }

  deletarProfissionals(id: number): Observable<void> {
    if (this.isMock) {
      this.profissionalsMock = this.profissionalsMock.filter((p) => p.id !== id);
      return of(void 0).pipe(delay(500));
    }

    return this.http.delete<void>(`/api/profissionals/${id}`);
  }
}
