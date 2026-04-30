export type Priority = 'URGENTE' | 'CRITICO' | 'PREVENTIVO';

export interface MedicacaoSolicitacaoRequest {
    medicacaoId: number;
    profissionalId: number;
    caraterSolicitacao: Priority;
}