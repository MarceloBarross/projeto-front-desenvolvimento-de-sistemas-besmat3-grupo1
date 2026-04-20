import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of } from 'rxjs';
import { Consultation } from '../models/consultation/consultation-interface';
import { ConsultationDto } from '../models/consultation/consultation-dto';

@Injectable({
  providedIn: 'root',
})
export class ConsultationService {

  appointmentsMock: Consultation[] = [
    {
      id: 1,
      time: '08:00',
      patient: {
        id: 1, name: 'João Silva',
        cpf: '12345678900',
        phone: '71-99999-9999', 
        email: 'joao.silva@email.com' 
      },
      type: 'Consulta',
      professional: {
        id: 1,
        name: 'Ana Lima',
        specialty: 'Cardiologia',
        council: 'CRM-BA 12345',
        phone: '(71) 99999-0001',
        email: 'ana.lima@clinica.com'
      },
      status: 'Finalizado',
      notes: '',
    },
    {
      id: 2,
      time: '09:30',
      patient: {
        id: 2,
        name: 'João Lucas',
        cpf: '09876543210',
        phone: '71-98888-8888',
        email: 'joao.lucas@email.com'
      },
      type: 'Retorno',
      professional: {
        id: 2,
        name: 'Dra. Amanda Costa',
        specialty: 'Dermatologia',
        council: 'CRM-BA 54321',
        phone: '(71) 99999-0002',
        email: 'amanda.costa@clinica.com'
      },
      status: 'Em-Atendimento',
      notes: ''
    },
    {
      id: 3,
      time: '10:15',
      patient: {
        id: 3,
        name: 'Carla Pereira',
        cpf: '11122233344',
        phone: '71-97777-7777',
        email: 'carla.pereira@email.com'
      },
      type: 'Exame',
      professional: {
        id: 3,
        name: 'Lab Técnico',
        specialty: 'Laboratório',
        council: 'CFT 54321',
        phone: '(71) 99999-0003',
        email: 'lab.tecnico@clinica.com'
      },
      status: 'Aguardando',
      notes: ''
    },
    {
      id: 4,
      time: '11:00',
      patient: {
        id: 4,
        name: 'Roberto Fonseca',
        cpf: '55566677788',
        phone: '71-96666-6666',
        email: 'roberto.fonseca@email.com'
      },
      type: 'Consulta',
      professional: {
        id: 4,
        name: 'Dr. Ricardo Silva',
        specialty: 'Medicina Geral',
        council: 'CRM-BA 98765',
        phone: '(71) 99999-0004',
        email: 'ricardo.silva@clinica.com'
      },
      status: 'Cancelado',
      notes: ''
    }
  ];

  isMock: boolean = true;

  constructor(private http: HttpClient) {}

  listarConsultas(): Observable<Consultation[]> {
    if (this.isMock) {
      return of(this.appointmentsMock).pipe(delay(500));
    }

    return this.http.get<Consultation[]>('/api/consultations');
  }

  criarConsulta(data: ConsultationDto): Observable<Consultation> {
    if (this.isMock) {
      const newConsultation: Consultation = {
        id: this.appointmentsMock.length + 1,
        ...data,
        status: 'Aguardando',
        notes: ''
      }
      this.appointmentsMock.push(newConsultation);
      return of(newConsultation).pipe(delay(500));
    }
    return this.http.post<Consultation>('/api/consultations', data);
  }

  obterConsultaPorId(id: number): Observable<Consultation> {
    if (this.isMock) {
      const consultation = this.appointmentsMock.find(c => c.id === id);
      if (consultation) {
        return of(consultation).pipe(delay(500));
      } else {
        throw new Error('Consulta não encontrada');
      }
    }

    return this.http.get<Consultation>(`/api/consultations/${id}`);
  }

  iniciarAtendimento(id: number): Observable<Consultation> {
    if (this.isMock) {
      const consultation = this.appointmentsMock.find(c => c.id === id);
      if (consultation) {
        consultation.status = 'Em-Atendimento';
        return of(consultation).pipe(delay(500));
      } else {
        throw new Error('Consulta não encontrada');
      }
    }
    return this.http.patch<Consultation>(`/api/consultations/${id}/status`, { status: 'Em-Atendimento' });
  }

  finalizarAtendimento(id: number): Observable<Consultation> {
    if (this.isMock) {
      const consultation = this.appointmentsMock.find(c => c.id === id);
      if (consultation) {
        consultation.status = 'Finalizado';
        return of(consultation).pipe(delay(500));
      } else {
        throw new Error('Consulta não encontrada');
      }
    }
    return this.http.patch<Consultation>(`/api/consultations/${id}/status`, { status: 'Finalizado' });
  }

  salvarNotas(id: number, notes: string): Observable<Consultation> {
    if (this.isMock) {
      const consultation = this.appointmentsMock.find(c => c.id === id);
      if (consultation) {
        consultation.notes = notes;
        return of(consultation).pipe(delay(500));
      }

      throw new Error('Consulta não encontrada');
    }

    return this.http.patch<Consultation>(`/api/consultations/${id}/notes`, { notes });
  }
}
