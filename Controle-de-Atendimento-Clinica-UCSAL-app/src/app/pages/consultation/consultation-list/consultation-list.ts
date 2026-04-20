import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { Consultation } from '../../../models/consultation/consultation-interface';
import { ConsultationService } from '../../../services/consultation.service';

@Component({
  selector: 'app-consultation-list',
  imports: [CardModule, TableModule, FormsModule, ButtonModule, CommonModule, DialogModule],
  templateUrl: './consultation-list.html',
  styleUrl: './consultation-list.scss',
})
export class ConsultationList implements OnInit {

  constructor(private router: Router, private consultationService: ConsultationService, private dtr: ChangeDetectorRef) {}

  appointments: Consultation[] = [];
  prontuarioDialogVisible = false;
  prontuarioSelecionado: Consultation | null = null;

  listarConsultas() {
    this.consultationService.listarConsultas().subscribe({
      next: (dados) => {
        this.appointments = [...dados];
        this.dtr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao listar consultas:', err);
        this.dtr.markForCheck();
      }
    })
  }

  novoAgendamento() {
    this.router.navigate(['/main-layout/consultations/create']);
  }

  continuarAtendimento(id: number) {
    this.consultationService.iniciarAtendimento(id).subscribe({
      next: (data) => {
        console.log('Atendimento iniciado com sucesso.');
        this.router.navigate(['/main-layout/consultations/continue', id]);
        this.dtr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao iniciar atendimento:', err);
      }
    })
  }

  abrirProntuario(consulta: Consultation) {
    this.prontuarioSelecionado = consulta;
    this.prontuarioDialogVisible = true;
  }

  fecharProntuario() {
    this.prontuarioDialogVisible = false;
    this.prontuarioSelecionado = null;
  }

  ngOnInit() {
    this.listarConsultas();
  }
}
