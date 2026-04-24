import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Router, RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SchoolService } from '../../../services/school.service';
import { School } from '../../../models/ schools/school-interface';


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
  ],
  templateUrl: './shcool-list.html',
  styleUrl: './shcool-list.scss',
  providers: [ConfirmationService],
})
export class ShcoolList implements OnInit {
  schools: School[] = [];

  constructor(
    private readonly schoolService: SchoolService,
    private readonly router: Router,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadSchools();
  }

  loadSchools(): void {
    this.schoolService.listSchools().subscribe((schools) => {
      this.schools = schools;
    });
  }

  editSchool(id: number): void {
    this.router.navigate(['/main-layout/shcools/update', id]);
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
        this.schoolService.deleteSchool(id).subscribe((removed) => {
          if (!removed) {
            return;
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Escola excluida com sucesso',
          });
        });
      },
    });
  }

  toggleStatus(id: number): void {
    this.schoolService.toggleSchoolStatus(id).subscribe((school) => {
      if (!school) {
        return;
      }

      this.messageService.add({
        severity: 'info',
        summary: 'Status atualizado',
        detail: school.isAtivo ? 'Escola ativada' : 'Escola inativada',
      });
    });
  }
}
