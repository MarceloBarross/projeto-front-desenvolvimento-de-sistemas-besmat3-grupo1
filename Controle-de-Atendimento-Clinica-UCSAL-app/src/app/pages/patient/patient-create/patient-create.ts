import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { PatientService } from '../../../services/patient.service';
import { PatientDTO } from '../../../models/patient/patient-dto';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { School } from '../../../models/ schools/school-interface';
import { IesResponse } from '../../../models/ies-unit/ies-unit-Response';
import { SchoolService } from '../../../services/school.service';
import { IesUnitService } from '../../../services/ies-unit.service';

@Component({
  selector: 'app-patient-create',
  imports: [CardModule, ReactiveFormsModule, FloatLabelModule, InputTextModule, ButtonModule, RouterModule, MessageModule, InputMaskModule,
  ToastModule],
  templateUrl: './patient-create.html',
  styleUrl: './patient-create.scss',

})
export class PatientCreate implements OnInit {

  fb = inject(NonNullableFormBuilder);
  errMessage: string = '';
  categories: PatientDTO['categoria'][] = ['COLABORADOR_UNIDADE', 'COLABORADOR_ESCOLA', 'ALUNO', 'EXTERNO'];
  statusOptions: PatientDTO['status'][] = ['ATIVO', 'INATIVO'];

  formPaciente = this.fb.group({
    nome: ['', Validators.required],
    categoria: ['ALUNO' as PatientDTO['categoria'], Validators.required],
    celular: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    motivoRestricao: [''],
    status: ['ATIVO' as PatientDTO['status'], Validators.required],
    escola_id: [null as number | null],
    unidade_id: [null as number | null],
    dataCadastramento: [new Date().toISOString().substring(0, 10), Validators.required]
  });

  escolas: School[] = [];
  unidades: IesResponse[] = [];
  categoriaAtual: PatientDTO['categoria'] = 'ALUNO';

  constructor(private patientService: PatientService, private router: Router, private dtr: ChangeDetectorRef,
     private messageService: MessageService, private route: ActivatedRoute, private schoolService: SchoolService, private unitService: IesUnitService) {}

  save(){
    if (this.formPaciente.invalid) {
      this.errMessage = 'Por favor, preencha todos os campos obrigatórios.';
      this.dtr.markForCheck();
      return;
    }

    const newPatient: PatientDTO = {...this.formPaciente.getRawValue()};
    const id = this.route.snapshot.paramMap.get('id');

    const request = id
    ? this.patientService.editPaciente(+id, newPatient) 
    : this.patientService.cadastrarPaciente(newPatient);


    request.subscribe({
      next: () => {
        console.log('Paciente cadastrado com sucesso!');
        this.messageService.add({
          severity:'success',
          summary: 'Sucesso',
          detail: id 
          ?'Paciente editado com sucesso'
          :'Paciente criado com sucesso'
        });
        this.router.navigate(['/main-layout/patients']);
        this.dtr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao cadastrar paciente.', err);
        this.errMessage = 'Ocorreu um erro ao cadastrar o paciente. Por favor, tente novamente.';
        this.dtr.markForCheck();
      }
    });
  }

  cancel(){
    this.router.navigate(['/main-layout/patients']);
  }
  

  loadPatient(id: number) {
    this.patientService.findById(id).subscribe({
      next: (patient) => {
        if (!patient) {
          this.errMessage = 'Paciente não encontrado.';
          this.dtr.markForCheck();
          return;
        }
        const { nome, categoria, celular, email, status, motivoRestricao, dataCadastramento } = patient;
        this.formPaciente.patchValue({
          nome,
          categoria,
          celular,
          email,
          motivoRestricao,
          status,
          dataCadastramento
        });
        this.dtr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao carregar paciente.', err);
        this.errMessage = 'Ocorreu um erro ao carregar os dados do paciente. Por favor, tente novamente.';
        this.dtr.markForCheck();
      }
    })
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadPatient(Number(+id));
    }

    this.schoolService.listSchools().subscribe(e => this.escolas = e);
    this.unitService.listUnits().subscribe(u => this.unidades = u);

    this.formPaciente.get('categoria')?.valueChanges.subscribe(cat => {
        this.categoriaAtual = cat;
        this.formPaciente.patchValue({ escola_id: null, unidade_id: null });
    });
  }
}
