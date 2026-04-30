import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MedicationService } from '../../../services/medication.service';
import { MedicationResponse } from '../../../models/medication/medicamentoResponse';
import { AuthService } from '../../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-medication-list',
  imports: [
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    RouterModule,
    ConfirmDialogModule,
    DialogModule,
    ToastModule,
  ],
  templateUrl: './medication-list.html',
  styleUrl: './medication-list.scss',
  providers: [ConfirmationService],
})
export class MedicationList implements OnInit {
  medications: MedicationResponse[] = [];
  descriptionDialogVisible = false;
  selectedMedication: MedicationResponse | null = null;
  role: string | null = null;

  constructor(
    private readonly medicationService: MedicationService,
    private readonly confirmationService: ConfirmationService,
    private readonly messageService: MessageService,
    private readonly authService: AuthService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadMedications();
    this.role = this.authService.getRoles();
  }

  loadMedications(): void {
    this.medicationService.listMedications().subscribe((medications) => {
      this.medications = medications;
      this.cdr.markForCheck();
    });
  }

  deleteMedication(id: number): void {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir esta medicacao?',
      header: 'Confirmacao',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Nao',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.medicationService.deleteMedication(id).subscribe((removed) => {
          if (!removed) {
            return;
          }

          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Medicacao excluida com sucesso',
          });
        });
      },
    });
  }

  toggleStatus(id: number): void {
    this.medicationService.toggleMedicationStatus(id).subscribe((medication) => {
      if (!medication) {
        return;
      }

      this.messageService.add({
        severity: 'info',
        summary: 'Status atualizado',
        detail: medication.status === 'ATIVO' ? 'Medicacao ativada' : 'Medicacao inativada',
      });
    });
  }

  getStorageLabel(type: MedicationResponse['formaArmazenamento']): string {
    return type === 'REFRIGERACAO' ? 'Refrigeracao' : 'Temperatura ambiente';
  }

  openDescription(medication: MedicationResponse): void {
    this.selectedMedication = medication;
    this.descriptionDialogVisible = true;
  }
}
