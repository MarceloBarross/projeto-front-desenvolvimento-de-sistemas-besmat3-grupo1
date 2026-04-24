import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ies } from '../models/ies/ies-interface';

// O Payload remove o 'id' pois o banco gera automaticamente no POST
type IesPayload = Omit<Ies, 'id'>;

@Injectable({
  providedIn: 'root',
})
export class IesService {
  // Ajuste para a porta do seu Spring Boot
  private readonly apiUrl = 'http://localhost:8080/ies';

  constructor(private http: HttpClient) {}

  listarIes(): Observable<Ies[]> {
    return this.http.get<Ies[]>(this.apiUrl);
  }

  findById(id: number): Observable<Ies> {
    return this.http.get<Ies>(`${this.apiUrl}/${id}`);
  }

  cadastrarIes(data: IesPayload): Observable<Ies> {
    // Envia o JSON para o IesDTORequest do Java
    return this.http.post<Ies>(this.apiUrl, data);
  }

  alterarStatusIes(id: number): Observable<Object> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, {}); // Adicionamos o {}
  }
}
