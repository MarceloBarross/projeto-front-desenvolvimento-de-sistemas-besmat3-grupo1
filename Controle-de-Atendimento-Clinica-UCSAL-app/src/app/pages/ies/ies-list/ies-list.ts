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

  deleteIes(id: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja deletar esta IES?',
      header: 'Confirmacao',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Nao',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.iesService.deletarIes(id).subscribe({
          next: () => {
            this.listarIes();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'IES deletada com sucesso'
            });
          }
        });
      },
      reject: () => {
        console.log('Acao de exclusao cancelada');
      }
    });
  }

  ngOnInit() {
    this.listarIes();
  }
}
