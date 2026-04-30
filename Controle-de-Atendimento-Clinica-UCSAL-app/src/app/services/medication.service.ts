import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MedicationResponse, StorageType } from '../models/medication/medicamentoResponse';
import { HttpClient } from '@angular/common/http';
import { MedicationRequest } from '../models/medication/medicamentoRequest';
import { MedicationStatus } from '../models/medication/statusEnum';

@Injectable({
  providedIn: 'root',
})
export class MedicationService {
  private readonly medicationsSubject = new BehaviorSubject<MedicationResponse[]>([
    {
      id: 1,
      nome: 'Dipirona 500mg',
      descricaoCompleta: 'Analgesico e antitermico para dor e febre.',
      fornecedor: 'Farmacorp',
      formaArmazenamento: 'AMBIENTE',
      quantidadeEstoque: 120,
      dataValidade: '2027-05-20',
      dataAquisicao: '2026-03-10',
      status: MedicationStatus.ATIVO ,
    },
  ]);

  constructor(private http: HttpClient) {}

  listMedications(): Observable<MedicationResponse[]> {
    return this.http.get<MedicationResponse[]>('http://localhost:8080/medicacoes');
  }

  createMedication(payload: MedicationRequest): Observable<MedicationResponse> {
    return this.http.post<MedicationResponse>('http://localhost:8080/medicacoes', payload);

    // const nextId =
    //   this.medicationsSubject.value.length > 0
    //     ? Math.max(...this.medicationsSubject.value.map((medication) => medication.id)) + 1
    //     : 1;

    // const newMedication: MedicationResponse = {
    //   id: nextId,
    //   ...payload,
    // };

    // this.medicationsSubject.next([...this.medicationsSubject.value, newMedication]);

    // return of(newMedication);
  }

  deleteMedication(id: number): Observable<boolean> {
    const nextMedications = this.medicationsSubject.value.filter((medication) => medication.id !== id);
    const removed = nextMedications.length !== this.medicationsSubject.value.length;
    this.medicationsSubject.next(nextMedications);
    return of(removed);
  }

  toggleMedicationStatus(id: number): Observable<MedicationResponse | undefined> {

      return this.http.patch<MedicationResponse>(`http://localhost:8080/medicacoes/${id}/status`, {});
    // const medications = this.medicationsSubject.value;
    // const index = medications.findIndex((medication) => medication.id === id);

    // if (index === -1) {
    //   return of(undefined);
    // }

    // const updatedMedication: MedicationResponse = {
    //   ...medications[index],
    //   status: !medications[index].status ? 'ATIVO' : 'INATIVO',
    // };

    // const nextMedications = [...medications];
    // nextMedications[index] = updatedMedication;
    // this.medicationsSubject.next(nextMedications);

    // return of(updatedMedication);
  }

  atualizarEstoque(id: number, novaQuantidade: number): Observable<MedicationResponse | undefined> {
    return this.http.patch<MedicationResponse>(`http://localhost:8080/medicacoes/${id}/estoque`, { novaQuantidade });
  }
}
