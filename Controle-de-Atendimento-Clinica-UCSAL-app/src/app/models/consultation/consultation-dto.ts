import { Patient } from "../patient/patient-interface";
import { Profissionals } from "../profissionals/profissionals-interface";

export interface ConsultationDto {
    patientId: number;
    professionalId: number;
    tipo: 'URGENTE' | 'EMERGENCIA' | 'CONSULTA' | 'REVISAO';
    dataInicio: Date;
    dataFim: Date;
    sintomas: string;
    diagnostico: string;
    medicacao: string;
    dosagem: string;
    tratamento: string;
}