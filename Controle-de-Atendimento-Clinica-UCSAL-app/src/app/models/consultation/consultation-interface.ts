import { Patient } from "../patient/patient-interface";
import { Profissionals } from "../profissionals/profissionals-interface";

export interface Consultation {
    id: number;
    patientId: number;
    professionalId: number;
    tipo: 'URGENTE' | 'EMERGENCIA' | 'CONSULTA' | 'REVISAO';
    dataInicio: Date;
    dataFim?: Date;
    sintomas: string;
    diagnostico: string;
    medicacao?: string;
    dosagem?: string;
    tratamento?: string;

    status: 'Aguardando' | 'Em-Atendimento' | 'Finalizado';
}