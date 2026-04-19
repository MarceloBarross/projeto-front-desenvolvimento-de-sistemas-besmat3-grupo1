import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { Patient } from '../../../models/patient/patient-interface';
import { PatientService } from '../../../services/patient.service';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-patient-list',
  imports: [CardModule, TableModule, ButtonModule, RouterModule, ConfirmDialogModule, ToastModule ],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.scss',
  providers: [ConfirmationService]
})
export class PatientList implements OnInit {
  patients: Patient[] = [];
  errMessage: string = '';

  constructor(private patientService: PatientService, private dtr: ChangeDetectorRef, private router: Router, 
    private confirmationService: ConfirmationService, private messageService: MessageService) {}

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
    this.router.navigate(['/main-layout/pacientes/update/', id]);
  }

  deletePaciente(id: number){
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
              severity:'success',
              summary: 'Sucesso',
              detail: 'Paciente deletado com sucesso'});
          }
        });
      },

      reject: () => {
        console.log('Ação de exclusão cancelada');
      }
    });
  }

  ngOnInit() {
    this.listarPacientes();
  }
}
