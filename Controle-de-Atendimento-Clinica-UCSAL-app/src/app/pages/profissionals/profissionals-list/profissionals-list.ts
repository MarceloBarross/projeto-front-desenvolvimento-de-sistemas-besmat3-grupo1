import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { Profissionals } from '../../../models/profissionals/profissionals-interface';
import { ProfissionalsService } from '../../../services/profissionals.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profissionals-list',
  imports: [CardModule, TableModule, ButtonModule, RouterModule, ConfirmDialogModule, ToastModule, TagModule, CommonModule],
  templateUrl: './profissionals-list.html',
  styleUrl: './profissionals-list.scss',
  providers: [ConfirmationService]
})
export class ProfissionalsList implements OnInit {
  profissionals: Profissionals[] = [];
  errMessage: string = '';

  constructor(
    private profissionalsService: ProfissionalsService,
    private dtr: ChangeDetectorRef,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  listarProfissionals() {
    this.profissionalsService.listarProfissionals().subscribe({
      next: (data) => {
        this.profissionals = data;
        this.dtr.markForCheck();
      },
      error: (err) => {
        this.errMessage = 'Erro ao listar profissionais: ' + err.message;
        this.dtr.markForCheck();
      }
    });
  }

  editarProfissional(id: number) {
    this.router.navigate(['/main-layout/profissionals/update', id]);
  }

  deleteProfissional(id: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja deletar este profissional?',
      header: 'Confirmacao',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Nao',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.profissionalsService.deletarProfissionals(id).subscribe({
          next: () => {
            this.listarProfissionals();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Profissional deletado com sucesso'
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
    this.listarProfissionals();
  }
}
