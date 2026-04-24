import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { InputMaskModule } from 'primeng/inputmask';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProfissionalsService } from '../../../services/profissionals.service';
import { ProfissionalsDTO } from '../../../models/profissionals/profissionals-dto';

@Component({
  selector: 'app-profissionals-create',
  imports: [
    CardModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    RouterModule,
    MessageModule,
    InputMaskModule,
    ToastModule
  ],
  templateUrl: './profissionals-create.html',
  styleUrl: './profissionals-create.scss'
})
export class ProfissionalsCreate implements OnInit {
  fb = inject(NonNullableFormBuilder);
  errMessage: string = '';
  statusOptions: ProfissionalsDTO['status'][] = ['Ativo', 'Inativo'];
  regionalCouncilOptions: string[] = ['CRM', 'COREN', 'CREFITO', 'CRP', 'CRO', 'CFF'];

  formProfissionals = this.fb.group({
    professionalCode: ['', Validators.required],
    name: ['', Validators.required],
    specialty: ['', Validators.required],
    attendanceDays: ['', Validators.required],
    attendanceShifts: ['', Validators.required],
    regionalCouncil: ['CRM', Validators.required],
    councilRegistrationNumber: ['', Validators.required],
    registrationDate: ['', Validators.required],
    status: ['Ativo' as ProfissionalsDTO['status'], Validators.required]
  });

  constructor(
    private profissionalsService: ProfissionalsService,
    private router: Router,
    private dtr: ChangeDetectorRef,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  save() {
    if (this.formProfissionals.invalid) {
      this.errMessage = 'Por favor, preencha todos os campos obrigatorios.';
      this.dtr.markForCheck();
      return;
    }

    const data: ProfissionalsDTO = { ...this.formProfissionals.getRawValue() };
    const id = this.route.snapshot.paramMap.get('id');

    const request = id
      ? this.profissionalsService.editarProfissionals(+id, data)
      : this.profissionalsService.cadastrarProfissionals(data);

    request.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: id ? 'Profissional editado com sucesso' : 'Profissional criado com sucesso'
        });

        this.router.navigate(['/main-layout/profissionals']);
        this.dtr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao salvar profissional.', err);
        this.errMessage = 'Ocorreu um erro ao salvar o profissional. Tente novamente.';
        this.dtr.markForCheck();
      }
    });
  }

  cancel() {
    this.router.navigate(['/main-layout/profissionals']);
  }

  loadProfissional(id: number) {
    this.profissionalsService.findById(id).subscribe({
      next: (profissional) => {
        if (!profissional) {
          this.errMessage = 'Profissional nao encontrado.';
          this.dtr.markForCheck();
          return;
        }

        this.formProfissionals.patchValue(profissional);
        this.dtr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao carregar profissional.', err);
        this.errMessage = 'Ocorreu um erro ao carregar os dados do profissional.';
        this.dtr.markForCheck();
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.formProfissionals.patchValue({ registrationDate: new Date().toISOString().split('T')[0] });
    }

    if (id) {
      this.loadProfissional(+id);
    }
  }
}
