import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { IesService } from '../../../services/ies.service';
import { Ies } from '../../../models/ies/ies-interface';

type IesPayload = Omit<Ies, 'id'>;

@Component({
	selector: 'app-ies-create',
	imports: [
		CardModule,
		ReactiveFormsModule,
		FloatLabelModule,
		InputTextModule,
		ButtonModule,
		RouterModule,
		MessageModule,
		ToastModule
	],
	templateUrl: './ies-create.html',
	styleUrl: './ies-create.scss'
})
export class IesCreate implements OnInit {
	fb = inject(NonNullableFormBuilder);
	errMessage: string = '';

	formIes = this.fb.group({
		nome: ['', Validators.required],
		sigla: ['', Validators.required]
	});

	constructor(
		private iesService: IesService,
		private router: Router,
		private dtr: ChangeDetectorRef,
		private messageService: MessageService,
		private route: ActivatedRoute
	) {}

	save() {
		if (this.formIes.invalid) {
			this.errMessage = 'Por favor, preencha todos os campos obrigatorios.';
			this.dtr.markForCheck();
			return;
		}

		const data: IesPayload = { ...this.formIes.getRawValue() };
		const id = this.route.snapshot.paramMap.get('id');

		const request = id
			? this.iesService.alterarStatusIes(+id)
			: this.iesService.cadastrarIes(data);

		request.subscribe({
			next: () => {
				this.messageService.add({
					severity: 'success',
					summary: 'Sucesso',
					detail: id ? 'IES editada com sucesso' : 'IES criada com sucesso'
				});

				this.router.navigate(['/main-layout/ies']);
				this.dtr.markForCheck();
			},
			error: (err) => {
				console.error('Erro ao salvar IES.', err);
				this.errMessage = 'Ocorreu um erro ao salvar a IES. Tente novamente.';
				this.dtr.markForCheck();
			}
		});
	}

	cancel() {
		this.router.navigate(['/main-layout/ies']);
	}

	loadIes(id: number) {
		this.iesService.findById(id).subscribe({
			next: (ies) => {
				if (!ies) {
					this.errMessage = 'IES nao encontrada.';
					this.dtr.markForCheck();
					return;
				}

				this.formIes.patchValue(ies);
				this.dtr.markForCheck();
			},
			error: (err) => {
				console.error('Erro ao carregar IES.', err);
				this.errMessage = 'Ocorreu um erro ao carregar os dados da IES.';
				this.dtr.markForCheck();
			}
		});
	}

	ngOnInit(): void {
		const id = this.route.snapshot.paramMap.get('id');

		if (id) {
			this.loadIes(+id);
		}
	}
}
