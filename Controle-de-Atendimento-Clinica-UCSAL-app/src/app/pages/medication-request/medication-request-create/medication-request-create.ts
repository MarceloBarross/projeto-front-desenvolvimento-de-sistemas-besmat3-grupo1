import { Component, OnInit, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
import { MedicationService } from '../../../services/medication.service';
import { MedicationResponse } from '../../../models/medication/medicamentoResponse';
import { MedicationRequestService } from '../../../services/medication-request.service';
import { MedicacaoSolicitacaoRequest, Priority } from '../../../models/medication-request/medicacaoSolicitacaoRequest';
import { AuthService } from '../../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-medication-request-create',
  imports: [
    CardModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    RouterModule,
    MessageModule,
    CommonModule,
  ],
  templateUrl: './medication-request-create.html',
  styleUrl: './medication-request-create.scss',
})
export class MedicationRequestCreate implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);

  medications: MedicationResponse[] = [];
  errMessage = '';
  selectedMedicationName = '';
  prioridades: { label: string; value: Priority }[] = [
    { label: 'URGENTE - estoque zerado', value: 'URGENTE' },
    { label: 'CRÍTICO - estoque muito baixo', value: 'CRITICO' },
    { label: 'PREVENTIVO - planejamento de consumo', value: 'PREVENTIVO' },
  ];

  requestForm = this.fb.group({
    medicacaoId: [0, [Validators.required, Validators.min(1)]],
    profissionalId: [0, Validators.required],
    caraterSolicitacao: ['PREVENTIVO' as Priority, Validators.required],
  });

  constructor(
    private readonly medicationService: MedicationService,
    private readonly medicationRequestService: MedicationRequestService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.medicationService.listMedications().subscribe((medications) => {
      this.medications = medications;
    });
  }

  onMedicationChange(event: any): void {
    const medicacaoId = event.target.value;
    const medication = this.medications.find(m => m.id == medicacaoId);
    this.selectedMedicationName = medication ? medication.nome : '';
    this.requestForm.patchValue({ medicacaoId: parseInt(medicacaoId) });
  }

  save(): void {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      this.errMessage = 'Preencha os campos obrigatórios.';
      return;
    }

    const form = this.requestForm.getRawValue();
    const payload: MedicacaoSolicitacaoRequest = {
      ...form,
      profissionalId: this.authService.getProfissionalId()!,
    }

    this.medicationRequestService.createRequest(payload).subscribe({
      next: (request) => {
        if (!request) {
          this.errMessage = 'Não foi possível salvar a solicitação.';
          return;
        }

        this.errMessage = '';
        this.router.navigate(['/main-layout/medication-requests']);
      },
      error: (err) => {
        this.errMessage = 'Erro ao salvar a solicitação: ' + err.message;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/main-layout/medication-requests']);
  }
}
