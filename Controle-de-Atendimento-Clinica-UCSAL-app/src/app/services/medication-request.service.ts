import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MedicacaoSolicitacaoResponse, Priority } from '../models/medication-request/medicacaoSolicitacaoResponse';
import { HttpClient } from '@angular/common/http';
import { MedicacaoSolicitacaoRequest } from '../models/medication-request/medicacaoSolicitacaoRequest';

type MedicationRequestPayload = {
  medicationId: number;
  medicationName: string;
  requestPriority: RequestPriority;
};

@Injectable({
  providedIn: 'root',
})
export class MedicationRequestService {

  constructor(private http: HttpClient) {}

  listRequests(): Observable<MedicacaoSolicitacaoResponse[]> {
    return this.http.get<MedicacaoSolicitacaoResponse[]>('http://localhost:8080/requisicoes-medicacao');
  }

  createRequest(payload: MedicacaoSolicitacaoRequest): Observable<MedicacaoSolicitacaoResponse> {
    
    return this.http.post<MedicacaoSolicitacaoResponse>('http://localhost:8080/requisicoes-medicacao', payload);
  }
}
