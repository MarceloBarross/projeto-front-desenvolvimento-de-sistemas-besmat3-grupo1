import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Coordenador {
  id?: number;
  nome: string;
  email: string;
  telefone: string;
  status: 'ATIVO' | 'INATIVO';
}

@Injectable({
  providedIn: 'root',
})
export class CoordenadorService {
  private readonly apiUrl = 'http://localhost:8080/coordenador';

  constructor(private http: HttpClient) {}

  listCoordenadores(): Observable<Coordenador[]> {
    return this.http.get<Coordenador[]>(this.apiUrl);
  }

  cadastrar(data: Coordenador): Observable<Coordenador> {
    return this.http.post<Coordenador>(this.apiUrl, data);
  }

  modificarStatus(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, {});
  }

  findById(id: number): Observable<Coordenador> {
    return this.http.get<Coordenador>(`${this.apiUrl}/${id}`);
  }
}
