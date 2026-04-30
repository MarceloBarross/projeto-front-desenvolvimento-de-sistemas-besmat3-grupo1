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
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

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
    AsyncPipe
  ],
  templateUrl: './ies-unit-list.html',
  styleUrl: './ies-unit-list.scss',
  providers: [ConfirmationService],
})
export class IesUnitList implements OnInit {
  units: Observable<IesResponse[]> = new Observable();

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
    this.units = this.iesUnitService.listarTodas();
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
        this.iesUnitService.excluir(id).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Unidade excluida com sucesso',
          });
          this.loadUnits();
        });
      },
    });
  }

  toggleStatus(id: number): void {
    this.iesUnitService.alternarStatus(id).subscribe(() => {
      this.loadUnits();
    });
  }
}
