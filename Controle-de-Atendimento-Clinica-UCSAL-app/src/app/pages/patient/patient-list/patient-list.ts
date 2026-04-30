import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Patient } from '../../../models/patient/patient-interface';
import { PatientService } from '../../../services/patient.service';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ConsultationService } from '../../../services/consultation.service';
import { Consultation } from '../../../models/consultation/consultation-interface';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-patient-list',
  imports: [
    CardModule, TableModule, ButtonModule, RouterModule,
    ConfirmDialogModule, ToastModule, DialogModule, CommonModule,
    FormsModule, TooltipModule
  ],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.scss',
  providers: [ConfirmationService]
})
export class PatientList implements OnInit {

  patients: Patient[] = [];
  errMessage = '';

  prontuariosDialogVisible = false;
  pacienteSelecionado: Patient | null = null;
  prontuariosPaciente: Consultation[] = [];

  motivoDialogVisible = false;
  motivoRestricio = '';
  pacienteEditandoMotivo: Patient | null = null;

  constructor(
    private patientService: PatientService,
    private consultationService: ConsultationService,
    private dtr: ChangeDetectorRef,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.listarPacientes();
  }

  listarPacientes() {
    this.patientService.listarPacientes().subscribe({
      next: (data) => {
        this.patients = data;
        this.dtr.markForCheck();
      },
      error: (err) => {
        this.errMessage = 'Erro ao listar pacientes: ' + err.message;
        this.dtr.markForCheck();
      }
    });
  }

  editarPaciente(id: number) {
    this.router.navigate(['/main-layout/patients/update/', id]);
  }

  abrirDialogMotivo(paciente: Patient) {
    this.pacienteEditandoMotivo = paciente;
    this.motivoRestricio = paciente.motivoRestricao || '';
    this.motivoDialogVisible = true;
    this.dtr.markForCheck();
  }

  salvarMotivo() {
    if (!this.pacienteEditandoMotivo) return;
    
    this.patientService.atualizarMotivo(this.pacienteEditandoMotivo.id, this.motivoRestricio).subscribe({
      next: () => {
        this.listarPacientes();
        this.motivoDialogVisible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Motivo de restrição atualizado'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao atualizar motivo'
        });
      }
    });
  }

   abrirProntuarios(pacienteId: number) {
    this.router.navigate(['/main-layout/prontuarios/', pacienteId]);
  }

  alterarStatus(id: number, statusAtual: 'ATIVO' | 'INATIVO', motivo?: string) {
    const novoStatus = statusAtual === 'ATIVO' ? 'INATIVO' : 'ATIVO';
    const mensagem = novoStatus === 'ATIVO' ? 'ativar' : 'desativar';
    
    this.confirmationService.confirm({
      message: `Tem certeza que deseja ${mensagem} este paciente?`,
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.patientService.alterarStatus(id, novoStatus, motivo).subscribe({
          next: () => {
            this.listarPacientes();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Paciente ${mensagem}do com sucesso`
            });
          }
        });
      },
      reject: () => console.log('Ação de mudança de status cancelada')
    });
  }
}
