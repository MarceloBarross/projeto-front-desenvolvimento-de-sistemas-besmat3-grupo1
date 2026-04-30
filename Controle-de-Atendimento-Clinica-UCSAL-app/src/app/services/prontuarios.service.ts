import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProntuarioRequest } from '../models/prontuarios/prontuarioRequest';
import { ProntuatrioResponse } from '../models/prontuarios/prontuarioResponse';

@Injectable({
  providedIn: 'root',
})
export class ProntuariosService {

  constructor(private http: HttpClient) {}

  buscarPorId(id: number): Observable<ProntuatrioResponse> {
    return this.http.get<ProntuatrioResponse>(`http://localhost:8080/prontuarios/paciente/${id}`);
  }
}
