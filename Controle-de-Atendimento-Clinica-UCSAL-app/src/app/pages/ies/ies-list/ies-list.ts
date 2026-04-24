import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Ies } from '../../../models/ies/ies-interface';
import { IesService } from '../../../services/ies.service';

@Component({
  selector: 'app-ies-list',
  imports: [CardModule, TableModule, ButtonModule, RouterModule, ConfirmDialogModule, ToastModule],
  templateUrl: './ies-list.html',
  styleUrl: './ies-list.scss',
  providers: [ConfirmationService]
})
export class IesList implements OnInit {
  ies: Ies[] = [];
  errMessage: string = '';

  constructor(
    private iesService: IesService,
    private dtr: ChangeDetectorRef,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  listarIes() {
    this.iesService.listarIes().subscribe({
      next: (data) => {
        this.ies = data;
        this.dtr.markForCheck();
      },
      error: (err) => {
        this.errMessage = 'Erro ao listar IES: ' + err.message;
        this.dtr.markForCheck();
      }
    });
  }

  alterarStatusIes(id: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja alterar o status desta IES?',
      header: 'Confirmacao',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Nao',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.iesService.alterarStatusIes(id).subscribe({
          next: () => {
            this.listarIes();
            this.messageService.add({
              severity: 'warn',
              summary: 'Sucesso',
              detail: 'IES alterada com sucesso',
            });
          }
        });
      },
      reject: () => {
        console.log('Acao de alteracao de status cancelada');
      }
    });
  }

  ngOnInit() {
    this.listarIes();
  }
}
