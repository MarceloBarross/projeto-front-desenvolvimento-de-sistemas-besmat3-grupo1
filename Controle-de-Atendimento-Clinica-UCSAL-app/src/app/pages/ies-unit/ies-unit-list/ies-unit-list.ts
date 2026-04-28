import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Router, RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { IesUnitService } from '../../../services/ies-unit.service';
import { IesResponse } from '../../../models/ies-unit/ies-unit-Response';

@Component({
  selector: 'app-ies-unit-list',
  imports: [
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    RouterModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  templateUrl: './ies-unit-list.html',
  styleUrl: './ies-unit-list.scss',
  providers: [ConfirmationService],
})
export class IesUnitList implements OnInit {
  units: IesResponse[] = [];

  constructor(
    private readonly iesUnitService: IesUnitService,
    private readonly router: Router,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadUnits();
  }

  loadUnits(): void {
    this.iesUnitService.listUnits().subscribe((units) => {
      this.units = units;
    });
  }

  editUnit(id: number): void {
    this.router.navigate(['/main-layout/ies-units/update', id]);
  }

  deleteUnit(id: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esta unidade?',
      header: 'Confirmacao',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Nao',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.iesUnitService.deleteUnit(id).subscribe((removed) => {
          if (!removed) {
            return;
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Unidade excluida com sucesso',
          });
        });
      },
    });
  }

  toggleStatus(id: number): void {
    this.iesUnitService.toggleUnitStatus(id).subscribe((unit) => {
      if (!unit) {
        return;
      }

      this.messageService.add({
        severity: 'info',
        summary: 'Status atualizado',
        detail: unit.isAtivo ? 'Unidade ativada' : 'Unidade inativada',
      });
    });
  }
}
