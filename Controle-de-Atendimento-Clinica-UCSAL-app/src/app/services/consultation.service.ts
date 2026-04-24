import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of, throwError } from 'rxjs';
import { Consultation } from '../models/consultation/consultation-interface';

@Injectable({
  providedIn: 'root',
})
export class ConsultationService {

  private readonly api = '/api/consultations';
  isMock = true;

  private consultationsMock: Consultation[] = [
    {
      id: 1,
      patientId: 1,
      professionalId: 1,
      tipo: 'CONSULTA',
      dataInicio: new Date(),
      sintomas: '',
      diagnostico: '',
      status: 'Aguardando'
    }
  ];

  constructor(private http: HttpClient) {}

  // ========================
  // HELPERS
  // ========================
  private findById(id: number): Consultation | undefined {
    return this.consultationsMock.find(c => c.id === id);
  }

  private simulate<T>(data: T): Observable<T> {
    return of(data).pipe(delay(500));
  }

  private error(): Observable<never> {
    return throwError(() => new Error('Consulta não encontrada'));
  }

  // ========================
  // LISTAR
  // ========================
  listar(): Observable<Consultation[]> {
    if (this.isMock) return this.simulate(this.consultationsMock);
    return this.http.get<Consultation[]>(this.api);
  }

  // ========================
  // CRIAR CONSULTA (INICIO)
  // ========================
  criar(data: Partial<Consultation>): Observable<Consultation> {
    if (this.isMock) {
      const newConsultation: Consultation = {
        id: this.consultationsMock.length + 1,
        patientId: data.patientId!,
        professionalId: data.professionalId!,
        tipo: data.tipo || 'CONSULTA',
        dataInicio: new Date(),
        sintomas: '',
        diagnostico: '',
        status: 'Aguardando'
      };

      this.consultationsMock.push(newConsultation);
      return this.simulate(newConsultation);
    }

    return this.http.post<Consultation>(this.api, data);
  }

  // ========================
  // BUSCAR
  // ========================
  findByIdRequest(id: number): Observable<Consultation> {
    if (this.isMock) {
      const c = this.findById(id);
      return c ? this.simulate(c) : this.error();
    }

    return this.http.get<Consultation>(`${this.api}/${id}`);
  }

  // ========================
  // INICIAR ATENDIMENTO
  // ========================
  iniciarAtendimento(id: number): Observable<Consultation> {
    const c = this.findById(id);
    if (!c) return this.error();

    c.status = 'Em-Atendimento';
    c.dataInicio = new Date();

    return this.simulate(c);
  }

  // ========================
  // FINALIZAR ATENDIMENTO
  // ========================
  finalizarAtendimento(id: number, payload: Partial<Consultation>): Observable<Consultation> {
    if (this.isMock) {
      const c = this.findById(id);
      if (!c) return this.error();

      Object.assign(c, payload);
      c.status = 'Finalizado';
      c.dataFim = new Date();

      return this.simulate(c);
    }

    return this.http.patch<Consultation>(`${this.api}/${id}/finalizar`, payload);
  }

  // ========================
  // SALVAR PARCIAL (PRONTUÁRIO)
  // ========================
  salvarAtendimento(id: number, payload: Partial<Consultation>): Observable<Consultation> {
    if (this.isMock) {
      const c = this.findById(id);
      if (!c) return this.error();

      Object.assign(c, payload);

      return this.simulate(c);
    }

    return this.http.patch<Consultation>(`${this.api}/${id}`, payload);
  }
}