import { Patient } from "../patient/patient-interface";
import { Profissionals } from "../profissionals/profissionals-interface";

export interface Consultation {
    id: number;
    time: string;
    patient: Patient;
    type: string;
    professional: Profissionals;
    status: string;
    notes: string;
}