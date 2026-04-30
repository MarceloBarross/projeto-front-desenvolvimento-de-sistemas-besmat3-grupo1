export interface AtendimentoRequest {
    prontuarioId: number;
    profissionalId: number;
    medicacaoId: number;
    quantidadeMedicacaoUtilizada: number;
    tipoAtendimento: 'URGENCIA' | 'EMERGENCIA' | 'CONSULTA' | 'REVISAO';
    dataHoraInicio: Date;
    sintomas: string;
    diagnostico: string;
    medicacaoDosagem: string;
    tratamentoIndicado: string;
    dataHoraEncerramento: Date; // ISO 8601 format
}