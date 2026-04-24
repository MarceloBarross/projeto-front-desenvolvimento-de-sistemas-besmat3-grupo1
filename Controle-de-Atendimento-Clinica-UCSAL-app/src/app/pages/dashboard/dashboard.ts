import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ConsultationService } from '../../services/consultation.service';
import { PatientService } from '../../services/patient.service';
import { ProfissionalsService } from '../../services/profissionals.service';
import { MedicationService } from '../../services/medication.service';
import { UserService } from '../../services/user.service';
import { Consultation } from '../../models/consultation/consultation-interface';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  role = '';
  nomeUsuario = '';
  hoje = new Date();

  totalPacientes = 0;
  totalProfissionais = 0;
  totalMedicamentos = 0;
  totalSolicitacoes = 0;

  consultasHoje: Consultation[] = [];

  get aguardando() { return this.consultasHoje.filter(c => c.status === 'Aguardando').length; }
  get emAtendimento() { return this.consultasHoje.filter(c => c.status === 'Em-Atendimento').length; }
  get finalizadas() { return this.consultasHoje.filter(c => c.status === 'Finalizado').length; }

  constructor(
    private userService: UserService,
    private consultationService: ConsultationService,
    private patientService: PatientService,
    private profissionalsService: ProfissionalsService,
    private medicationService: MedicationService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userService.getUser().subscribe(user => {
      this.role = user.role;
      this.nomeUsuario = user.name;
      this.cdr.markForCheck();
    });

    forkJoin({
      consultas: this.consultationService.listar(),
      pacientes: this.patientService.listarPacientes(),
      profissionais: this.profissionalsService.listarProfissionals(),
    }).subscribe(({ consultas, pacientes, profissionais }) => {
      const hoje = new Date().toDateString();
      this.consultasHoje = consultas.filter(
        c => new Date(c.dataInicio).toDateString() === hoje
      );
      this.totalPacientes = pacientes.length;
      this.totalProfissionais = profissionais.length;
      this.cdr.markForCheck();
    });

    this.medicationService.listMedications().subscribe(meds => {
      this.totalMedicamentos = meds.length;
      this.cdr.markForCheck();
    });
  }

  // irParaConsultas() {
  //   this.router.navigate(['/main-layout/consultations']);
  // }
}