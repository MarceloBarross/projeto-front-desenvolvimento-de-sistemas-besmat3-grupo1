import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { PatientService } from '../../../services/patient.service';
import { PatientDTO } from '../../../models/patient/patient-dto';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Route, Router, RouterModule } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';

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

  formPacient = this.fb.group({
    name: ['', Validators.required],
    cpf: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  })

  constructor(private patientService: PatientService, private router: Router, private dtr: ChangeDetectorRef,
     private messageService: MessageService, private route: ActivatedRoute) {}

  save(){
    if (this.formPacient.invalid) {
      this.errMessage = 'Por favor, preencha todos os campos obrigatórios.';
      this.dtr.markForCheck();
      return;
    }

    const newPatient: PatientDTO = {...this.formPacient.getRawValue()};
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
        this.router.navigate(['/main-layout/pacientes']);
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
    this.router.navigate(['/main-layout/pacientes']);
  }
  

  loadPatient(id: number) {
    this.patientService.finById(id).subscribe({
      next: (patient) => {
        this.formPacient.patchValue(patient!);
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
  }
}
