import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
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
import { CoordenadorService } from '../../../services/coordenaor.service';
import { CoordenadorDTO } from '../../../models/cordeador/coordenadorDTO';
import { Coordenador } from '../../../models/cordeador/cordenador';
import { Observable } from 'rxjs/internal/Observable';
import { AsyncPipe } from '@angular/common';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SelectModule } from 'primeng/select';
import { SchoolResponse } from '../../../models/ schools/school-Response';
import { SchoolRequest } from '../../../models/ schools/school-Request';

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
    AsyncPipe,
    InputGroupModule,
    InputGroupAddonModule,
    SelectModule,
  ],
  templateUrl: './shcool-create.html',
  styleUrl: './shcool-create.scss',
})
export class ShcoolCreate implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);

  escolas: Observable<SchoolResponse[]> = new Observable<SchoolResponse[]>();
  coordenadores: Observable<Coordenador[]> = new Observable<Coordenador[]>();
  iesList: Observable<Ies[]> = new Observable<Ies[]>();

  coordenadorDialogVisible = false;
  coordenadoresDTO: CoordenadorDTO[] = [];
  errMessage = '';
  isEditMode = false;

  schoolForm = this.fb.group({
    name: ['', Validators.required],
    coordenador: [null as Coordenador | null, Validators.required],
    ies: [null as Ies | null, Validators.required],
    isAtivo: [true],
  });

  coordenadorForm = this.fb.group({
    nome: ['', Validators.required],
    email: [''],
    telefone: [''],
  });

  constructor(
    private readonly schoolService: SchoolService,
    private readonly iesService: IesService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly coordenadorService: CoordenadorService,
  ) {}

  ngOnInit(): void {
    this.carregarCoordenador();
    this.carregarIes();
    this.carregarEscola();
  }

  openCoordenadorDialog(): void {
    this.coordenadorDialogVisible = true;
    this.coordenadorForm.reset();
  }
  carregarCoordenador(): void {
    this.coordenadores = this.coordenadorService.listarCoordenadores();
  }

  carregarIes(): void {
    this.iesList = this.iesService.listarIes();
  }

  carregarEscola(): void {
    this.escolas = this.schoolService.listarTodas();
  }

  saveCoordenador(): void {
    if (this.coordenadorForm.invalid) {
      this.coordenadorForm.markAllAsTouched();
      this.errMessage = 'Preencha todos os campos do coordenador.';
      return;
    }

    const value = this.coordenadorForm.getRawValue();

    const novoCoordenador: CoordenadorDTO = {
      nome: value.nome.trim(),
      email: value.email.trim(),
      telefone: value.telefone.trim(),
    };

    this.coordenadorService.cadastrar(novoCoordenador).subscribe({
      next: (criado) => {
        this.coordenadoresDTO = [...this.coordenadoresDTO, criado];
        this.schoolForm.patchValue({ coordenador: criado });
        this.coordenadorDialogVisible = false;
        this.errMessage = '';
        this.carregarCoordenador();
      },
      error: () => {
        this.errMessage = 'Não foi possível salvar o coordenador.';
      },
    });
  }

  save(): void {


    if (this.schoolForm.invalid) {
      this.schoolForm.markAllAsTouched();
      this.errMessage = 'Preencha os campos obrigatorios.';
      return;
    }

    const payload = this.schoolForm.getRawValue();



    const novaEscola: SchoolRequest = {
      nome: payload.name.trim(),
      coordenador_id: payload.coordenador?.id!,
      ies_id: payload.ies?.id!,
      status: payload.isAtivo ? 'ATIVO' : 'INATIVO',
    };

    console.log(novaEscola);

    const request = this.schoolService.cadastrar(novaEscola);

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
