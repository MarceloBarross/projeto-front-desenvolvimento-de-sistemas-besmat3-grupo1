export interface AtendimentoResponse {
    id: number;
    pacienteId: number;
    pacienteNome: string;
    pacienteCategoria: 'COLABORADOR_UNIDADE' | 'COLABORADOR_ESCOLA' | 'ALUNO' | 'EXTERNO';
    profissionalId: number;
    profissionalNome: string;
    medicacaoId: number;
    medicacaoNome: string;
    quantidadeMedicacaoUtilizada: number;
    tipoAtendimento: 'URGENCIA' | 'EMERGENCIA' | 'CONSULTA' | 'REVISAO';
    dataHoraInicio: Date;
    sintomas: string;
    diagnostico: string;
    medicacaoDosagem: string;
    tratamentoIndicado: string;
    dataHoraEncerramento: Date;
}