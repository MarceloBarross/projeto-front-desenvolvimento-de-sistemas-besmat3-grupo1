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
import { CoordenadorService } from '../../../services/coordenaor.service';
import { CoordenadorDTO } from '../../../models/cordeador/coordenadorDTO';
import { Coordenador } from '../../../models/cordeador/cordenador';
import { Observable } from 'rxjs/internal/Observable';
import { AsyncPipe } from '@angular/common';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';

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
    AsyncPipe,
    InputGroupModule,
    InputGroupAddonModule,
    SelectModule,
  ],
  templateUrl: './ies-unit-create.html',
  styleUrl: './ies-unit-create.scss',
})
export class IesUnitCreate implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);

  representatives: Observable<Coordenador[]> = new Observable<Coordenador[]>();
  iesList: Observable<Ies[]> = new Observable<Ies[]>();

  representativeDialogVisible = false;
  representativesDTO: CoordenadorDTO[] = [];
  errMessage = '';

  unitForm = this.fb.group({
    name: ['', Validators.required],
    representative: [null as Coordenador | null, Validators.required],
    ies: [null as Ies | null, Validators.required],
    isAtivo: [true],
  });

  representativeForm = this.fb.group({
    nome: ['', Validators.required],
    email: [''],
    telefone: [''],
  });

  constructor(
    private readonly iesUnitService: IesUnitService,
    private readonly iesService: IesService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly coordenadorService: CoordenadorService,
  ) {}

  ngOnInit(): void {
    this.carregarRepresentantes();
    this.carregarIes();
  }

  openRepresentativeDialog(): void {
    this.representativeDialogVisible = true;
    this.representativeForm.reset();
  }

  carregarRepresentantes(): void {
    this.representatives = this.coordenadorService.listarCoordenadores();
  }

  carregarIes(): void {
    this.iesList = this.iesService.listarIes();
  }

  saveRepresentative(): void {
    if (this.representativeForm.invalid) {
      this.representativeForm.markAllAsTouched();
      this.errMessage = 'Preencha todos os campos do responsável.';
      return;
    }

    const value = this.representativeForm.getRawValue();

    const novoCoordenador: CoordenadorDTO = {
      nome: value.nome.trim(),
      email: value.email.trim(),
      telefone: value.telefone.trim(),
    };

    this.coordenadorService.cadastrar(novoCoordenador).subscribe({
      next: (criado) => {
        this.representativesDTO = [...this.representativesDTO, criado];
        this.unitForm.patchValue({ representative: criado });
        this.representativeDialogVisible = false;
        this.errMessage = '';
        this.carregarRepresentantes();
      },
      error: () => {
        this.errMessage = 'Não foi possível salvar o responsável.';
      },
    });
  }

  save(): void {
    if (this.unitForm.invalid) {
      this.unitForm.markAllAsTouched();
      this.errMessage = 'Preencha os campos obrigatorios.';
      return;
    }

    const payload = this.unitForm.getRawValue();

    const novaUnidade = {
      nome: payload.name.trim(),
      representante_id: payload.representative?.id!,
      ies_id: payload.ies?.id!,
      status: payload.isAtivo ? 'ATIVO' : 'INATIVO',
    };

    console.log(novaUnidade);

    const request = this.iesUnitService.cadastrar(novaUnidade);

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
