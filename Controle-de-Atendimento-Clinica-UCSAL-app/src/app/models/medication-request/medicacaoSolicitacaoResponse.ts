export type Priority = 'URGENTE' | 'CRITICO' | 'PREVENTIVO';

export interface MedicacaoSolicitacaoResponse {
  id: number;
  medicacaoId: number;
  nomeMedicacao: string;
  profissionalId: number;
  nomeProfissional: string;
  caraterSolicitacao: Priority;
}
