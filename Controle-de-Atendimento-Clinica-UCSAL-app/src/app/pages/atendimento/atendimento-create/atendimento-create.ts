import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { Patient } from '../../../models/patient/patient-interface';
import { Profissionals } from '../../../models/profissionals/profissionals-interface';
import { MedicationResponse } from '../../../models/medication/medicamentoResponse';
import { AtendimentoRequest } from '../../../models/atendimento/atendimentoRequest';
import { ProntuariosService } from '../../../services/prontuarios.service';
import { MedicationService } from '../../../services/medication.service';
import { PatientService } from '../../../services/patient.service';
import { ProfissionalsService } from '../../../services/profissionals.service';
import { AtendimentoResponse } from '../../../models/atendimento/atendimentoResponse';
import { AtendimentoService } from '../../../services/atendimento.service';

@Component({
  selector: 'app-atendimento-create',
  imports: [CardModule, ReactiveFormsModule, FloatLabelModule, CommonModule, MessageModule, ButtonModule],
  templateUrl: './atendimento-create.html',
  styleUrl: './atendimento-create.scss',
})
export class AtendimentoCreate implements OnInit {

  fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private prontuariosService = inject(ProntuariosService);
  private medicationService = inject(MedicationService);
  private patientService = inject(PatientService);
  private profissionalsService = inject(ProfissionalsService);
  private atendimentoService = inject(AtendimentoService);
  private cdr = inject(ChangeDetectorRef)

  errMessage = '';
  pacienteId: number | null = null;
  patients: Patient[] = [];
  profissionals: Profissionals[] = [];
  medications: MedicationResponse[] = [];
  atendimentos: AtendimentoResponse[] = [];
  prontuarioId: number | null = null;

  form = this.fb.group({
    prontuarioId: [null as number | null, Validators.required],
    profissionalId: [null as number | null, Validators.required],
    medicacaoId: [null as number | null, Validators.required],
    quantidadeMedicacaoUtilizada: [0, [Validators.required, Validators.min(1)]],
    tipoAtendimento: ['CONSULTA', Validators.required],
    dataHoraInicio: [this.formatDateTime(new Date()), Validators.required],
    sintomas: ['', Validators.required],
    diagnostico: ['', Validators.required],
    medicacaoDosagem: ['', Validators.required],
    tratamentoIndicado: ['', Validators.required],
    dataHoraEncerramento: [null as string | null]
  });

  tiposAtendimento = [
    { label: 'Urgência', value: 'URGENCIA' },
    { label: 'Emergência', value: 'EMERGENCIA' },
    { label: 'Consulta', value: 'CONSULTA' },
    { label: 'Revisão', value: 'REVISAO' }
  ];

  ngOnInit() {
    this.pacienteId = +this.route.snapshot.paramMap.get('pacienteId')!;
    this.loadData();
  }

  private loadData() {
    this.profissionalsService.listarProfissionals().subscribe(
      (data) => {
        this.profissionals = data;
      },
      (error) => {
        this.errMessage = 'Erro ao carregar profissionais';
      }
    );

    this.medicationService.listMedications().subscribe(
      (data) => {
        this.medications = data;
      },
      (error) => {
        this.errMessage = 'Erro ao carregar medicações';
      }
    );

    if (this.pacienteId) {
      this.prontuariosService.buscarPorId(this.pacienteId).subscribe(
        (data) => {
          this.atendimentos = data.atendimentos || [];
          this.prontuarioId = data.id;
          this.form.patchValue({
            prontuarioId: this.prontuarioId
          });
          this.cdr.markForCheck();
        },
        (error) => {
          this.errMessage = 'Erro ao carregar prontuários do paciente';
        }
      );
    }
  }

  private formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  save() {
    if (this.form.invalid) {
      this.errMessage = 'Preencha todos os campos obrigatórios';
      return;
    }

    const formValue = this.form.value;
    const atendimentoRequest: AtendimentoRequest = {
      prontuarioId: formValue.prontuarioId!,
      profissionalId: formValue.profissionalId!,
      medicacaoId: formValue.medicacaoId!,
      quantidadeMedicacaoUtilizada: formValue.quantidadeMedicacaoUtilizada!,
      tipoAtendimento: formValue.tipoAtendimento as 'URGENCIA' | 'EMERGENCIA' | 'CONSULTA' | 'REVISAO',
      dataHoraInicio: new Date(formValue.dataHoraInicio!),
      sintomas: formValue.sintomas!,
      diagnostico: formValue.diagnostico!,
      medicacaoDosagem: formValue.medicacaoDosagem!,
      tratamentoIndicado: formValue.tratamentoIndicado!,
      dataHoraEncerramento: formValue.dataHoraEncerramento ? new Date(formValue.dataHoraEncerramento) : new Date()
    };

    this.atendimentoService.iniciarAtendimento(atendimentoRequest).subscribe({
      next: (response) => {
        this.router.navigate([`/main-layout/prontuarios/${this.pacienteId}`]);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.log(err);
        this.errMessage = 'Erro ao iniciar atendimento: ' + err.message;
      }
    })
  }

  cancel() {
    const id = this.route.snapshot.paramMap.get('pacienteId');
    this.router.navigate([`/main-layout/prontuarios/${id}`]);
  }
}
