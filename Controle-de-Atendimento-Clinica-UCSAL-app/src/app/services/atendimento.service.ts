import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AtendimentoResponse } from '../models/atendimento/atendimentoResponse';
import { AtendimentoRequest } from '../models/atendimento/atendimentoRequest';

@Injectable({
  providedIn: 'root',
})
export class AtendimentoService {

  constructor (private http: HttpClient ) {}

  iniciarAtendimento(data: AtendimentoRequest): Observable<AtendimentoResponse> {
    return this.http.post<AtendimentoResponse>(`http://localhost:8080/atendimentos`, data)
  }

  encerrarAtendimento(id: number): Observable<AtendimentoResponse> {
      return this.http.patch<AtendimentoResponse>(`http://localhost:8080/atendimentos/${id}/encerrar`, null );
  }
}
