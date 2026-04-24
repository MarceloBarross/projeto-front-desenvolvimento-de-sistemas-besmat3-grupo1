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

@Component({
  selector: 'app-patient-list',
  imports: [
    CardModule, TableModule, ButtonModule, RouterModule,
    ConfirmDialogModule, ToastModule, DialogModule, CommonModule
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

  abrirProntuarios(paciente: Patient) {
    this.pacienteSelecionado = paciente;
    this.consultationService.listar().subscribe({
      next: (consultas) => {
        this.prontuariosPaciente = consultas.filter(
          c => c.patientId === paciente.id && c.status === 'Finalizado'
        );
        this.prontuariosDialogVisible = true;
        this.dtr.markForCheck();
      }
    });
  }

  deletePaciente(id: number) {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja deletar este paciente?',
      header: 'Confirmação',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        this.patientService.deletarPaciente(id).subscribe({
          next: () => {
            this.listarPacientes();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Paciente deletado com sucesso'
            });
          }
        });
      },
      reject: () => console.log('Ação de exclusão cancelada')
    });
  }
}
