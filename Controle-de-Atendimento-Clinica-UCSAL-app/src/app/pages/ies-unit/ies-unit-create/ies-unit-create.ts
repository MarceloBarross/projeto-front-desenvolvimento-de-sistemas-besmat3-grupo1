import { Component, OnInit, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { IesService } from '../../../services/ies.service';
import { Ies } from '../../../models/ies/ies-interface';
import { IesUnitService } from '../../../services/ies-unit.service';

@Component({
  selector: 'app-ies-unit-create',
  imports: [
    CardModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    RouterModule,
    DialogModule,
    MessageModule,
  ],
  templateUrl: './ies-unit-create.html',
  styleUrl: './ies-unit-create.scss',
})
export class IesUnitCreate implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);

  iesList: Ies[] = [];
  representatives: string[] = [];
  representativeDialogVisible = false;
  errMessage = '';
  isEditMode = false;
  unitId: number | null = null;

  unitForm = this.fb.group({
    unitName: ['', Validators.required],
    representativeName: ['', Validators.required],
    iesName: ['', Validators.required],
    isAtivo: [true],
  });

  representativeForm = this.fb.group({
    name: ['', Validators.required],
  });

  constructor(
    private readonly iesUnitService: IesUnitService,
    private readonly iesService: IesService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.iesUnitService.listRepresentatives().subscribe((representatives) => {
      this.representatives = representatives;
    });

    this.iesService.listarIes().subscribe({
      next: (ies) => {
        this.iesList = ies;
      },
      error: () => {
        this.errMessage = 'Nao foi possivel carregar as IES cadastradas.';
      },
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.unitId = Number(id);
    this.isEditMode = true;

    this.iesUnitService.findById(this.unitId).subscribe((unit) => {
      if (!unit) {
        this.errMessage = 'Unidade nao encontrada.';
        return;
      }

      this.unitForm.patchValue({
        unitName: unit.unitName,
        representativeName: unit.representativeName,
        iesName: unit.ies.name,
        isAtivo: unit.isAtivo,
      });
    });
  }

  openRepresentativeDialog(): void {
    this.representativeDialogVisible = true;
    this.representativeForm.reset();
  }

  saveRepresentative(): void {
    const value = this.representativeForm.getRawValue();
    const name = value.name.trim();

    if (!name) {
      this.errMessage = 'Informe o nome do responsavel.';
      return;
    }

    this.iesUnitService.addRepresentative(name).subscribe((representatives) => {
      this.representatives = representatives;
      this.unitForm.patchValue({ representativeName: name });
      this.representativeDialogVisible = false;
      this.errMessage = '';
    });
  }

  save(): void {
    if (this.unitForm.invalid) {
      this.unitForm.markAllAsTouched();
      this.errMessage = 'Preencha os campos obrigatorios.';
      return;
    }

    const payload = this.unitForm.getRawValue();

    const request = this.unitId
      ? this.iesUnitService.updateUnit(this.unitId, payload)
      : this.iesUnitService.createUnit(payload);

    request.subscribe((result) => {
      if (!result) {
        this.errMessage = 'Nao foi possivel salvar a unidade.';
        return;
      }

      this.errMessage = '';
      this.router.navigate(['/main-layout/ies-units']);
    });
  }

  cancel(): void {
    this.router.navigate(['/main-layout/ies-units']);
  }
}
