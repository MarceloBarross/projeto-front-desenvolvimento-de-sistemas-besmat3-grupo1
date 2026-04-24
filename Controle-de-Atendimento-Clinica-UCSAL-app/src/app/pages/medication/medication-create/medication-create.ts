import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MedicationService } from '../../../services/medication.service';
import { StorageType } from '../../../models/medication/medication-interface';

@Component({
  selector: 'app-medication-create',
  imports: [
    CardModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    RouterModule,
    MessageModule,
  ],
  templateUrl: './medication-create.html',
  styleUrl: './medication-create.scss',
})
export class MedicationCreate {
  private readonly fb = inject(NonNullableFormBuilder);

  errMessage = '';

  medicationForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    supplier: ['', Validators.required],
    storageType: ['AMBIENTE' as StorageType, Validators.required],
    quantity: [0, [Validators.required, Validators.min(1)]],
    expirationDate: ['', Validators.required],
    acquisitionDate: ['', Validators.required],
    isAtivo: [true],
  });

  constructor(
    private readonly medicationService: MedicationService,
    private readonly router: Router,
  ) {}

  save(): void {
    if (this.medicationForm.invalid) {
      this.medicationForm.markAllAsTouched();
      this.errMessage = 'Preencha os campos obrigatorios.';
      return;
    }

    const payload = this.medicationForm.getRawValue();

    this.medicationService.createMedication(payload).subscribe((result) => {
      if (!result) {
        this.errMessage = 'Nao foi possivel salvar a medicacao.';
        return;
      }

      this.errMessage = '';
      this.router.navigate(['/main-layout/medications']);
    });
  }

  cancel(): void {
    this.router.navigate(['/main-layout/medications']);
  }
}
