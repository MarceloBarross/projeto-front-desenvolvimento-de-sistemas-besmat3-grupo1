import { Component, OnInit, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SchoolService } from '../../../services/school.service';
import { IesService } from '../../../services/ies.service';
import { Ies } from '../../../models/ies/ies-interface';

@Component({
  selector: 'app-shcool-create',
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
  templateUrl: './shcool-create.html',
  styleUrl: './shcool-create.scss',
})
export class ShcoolCreate implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);

  coordenadorDialogVisible = false;
  coordenadores: string[] = [];
  iesList: Ies[] = [];
  errMessage = '';
  isEditMode = false;
  schoolId: number | null = null;

  schoolForm = this.fb.group({
    name: ['', Validators.required],
    coordenador: ['', Validators.required],
    iesName: ['', Validators.required],
    isAtivo: [true],
  });

  coordenadorForm = this.fb.group({
    name: ['', Validators.required],
  });

  constructor(
    private readonly schoolService: SchoolService,
    private readonly iesService: IesService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.schoolService.listCoordenadores().subscribe((coordenadores) => {
      this.coordenadores = coordenadores;
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

    this.schoolId = Number(id);
    this.isEditMode = true;

    this.schoolService.findById(this.schoolId).subscribe((school) => {
      if (!school) {
        this.errMessage = 'Escola nao encontrada.';
        return;
      }

      this.schoolForm.patchValue({
        name: school.name,
        coordenador: school.coordenador,
        iesName: school.ies.name,
        isAtivo: school.isAtivo,
      });
    });
  }

  openCoordenadorDialog(): void {
    this.coordenadorDialogVisible = true;
    this.coordenadorForm.reset();
  }

  saveCoordenador(): void {
    const value = this.coordenadorForm.getRawValue();
    const name = value.name.trim();

    if (!name) {
      this.errMessage = 'Informe o nome do coordenador.';
      return;
    }

    this.schoolService.addCoordenador(name).subscribe((coordenadores) => {
      this.coordenadores = coordenadores;
      this.schoolForm.patchValue({ coordenador: name });
      this.coordenadorDialogVisible = false;
      this.errMessage = '';
    });
  }

  save(): void {
    if (this.schoolForm.invalid) {
      this.schoolForm.markAllAsTouched();
      this.errMessage = 'Preencha os campos obrigatorios.';
      return;
    }

    const payload = this.schoolForm.getRawValue();

    const request = this.schoolId
      ? this.schoolService.updateSchool(this.schoolId, payload)
      : this.schoolService.createSchool(payload);

    request.subscribe((result) => {
      if (!result) {
        this.errMessage = 'Nao foi possivel salvar a escola.';
        return;
      }

      this.errMessage = '';
      this.router.navigate(['/main-layout/shcools']);
    });
  }

  cancel(): void {
    this.router.navigate(['/main-layout/shcools']);
  }
}
