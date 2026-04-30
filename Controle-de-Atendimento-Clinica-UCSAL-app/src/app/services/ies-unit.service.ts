import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { IesResponse } from '../models/ies-unit/ies-unit-Response';
import { HttpClient } from '@angular/common/http';
import { IesRequest } from '../models/ies-unit/ies-unit-Request';

type IesUnitPayload = {
  unitName: string;
  representativeName: string;
  iesName: string;
  isAtivo: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class IesUnitService {
  private readonly http = inject(HttpClient);
  private readonly API = 'http://localhost:8080/unidades';

  listarTodas(): Observable<IesResponse[]> {
    return this.http.get<IesResponse[]>(this.API);
  }

  cadastrar(unidade: IesRequest): Observable<IesResponse> {
    return this.http.post<IesResponse>(this.API, unidade);
  }

  alternarStatus(id: number): Observable<void> {
    return this.http.patch<void>(`${this.API}/${id}/status`, {});
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
