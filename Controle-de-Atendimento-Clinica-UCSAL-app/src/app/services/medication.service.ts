import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Medication, StorageType } from '../models/medication/medication-interface';

type MedicationPayload = {
  name: string;
  description: string;
  supplier: string;
  storageType: StorageType;
  quantity: number;
  expirationDate: string;
  acquisitionDate: string;
  isAtivo: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class MedicationService {
  private readonly medicationsSubject = new BehaviorSubject<Medication[]>([
    {
      id: 1,
      name: 'Dipirona 500mg',
      description: 'Analgesico e antitermico para dor e febre.',
      supplier: 'Farmacorp',
      storageType: 'AMBIENTE',
      quantity: 120,
      expirationDate: '2027-05-20',
      acquisitionDate: '2026-03-10',
      isAtivo: true,
    },
  ]);

  listMedications(): Observable<Medication[]> {
    return this.medicationsSubject.asObservable();
  }

  createMedication(payload: MedicationPayload): Observable<Medication> {
    const nextId =
      this.medicationsSubject.value.length > 0
        ? Math.max(...this.medicationsSubject.value.map((medication) => medication.id)) + 1
        : 1;

    const newMedication: Medication = {
      id: nextId,
      ...payload,
    };

    this.medicationsSubject.next([...this.medicationsSubject.value, newMedication]);
    return of(newMedication);
  }

  deleteMedication(id: number): Observable<boolean> {
    const nextMedications = this.medicationsSubject.value.filter((medication) => medication.id !== id);
    const removed = nextMedications.length !== this.medicationsSubject.value.length;
    this.medicationsSubject.next(nextMedications);
    return of(removed);
  }

  toggleMedicationStatus(id: number): Observable<Medication | undefined> {
    const medications = this.medicationsSubject.value;
    const index = medications.findIndex((medication) => medication.id === id);

    if (index === -1) {
      return of(undefined);
    }

    const updatedMedication: Medication = {
      ...medications[index],
      isAtivo: !medications[index].isAtivo,
    };

    const nextMedications = [...medications];
    nextMedications[index] = updatedMedication;
    this.medicationsSubject.next(nextMedications);

    return of(updatedMedication);
  }
}
