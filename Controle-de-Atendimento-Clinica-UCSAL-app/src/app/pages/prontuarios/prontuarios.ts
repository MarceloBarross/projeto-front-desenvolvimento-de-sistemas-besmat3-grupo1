import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { AtendimentoResponse } from '../../models/atendimento/atendimentoResponse';
import { ProntuariosService } from '../../services/prontuarios.service';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prontuarios',
  imports: [CardModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    RouterModule,
    MessageModule,
    ToastModule,
    TableModule,
    DialogModule,
    CommonModule],
  templateUrl: './prontuarios.html',
  styleUrl: './prontuarios.scss',
})
export class Prontuarios implements OnInit {
  atendimentos: AtendimentoResponse[] = [];
  nomePaciente: string = '';
  today: Date = new Date();
  visualizacaoDialogVisible = false;
  atendimentoSelecionado: AtendimentoResponse | null = null;

  constructor(private prontuariosService: ProntuariosService, private cdr: ChangeDetectorRef, private route: ActivatedRoute,
    private router: Router
  ) {}

  
  listarAtendimentos(id: number) {
    // const id = + this.route.snapshot.paramMap.get('id')!;
    this.prontuariosService.buscarPorId(id).subscribe({
      next: (data) => {
        console.log(data);
        this.atendimentos = data.atendimentos;
        this.nomePaciente = data.nomePaciente;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao listar atendimentos: ' + err.message);
      }  
    })
  }

  novoAtendimento() {
    const id = + this.route.snapshot.paramMap.get('pacienteId')!;
    this.router.navigate([`/main-layout/atendimento/atendimento-create/${id}`]);
  }

  visualizarAtendimento(atendimento: AtendimentoResponse) {
    this.atendimentoSelecionado = atendimento;
    this.visualizacaoDialogVisible = true;
  }
  
  
  ngOnInit() {
    const id = + this.route.snapshot.paramMap.get('pacienteId')!;
    this.listarAtendimentos(id);
  }
}
