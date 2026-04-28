import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Coordenador } from '../models/cordeador/cordenador';
import { CoordenadorDTO } from '../models/cordeador/coordenadorDTO';

@Injectable({
  providedIn: 'root',
})
export class CoordenadorService {
  private readonly apiUrl = 'http://localhost:8080/coordenador';

  constructor(private http: HttpClient) {}

  listarCoordenadores(): Observable<Coordenador[]> {
    return this.http.get<Coordenador[]>(this.apiUrl);
  }

  cadastrar(coordenador: CoordenadorDTO): Observable<Coordenador> {
    return this.http.post<Coordenador>(this.apiUrl, coordenador);
  }

  modificarStatus(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, {});
  }

  findById(id: number): Observable<Coordenador> {
    return this.http.get<Coordenador>(`${this.apiUrl}/${id}`);
  }
}
