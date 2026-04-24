import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
import { Patient } from '../../../models/patient/patient-interface';
import { Profissionals } from '../../../models/profissionals/profissionals-interface';
import { PatientService } from '../../../services/patient.service';
import { ProfissionalsService } from '../../../services/profissionals.service';

@Component({
  selector: 'app-consultation-create',
  standalone: true,
  imports: [
    CardModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    RouterModule,
    MessageModule,
    ToastModule
  ],
  templateUrl: './consultation-create.html',
  styleUrl: './consultation-create.scss',
})
export class ConsultationCreate implements OnInit {

  fb = inject(FormBuilder);

  errMessage = '';
  patients: Patient[] = [];
  profissionals: Profissionals[] = [];

  tipos = [
    { label: 'Urgência', value: 'URGENTE' },
    { label: 'Emergência', value: 'EMERGENCIA' },
    { label: 'Consulta', value: 'CONSULTA' },
    { label: 'Revisão', value: 'REVISAO' }
  ];

  form = this.fb.group({
    patientId: [null as number | null, Validators.required],
    professionalId: [null as number | null, Validators.required],
    tipo: ['CONSULTA', Validators.required],
    dataInicio: [new Date(), Validators.required]
  });

  constructor(
    private consultationService: ConsultationService,
    private patientService: PatientService,
    private profissionalsService: ProfissionalsService,
    private router: Router,
    private dtr: ChangeDetectorRef,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.carregarPacientes();
    this.carregarProfissionais();
  }

  carregarPacientes() {
    this.patientService.listarPacientes().subscribe({
      next: (data) => this.patients = data,
      error: () => this.errMessage = 'Erro ao carregar pacientes.'
    });
  }

  carregarProfissionais() {
    this.profissionalsService.listarProfissionals().subscribe({
      next: (data) => this.profissionals = data,
      error: () => this.errMessage = 'Erro ao carregar profissionais.'
    });
  }

  save() {
    if (this.form.invalid) {
      this.errMessage = 'Preencha todos os campos obrigatórios.';
      return;
    }

    const raw = this.form.getRawValue();

    const data = {
      patientId: Number(raw.patientId),
      professionalId: Number(raw.professionalId),
      tipo: raw.tipo as any,
      dataInicio: raw.dataInicio ?? undefined
    };

    this.consultationService.criar(data).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Consulta criada com sucesso'
        });

        this.router.navigate(['/main-layout/consultations']);
      },
      error: (err) => {
        console.error(err);
        this.errMessage = 'Erro ao criar consulta.';
      }
    });
  }

  cancel() {
    this.router.navigate(['/main-layout/consultations']);
  }
}