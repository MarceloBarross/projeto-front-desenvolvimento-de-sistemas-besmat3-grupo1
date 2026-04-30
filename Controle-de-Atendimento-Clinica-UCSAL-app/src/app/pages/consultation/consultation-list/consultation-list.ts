import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { Consultation } from '../../../models/consultation/consultation-interface';
import { ConsultationService } from '../../../services/consultation.service';
import { PatientService } from '../../../services/patient.service';
import { ProfissionalsService } from '../../../services/profissionals.service';
import { Patient } from '../../../models/patient/patient-interface';
import { Profissionals } from '../../../models/profissionals/profissionals-interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-consultation-list',
  standalone: true,
  imports: [CardModule, TableModule, ButtonModule, CommonModule, DialogModule],
  templateUrl: './consultation-list.html',
  styleUrl: './consultation-list.scss',
})
export class ConsultationList implements OnInit {

  appointments: Consultation[] = [];
  patients: Patient[] = [];
  profissionals: Profissionals[] = [];
  prontuarioDialogVisible = false;
  prontuarioSelecionado: Consultation | null = null;
  today = new Date();

  constructor(
    private router: Router,
    private consultationService: ConsultationService,
    private patientService: PatientService,
    private profissionalsService: ProfissionalsService,
    private dtr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    forkJoin({
      appointments: this.consultationService.listar(),
      patients: this.patientService.listarPacientes(),
      profissionals: this.profissionalsService.listarProfissionals()
    }).subscribe({
      next: ({ appointments, patients, profissionals }) => {
        this.appointments = appointments;
        this.patients = patients;
        this.profissionals = profissionals;
        this.dtr.markForCheck();
      },
      error: (err) => console.error(err)
    });
  }

  getNomePaciente(id: number): string {
    return this.patients.find(p => p.id === id)?.nome ?? '—';
  }

  getNomeProfissional(id: number): string {
    return this.profissionals.find(p => p.id === id)?.nome ?? '—';
  }

  countByStatus(status: string): number {
    return this.appointments.filter(a => a.status === status).length;
  }

  novoAgendamento() {
    this.router.navigate(['/main-layout/consultations/create']);
  }

  continuarAtendimento(id: number) {
    this.consultationService.iniciarAtendimento(id).subscribe({
      next: () => this.router.navigate(['/main-layout/consultations/continue', id]),
      error: (err) => console.error(err)
    });
  }

  abrirProntuario(consulta: Consultation) {
    this.prontuarioSelecionado = consulta;
    this.prontuarioDialogVisible = true;
  }

  fecharProntuario() {
    this.prontuarioDialogVisible = false;
    this.prontuarioSelecionado = null;
  }
}