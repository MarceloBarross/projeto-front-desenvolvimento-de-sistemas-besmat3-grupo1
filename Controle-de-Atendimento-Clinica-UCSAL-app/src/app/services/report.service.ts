import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { CostCenterReportItem } from '../models/reports/cost-center-report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private isMock = true;

  constructor(private http: HttpClient) {}

  getCostCenterReport(): Observable<CostCenterReportItem[]> {

    if (this.isMock) {
      const mock: CostCenterReportItem[] = [
        {
          centroCusto: 'Clínica Escola',
          paciente: 'João Silva',
          data: '2026-04-05',
          profissional: 'Ana Lima'
        },
        {
          centroCusto: 'Clínica Escola',
          paciente: 'Maria Souza',
          data: '2026-04-06',
          profissional: 'Carlos Santos'
        },
        {
          centroCusto: 'Unidade Externa',
          paciente: 'Lucas Pereira',
          data: '2026-04-07',
          profissional: 'Amanda Costa'
        }
      ];

      return of(mock).pipe(delay(800));
    }

    return this.http.get<CostCenterReportItem[]>(
      '/api/relatorios/centros-custo'
    );
  }
}