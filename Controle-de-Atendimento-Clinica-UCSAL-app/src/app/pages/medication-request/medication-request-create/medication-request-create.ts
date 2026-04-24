import { Component, OnInit, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MedicationService } from '../../../services/medication.service';
import { Medication } from '../../../models/medication/medication-interface';
import { MedicationRequestService } from '../../../services/medication-request.service';
import { RequestPriority } from '../../../models/medication-request/medication-request-interface';

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
  ],
  templateUrl: './medication-request-create.html',
  styleUrl: './medication-request-create.scss',
})
export class MedicationRequestCreate implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);

  medications: Medication[] = [];
  errMessage = '';

  requestForm = this.fb.group({
    medicationId: [0, [Validators.required, Validators.min(1)]],
    medicationName: ['', Validators.required],
    requestPriority: ['PREVENTIVO' as RequestPriority, Validators.required],
  });

  constructor(
    private readonly medicationService: MedicationService,
    private readonly medicationRequestService: MedicationRequestService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.medicationService.listMedications().subscribe((medications) => {
      this.medications = medications;
    });
  }

  onMedicationChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const selectedId = Number(select.value);

    const selectedMedication = this.medications.find((medication) => medication.id === selectedId);
    if (!selectedMedication) {
      this.requestForm.patchValue({ medicationId: 0, medicationName: '' });
      return;
    }

    this.requestForm.patchValue({
      medicationId: selectedMedication.id,
      medicationName: selectedMedication.name,
    });
  }

  save(): void {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      this.errMessage = 'Preencha os campos obrigatorios.';
      return;
    }

    const payload = this.requestForm.getRawValue();

    this.medicationRequestService.createRequest(payload).subscribe((request) => {
      if (!request) {
        this.errMessage = 'Nao foi possivel salvar a solicitacao.';
        return;
      }

      this.errMessage = '';
      this.router.navigate(['/main-layout/medication-requests']);
    });
  }

  cancel(): void {
    this.router.navigate(['/main-layout/medication-requests']);
  }
}
