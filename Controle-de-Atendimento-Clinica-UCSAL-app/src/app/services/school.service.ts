import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable} from 'rxjs';
import { SchoolResponse } from '../models/ schools/school-Response';
import { SchoolRequest } from '../models/ schools/school-Request';


@Injectable({
  providedIn: 'root',
})
export class SchoolService {
  private readonly http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/escolas';

  listarTodas(): Observable<SchoolResponse[]> {
    return this.http.get<SchoolResponse[]>(this.API);
  }

  cadastrar(escola: SchoolRequest): Observable<SchoolResponse> {
    return this.http.post<SchoolResponse>(this.API, escola);
  }

  // Corrigindo a lógica do PatchMapping do seu Controller
  alternarStatus(id: number): Observable<void> {
    return this.http.patch<void>(`${this.API}/${id}/status`, {});
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
