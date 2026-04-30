import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RouterModule } from '@angular/router';
import { MedicacaoSolicitacaoResponse } from '../../../models/medication-request/medicacaoSolicitacaoResponse';
import { MedicationRequestService } from '../../../services/medication-request.service';
import { date } from '@primeuix/themes/aura/datepicker';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-medication-request-list',
  imports: [CardModule, ButtonModule, TableModule, TagModule, RouterModule],
  templateUrl: './medication-request-list.html',
  styleUrl: './medication-request-list.scss',
})
export class MedicationRequestList implements OnInit {
  requests: MedicacaoSolicitacaoResponse[] = [];
  role: string = '';

  constructor(private readonly medicationRequestService: MedicationRequestService, private cdr: ChangeDetectorRef,
     private authService: AuthService) {}

  ngOnInit(): void {
    this.listarSolicitacoes();
    this.role = this.authService.getRoles()!;
  }

  listarSolicitacoes() {
    this.medicationRequestService.listRequests().subscribe({
      next: (data) => {
        this.requests = data;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao listar solicitações de medicação: ' + err.message);
        this.cdr.markForCheck();
      }
    })
  }

  getPrioritySeverity(priority: MedicacaoSolicitacaoResponse['caraterSolicitacao']): 'danger' | 'warn' | 'info' {
    if (priority === 'URGENTE') {
      return 'danger';
    }

    if (priority === 'CRITICO') {
      return 'warn';
    }

    return 'info';
  }
}
