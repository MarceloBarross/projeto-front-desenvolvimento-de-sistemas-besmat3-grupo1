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
      nome: 'João Silva',
      categoria: 'ALUNO',
      celular: '(71) 99999-9999',
      email: 'joao.silva@email.com',
      dataCadastramento: '2026-04-10',
      motivoRestricao: '',
      status: 'ATIVO',
      escola: null as any,
      unidade: null as any
    },
    {
      id: 2,
      nome: 'Maria Souza',
      categoria: 'COLABORADOR_ESCOLA',
      celular: '(71) 98888-8888',
      email: 'maria.souza@email.com',
      dataCadastramento: '2026-04-12',
      motivoRestricao: '',
      status: 'ATIVO',
      escola: null as any,
      unidade: null as any
    }
  ];
  isMock: boolean = false;

  constructor(private http: HttpClient) {}

  listarPacientes(): Observable<Patient[]> {
    if (this.isMock) {
      return of (this.patientsMock).pipe(delay(500));
    }
    return this.http.get<Patient[]>('http://localhost:8080/pacientes');
  }

  findById(id: number): Observable<Patient | undefined> {
    if (this.isMock) {
      return of(this.patientsMock.find(p => p.id === id)).pipe(delay(500));
    }
    return this.http.get<Patient>(`http://localhost:8080/pacientes/${id}`);
  }

  cadastrarPaciente(data: PatientDTO): Observable<Patient> {
    if (this.isMock) {
      const newPatient: Patient = {
        id: this.patientsMock.length + 1,
        nome: data.nome,
        categoria: data.categoria,
        celular: data.celular,
        email: data.email,
        dataCadastramento: new Date().toISOString().split('T')[0],
        motivoRestricao: data.motivoRestricao || '',
        status: data.status,
        escola: null as any,
        unidade: null as any
      };
      this.patientsMock.push(newPatient);
      return of(newPatient).pipe(delay(500));
    }
    
    return this.http.post<Patient>('http://localhost:8080/pacientes', data);
  }

  editPaciente(id: number, data: PatientDTO) {
    if (this.isMock) {
      this.patientsMock = this.patientsMock.map(p =>
        p.id === id ? { 
          ...p, 
          nome: data.nome,
          categoria: data.categoria,
          celular: data.celular,
          email: data.email,
          motivoRestricao: data.motivoRestricao || '',
          status: data.status
        } : p
      );

      return of(true);
    }

    return this.http.put(`http://localhost:8080/pacientes/${id}`, data);
  }

  deletarPaciente(id: number): Observable<void> {
    if (this.isMock) {
      this.patientsMock = this.patientsMock.filter(patient => patient.id !== id);
      return of(void 0).pipe(delay(500));
    }
    return this.http.delete<void>(`http://localhost:8080/pacientes/${id}`);
  }

  alterarStatus(id: number, novoStatus: 'ATIVO' | 'INATIVO', motivo?: string): Observable<boolean> {
    if (this.isMock) {
      this.patientsMock = this.patientsMock.map(p =>
        p.id === id ? { ...p, status: novoStatus, motivoRestricao: motivo || p.motivoRestricao } : p
      );
      return of(true).pipe(delay(500));
    }
    return this.http.patch<boolean>(`http://localhost:8080/pacientes/${id}/status`, { status: novoStatus, motivoRestricao: motivo });
  }

  atualizarMotivo(id: number, motivoRestricao: string): Observable<boolean> {
    if (this.isMock) {
      this.patientsMock = this.patientsMock.map(p =>
        p.id === id ? { ...p, motivoRestricao } : p
      );
      return of(true).pipe(delay(500));
    }
    return this.http.patch<boolean>(`http://localhost:8080/pacientes/${id}/restricao`, { motivoRestricao });
  }
}
