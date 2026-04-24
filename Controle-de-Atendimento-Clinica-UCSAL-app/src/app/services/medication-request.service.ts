import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MedicationRequest, RequestPriority } from '../models/medication-request/medication-request-interface';

type MedicationRequestPayload = {
  medicationId: number;
  medicationName: string;
  requestPriority: RequestPriority;
};

@Injectable({
  providedIn: 'root',
})
export class MedicationRequestService {
  private readonly requestsSubject = new BehaviorSubject<MedicationRequest[]>([
    {
      id: 1,
      medicationId: 1,
      medicationName: 'Dipirona 500mg',
      requestPriority: 'PREVENTIVO',
    },
  ]);

  listRequests(): Observable<MedicationRequest[]> {
    return this.requestsSubject.asObservable();
  }

  createRequest(payload: MedicationRequestPayload): Observable<MedicationRequest> {
    const nextId =
      this.requestsSubject.value.length > 0
        ? Math.max(...this.requestsSubject.value.map((request) => request.id)) + 1
        : 1;

    const newRequest: MedicationRequest = {
      id: nextId,
      ...payload,
    };

    this.requestsSubject.next([...this.requestsSubject.value, newRequest]);
    return of(newRequest);
  }
}
