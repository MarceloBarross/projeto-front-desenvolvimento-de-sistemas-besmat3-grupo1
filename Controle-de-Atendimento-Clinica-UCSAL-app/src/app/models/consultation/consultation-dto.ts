import { Patient } from "../patient/patient-interface";
import { Profissionals } from "../profissionals/profissionals-interface";

export interface ConsultationDto {
    time: string;
    patient: Patient;
    type: string;
    professional: Profissionals;
}