import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RouterModule } from '@angular/router';
import { MedicationRequest } from '../../../models/medication-request/medication-request-interface';
import { MedicationRequestService } from '../../../services/medication-request.service';

@Component({
  selector: 'app-medication-request-list',
  imports: [CardModule, ButtonModule, TableModule, TagModule, RouterModule],
  templateUrl: './medication-request-list.html',
  styleUrl: './medication-request-list.scss',
})
export class MedicationRequestList implements OnInit {
  requests: MedicationRequest[] = [];

  constructor(private readonly medicationRequestService: MedicationRequestService) {}

  ngOnInit(): void {
    this.medicationRequestService.listRequests().subscribe((requests) => {
      this.requests = requests;
    });
  }

  getPrioritySeverity(priority: MedicationRequest['requestPriority']): 'danger' | 'warn' | 'info' {
    if (priority === 'URGENTE') {
      return 'danger';
    }

    if (priority === 'CRITICO') {
      return 'warn';
    }

    return 'info';
  }
}
