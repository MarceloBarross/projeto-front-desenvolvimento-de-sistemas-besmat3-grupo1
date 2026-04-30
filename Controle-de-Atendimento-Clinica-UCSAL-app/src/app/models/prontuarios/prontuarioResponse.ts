import { AtendimentoResponse } from "../atendimento/atendimentoResponse";

export interface ProntuatrioResponse {
    id: number;
    pacienteId: number;
    nomePaciente: string;
    atendimentos: AtendimentoResponse[];
}