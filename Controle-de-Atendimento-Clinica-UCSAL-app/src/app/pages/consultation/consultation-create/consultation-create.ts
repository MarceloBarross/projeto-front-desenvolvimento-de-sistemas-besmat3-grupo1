import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConsultationService } from '../../../services/consultation.service';
import { ConsultationDto } from '../../../models/consultation/consultation-dto';
import { Patient } from '../../../models/patient/patient-interface';
import { Profissionals } from '../../../models/profissionals/profissionals-interface';
import { PatientService } from '../../../services/patient.service';
import { ProfissionalsService } from '../../../services/profissionals.service';

@Component({
  selector: 'app-consultation-create',
  imports: [CardModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, ButtonModule, RouterModule, MessageModule, ToastModule],
  templateUrl: './consultation-create.html',
  styleUrl: './consultation-create.scss',
})
export class ConsultationCreate {
  fb = inject(FormBuilder);
  errMessage: string = '';
  patients: Patient[] = [];
  profissionals: Profissionals[] = [];

  formConsulta = this.fb.group({
    time: ['', [Validators.required]],
    patient: [null as Patient | null, [Validators.required]],
    type: ['', [Validators.required]],
    professional: [null as Profissionals | null, [Validators.required]]
  });

  constructor(
    private consultationService: ConsultationService,
    private patientService: PatientService,
    private profissionalsService: ProfissionalsService,
    private router: Router,
    private dtr: ChangeDetectorRef,
    private messageService: MessageService
  ) {
    this.carregarPacientes();
    this.carregarProfissionais();
  }

  carregarPacientes() {
    this.patientService.listarPacientes().subscribe({
      next: (data) => {
        this.patients = data;
      },
      error: () => {
        this.errMessage = 'Erro ao carregar pacientes.';
      }
    });
  }

  carregarProfissionais() {
    this.profissionalsService.listarProfissionals().subscribe({
      next: (data) => {
        this.profissionals = data;
      },
      error: () => {
        this.errMessage = 'Erro ao carregar profissionais.';
      }
    });
  }

  compareById<T extends { id: number }>(a: T | null, b: T | null): boolean {
    return a?.id === b?.id;
  }

  save() {
    if (this.formConsulta.invalid) {
      this.errMessage = 'Por favor, preencha todos os campos obrigatorios.';
      this.dtr.markForCheck();
      return;
    }

    const rawValue = this.formConsulta.getRawValue();

    if (!rawValue.patient || !rawValue.professional) {
      this.errMessage = 'Paciente e profissional sao obrigatorios.';
      this.dtr.markForCheck();
      return;
    }

    const data: ConsultationDto = {
      time: rawValue.time ?? '',
      type: rawValue.type ?? '',
      patient: rawValue.patient,
      professional: rawValue.professional
    };

    this.consultationService.criarConsulta(data).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Consulta criada com sucesso'
        });

        this.router.navigate(['/main-layout/consultations']);
        this.dtr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao criar consulta.', err);
        this.errMessage = 'Ocorreu um erro ao criar a consulta. Tente novamente.';
        this.dtr.markForCheck();
      }
    });
  }

  cancel() {
    this.router.navigate(['/main-layout/consultations']);
  }
}
