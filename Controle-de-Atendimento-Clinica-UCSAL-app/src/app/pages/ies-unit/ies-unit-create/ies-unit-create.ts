import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Observable } from 'rxjs/internal/Observable';
import { AsyncPipe } from '@angular/common';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { Coordenador } from '../../../models/cordeador/cordenador';


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
    FormsModule
  ],
  templateUrl: './ies-unit-create.html',
  styleUrl: './ies-unit-create.scss',
})
export class IesUnitCreate implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);

  iesList: Observable<Ies[]> = new Observable();
  representativesDTO: CoordenadorDTO[] = [];
  representatives: Observable<Coordenador[]> = new Observable();
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
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', Validators.required],
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

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.unitId = Number(id);
    this.isEditMode = true;

    // this.iesUnitService.findById(this.unitId).subscribe((unit) => {
    //   if (!unit) {
    //     this.errMessage = 'Unidade nao encontrada.';
    //     return;
    //   }

    //   this.unitForm.patchValue({
    //     unitName: unit.unitName,
    //     representativeName: unit.representative?.nome || '',
    //     iesId: unit.iesId.toString(),
    //     isAtivo: unit.isAtivo,
    //   });
    // });
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
        this.unitForm.patchValue({ representativeName: criado.nome });
        this.representativeDialogVisible = false;
        this.errMessage = '';
        this.carregarRepresentantes();
      },
      error: () => {
        this.errMessage = 'Não foi possível salvar o responsável.';
      },
    });
  }

  // save(): void {
  //   if (this.unitForm.invalid) {
  //     this.unitForm.markAllAsTouched();
  //     this.errMessage = 'Preencha os campos obrigatorios.';
  //     return;
  //   }

  //   const payload = this.unitForm.getRawValue();

  //   const request = this.unitId
  //     ? this.iesUnitService.updateUnit(this.unitId, payload)
  //     : this.iesUnitService.createUnit(payload);

  //   request.subscribe((result) => {
  //     if (!result) {
  //       this.errMessage = 'Nao foi possivel salvar a unidade.';
  //       return;
  //     }

  //     this.errMessage = '';
  //     this.router.navigate(['/main-layout/ies-units']);
  //   });
  // }

  // cancel(): void {
  //   this.router.navigate(['/main-layout/ies-units']);
  // }
}
