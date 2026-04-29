import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SchoolService } from '../../../services/school.service';
import { SchoolResponse } from '../../../models/ schools/school-Response';
import { Observable } from 'rxjs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { AsyncPipe } from '@angular/common';
// ... outros imports

@Component({
  selector: 'app-shcool-list',
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
  templateUrl: './shcool-list.html',
  styleUrl: './shcool-list.scss',
  providers: [ConfirmationService, MessageService],
})
export class ShcoolList implements OnInit {
  schools: Observable<SchoolResponse[]> = new Observable();

  constructor(
    private readonly schoolService: SchoolService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadSchools();
  }

  loadSchools(): void {
    this.schools = this.schoolService.listarTodas();
  }

  deleteSchool(id: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esta escola?',
      header: 'Confirmacao',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Nao',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.schoolService.excluir(id).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Escola excluida com sucesso',
          });
          this.loadSchools();
        });
      },
    });
  }

  toggleStatus(id: number): void {
    this.schoolService.alternarStatus(id).subscribe(() => {
      this.loadSchools();
    });
  }
}
