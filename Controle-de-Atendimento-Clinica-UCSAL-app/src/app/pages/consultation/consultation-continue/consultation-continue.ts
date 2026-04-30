import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultationService } from '../../../services/consultation.service';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MedicationService } from '../../../services/medication.service';
import { MedicationResponse } from '../../../models/medication/medicamentoResponse';

@Component({
  selector: 'app-consultation-continue',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
    TextareaModule,
    SelectModule,
    DatePickerModule,
    CommonModule,
    AutoCompleteModule
  ],
  templateUrl: './consultation-continue.html',
  styleUrl: './consultation-continue.scss',
})
export class ConsultationContinue implements OnInit {

  fb = inject(NonNullableFormBuilder);

  constructor(private route: ActivatedRoute, private router: Router, private consultationService: ConsultationService,
    private medicamentosService: MedicationService
  ) {}

  mediamentos: MedicationResponse[] = [];
  medicacoesFiltradas: any[] = [];

  tiposAtendimento = [
    { label: 'Urgência', value: 'URGENCIA' },
    { label: 'Emergência', value: 'EMERGENCIA' },
    { label: 'Consulta', value: 'CONSULTA' },
    { label: 'Revisão', value: 'REVISAO' }
  ];

  form = this.fb.group({
    tipo: ['CONSULTA', Validators.required],
    dataInicio: [new Date(), Validators.required],
    dataFim: [null as Date | null],

    sintomas: ['', Validators.required],
    diagnostico: ['', Validators.required],

    medicacao: [''],
    dosagem: [''],
    tratamento: ['']
  });

  consultationId!: number;

  ngOnInit() {
    this.medicamentosService.listMedications().subscribe({
      next: (meds) => {
        this.mediamentos = meds.filter(m => m.status === 'ATIVO'); 
      }
    })

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/main-layout/consultations']);
      return;
    }

    this.consultationId = +id;

    this.consultationService.findByIdRequest(this.consultationId).subscribe({
      next: (consulta) => {
        this.form.patchValue({
          tipo: consulta.tipo,
          dataInicio: consulta.dataInicio,
          dataFim: consulta.dataFim ?? null,
          sintomas: consulta.sintomas,
          diagnostico: consulta.diagnostico,
          medicacao: consulta.medicacao ?? '',
          dosagem: consulta.dosagem ?? '',
          tratamento: consulta.tratamento ?? ''
        });
      },
      error: (err) => {
        console.error(err);
        this.router.navigate(['/main-layout/consultations']);
      }
    });
  }

  filtrarMedicacao(event: { query: string }) {
    const query = event.query.toLowerCase();
    this.medicacoesFiltradas = this.mediamentos
      .map(m => m.nome)
      .filter(name => name.toLowerCase().includes(query));
  }

  finalizar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); 
      return;
    }

    const raw = this.form.getRawValue();
    const data = {
      ...raw,
      tipo: raw.tipo as any,
      dataFim: raw.dataFim ?? undefined
    };

    this.consultationService
      .finalizarAtendimento(this.consultationId, data)
      .subscribe({
        next: () => {
          this.router.navigate(['/main-layout/consultations']); // ✅ rota correta
        },
        error: (err) => {
          console.error('Erro ao finalizar', err);
        }
      });
  }

  cancelar() {
    this.router.navigate(['/main-layout/consultations']);
  }
}