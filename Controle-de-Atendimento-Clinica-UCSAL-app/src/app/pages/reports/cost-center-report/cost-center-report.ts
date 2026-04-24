import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ReportService } from '../../../services/report.service';

type CostCenterReportItem = {
  centroCusto: string;
  paciente: string;
  data: string;
  profissional: string;
};

@Component({
  selector: 'app-cost-center-report',
  standalone: true,
  imports: [CommonModule, TableModule, CardModule, ButtonModule],
  templateUrl: './cost-center-report.html',
  styleUrl: './cost-center-report.scss',
})
export class CostCenterReport {
  reportData: CostCenterReportItem[] = [];

  constructor(private reportService: ReportService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.reportService.getCostCenterReport().subscribe({
      next: (data) => {
        this.reportData = data;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao carregar relatório', err);
        this.cdr.markForCheck();
      }
    });
  }

  get groupedReportData() {
    return [...this.reportData].sort((a, b) =>
      a.centroCusto.localeCompare(b.centroCusto)
    );
  }
}
