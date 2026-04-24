import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Patient } from '../models/patient/patient-interface';
import { delay, Observable, of } from 'rxjs';
import { PatientDTO } from '../models/patient/patient-dto';

@Injectable({
  providedIn: 'root',
})
export class PatientService {

  patientsMock: Patient[] = [
    {
      id: 1,
      name: 'João Silva',
      category: 'Aluno',
      cellphone: '(71) 99999-9999',
      email: 'joao.silva@email.com',
      registrationDate: '2026-04-10',
      status: 'Ativo'
    },
    {
      id: 2,
      name: 'Maria Souza',
      category: 'Escola',
      cellphone: '(71) 98888-8888',
      email: 'maria.souza@email.com',
      registrationDate: '2026-04-12',
      status: 'Ativo'
    }
  ];
  isMock: boolean = true;

  constructor(private http: HttpClient) {}

  listarPacientes(): Observable<Patient[]> {
    if (this.isMock) {
      return of (this.patientsMock).pipe(delay(500));
    }
    return this.http.get<Patient[]>('/api/patients');
  }

  finById(id: number): Observable<Patient | undefined> {
    if (this.isMock) {
      return of(this.patientsMock.find(p => p.id === id)).pipe(delay(500));
    }
    return this.http.get<Patient>(`/api/patients/${id}`);
  }

  cadastrarPaciente(data: PatientDTO): Observable<Patient> {
    if (this.isMock) {
      const newPatient: Patient = {
        id: this.patientsMock.length + 1,
        ...data
      };
      this.patientsMock.push(newPatient);
      return of(newPatient).pipe(delay(500));
    }
    
    return this.http.post<Patient>('/api/patients', data);
  }

  editPaciente(id: number, data: PatientDTO) {
    if (this.isMock) {
      this.patientsMock = this.patientsMock.map(p =>
        p.id === id ? { ...p, ...data } : p
      );

      return of(true);
    }

    return this.http.put(`/api/pacientes/${id}`, data);
  }

  deletarPaciente(id: number): Observable<void> {
    if (this.isMock) {
      this.patientsMock = this.patientsMock.filter(patient => patient.id !== id);
      return of(void 0).pipe(delay(500));
    }
    return this.http.delete<void>(`/api/patients/${id}`);
  }
}
