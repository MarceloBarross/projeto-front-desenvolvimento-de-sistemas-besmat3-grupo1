import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Consultation } from '../../../models/consultation/consultation-interface';
import { InputTextModule } from 'primeng/inputtext';
import { ActivatedRoute, Router,} from '@angular/router';
import { ConsultationService } from '../../../services/consultation.service';
import { ChangeDetectorRef } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-consultation-continue',
  imports: [ButtonModule, CardModule, CommonModule, FormsModule, InputTextModule, ToastModule],
  templateUrl: './consultation-continue.html',
  styleUrl: './consultation-continue.scss',
})
export class ConsultationContinue implements OnInit {

  constructor (private route: ActivatedRoute, private router: Router,
     private consultationService: ConsultationService, private cdr: ChangeDetectorRef,
     private messageService: MessageService) {}

  notes: string = '';
  salvandoNotas: boolean = false;

  consultation!: Consultation;

  finalizarAtendimento() {
    this.consultationService.finalizarAtendimento(this.consultation.id).subscribe({
      next: () => {
        console.log('Atendimento finalizado com sucesso.');
        this.router.navigate(['/main-layout/consultations']);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao finalizar atendimento:', err);
        this.cdr.markForCheck();
      }
    });
  }

  cancelarAtendimento() {
    this.router.navigate(['/main-layout/consultations']);
    this.cdr.markForCheck();
  }

  salvarNotas() {
    if (!this.consultation?.id) {
      console.error('Consulta não carregada.');
      return;
    }

    this.salvandoNotas = true;
    this.cdr.markForCheck();

    this.consultationService.salvarNotas(this.consultation.id, this.notes).subscribe({
      next: (data) => {
        this.consultation = { ...data };
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Prontuario Salvo com sucesso!'
        });
        this.salvandoNotas = false;
        this.cdr.markForCheck();
      },
      error: (err: unknown) => {
        console.error('Erro ao salvar notas:', err);
        this.salvandoNotas = false;
        this.cdr.markForCheck();
      }
    });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.consultationService.obterConsultaPorId(id).subscribe({
      next: (data) => {
        this.consultation = {...data};
        this.cdr.markForCheck();

      },
      error: (err) => {
        console.error('Erro ao obter consulta:', err);
        this.cdr.markForCheck();
      }
    });
  }
}
